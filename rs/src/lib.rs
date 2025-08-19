#![deny(clippy::all)]
mod funcs;
mod models;
mod structs;

use funcs::get_tree_items;
use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use models::{FileTree, TreeItem, TreeItemContent};
use once_cell::sync::OnceCell;
use structs::DbCtx;

static DB_CTX: OnceCell<Arc<DbCtx>> = OnceCell::new();
fn db_ctx() -> Result<Arc<DbCtx>> {
  let db_ctx = DB_CTX
    .get()
    .ok_or_else(|| Error::from_reason("Db uninitialized."))?
    .clone();
  Ok(db_ctx)
}

#[derive(Serialize, Deserialize, Debug)]
struct User {
  id: u64,
  name: String,
  age: u64,
}
#[napi]
pub fn hello(name: String) -> String {
  format!("hello {name}")
}

#[derive(Serialize, Deserialize, PartialEq, Clone)]
struct Person {
  id: i64,
  name: String,
  age: i64,
}

#[napi]
pub fn init_db(db_name: String) -> Result<String> {
  DbCtx::init(&db_name).map_err(|err| Error::from_reason(err.to_string()))?;
  Ok(db_name)
}

#[napi]
pub async fn fetch_trees() -> Result<Vec<FileTree>> {
  let mut res = FileTree::find_all(&db_ctx()?.file_trees)
    .await
    .map_err(|err| Error::from_reason(err.to_string()))?;

    for tree in res.iter_mut(){
     if let Ok(items) = get_tree_items(&tree.id).await{
        tree.items = items;
     }   
    }
  log!("{{ trees: {} }}", res.len());
  Ok(res)
}

#[napi]
pub async fn fetch_tree(id: String) -> Result<FileTree> {
  let mut res = FileTree::find_one(&db_ctx()?.file_trees, id)
    .await
    .map_err(|err| Error::from_reason(err.to_string()))?;

  res.items = get_tree_items(&res.id).await?;
  Ok(res)
}

#[napi]
pub async fn create_tree(label: String) -> Result<FileTree> {
  let res = FileTree::create(&db_ctx()?.file_trees, label)
    .await
    .map_err(|err| Error::from_reason(err.to_string()))?;
  Ok(res)
}

#[napi]
pub async fn create_tree_item_content() -> Result<TreeItemContent> {
  let db = &db_ctx()?.tree_item_contents;
  let item = TreeItemContent {
    id: (db.len() + 1).to_string(),
    ..Default::default()
  };
  let _ = db.insert(
    item.id.as_bytes(),
    bincode::serialize(&item).expect("Failed to ser item"),
  );
  Ok(item)
}


#[napi]
pub async fn update_tree(data: String) -> Result<()> {
  let data: FileTree =
    serde_json::from_str(&data).map_err(|err| Error::from_reason(err.to_string()))?;
  println!("\n{data:?}");
  let _ = FileTree::update(&db_ctx()?.file_trees, data)
    .await
    .map_err(|err| Error::from_reason(err.to_string()))?;
  Ok(())
}

#[napi]
pub async fn update_tree_item_content(data: String) -> Result<()> {
  let db = &db_ctx()?.tree_item_contents;
  let item: TreeItemContent =
    serde_json::from_str(&data).map_err(|err| Error::from_reason(err.to_string()))?;
  let _ = db.insert(
    item.id.as_bytes(),
    bincode::serialize(&item).expect("Failed to ser item"),
  );
  Ok(())
}

#[napi]
pub async fn get_tree_item_content(id: String) -> Result<TreeItemContent> {
  let db = &db_ctx()?.tree_item_contents;
  let item_opt = db
    .get(id.as_bytes())
    .map(|x| {
      if let Some(x) = x {
        Some(bincode::deserialize::<TreeItemContent>(&x).expect("Failed to ser item"))
      } else {
        None
      }
    })
    .map_err(|err| Error::from_reason(err.to_string()))?;
  if let Some(item) = item_opt {
    Ok(item)
  } else {
    Err(Error::from_reason("Item not found."))
  }
}

#[napi]
pub async fn create_tree_item(mut new_item: TreeItem) -> Result<TreeItem> {
  let db = &db_ctx()?.tree_items;
  new_item.id = format!("{}", db.len() + 1);
  let _tx = db
    .insert(
      new_item.id.as_bytes(),
      bincode::serialize(&new_item).map_err(|err| Error::from_reason(err.to_string()))?,
    )
    .map_err(|err| Error::from_reason(err.to_string()))?;
  /* if tx.is_none() {
    return Err(Error::from_reason("Failed to create tree item."));
  }; */
  Ok(new_item)
}

#[napi]
pub async fn rename_tree_item(id: String, label: String) -> Result<String> {
  let db = &db_ctx()?.tree_items;
  let tx = db
    .fetch_and_update(id.as_bytes(), |x_opt| {
      if let Some(x) = x_opt {
        let mut item = bincode::deserialize::<TreeItem>(x).ok()?;
        item.label = label.clone();
        Some(bincode::serialize(&item).ok()?)
      } else {
        None
      }
    })
    .map_err(|err| Error::from_reason(err.to_string()))?;

  if tx.is_none() {
    return Err(Error::from_reason("Failed to rename tree item."));
  };
  Ok(label)
}

