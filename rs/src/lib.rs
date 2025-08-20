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

  for tree in res.iter_mut() {
    if let Ok(items) = get_tree_items(&tree.id).await {
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
  let mut content_id = None;

  let tx = db
    .fetch_and_update(id.as_bytes(), |x_opt| {
      if let Some(x) = x_opt {
        let mut item = bincode::deserialize::<TreeItem>(x).ok()?;

        content_id = item.content_id.clone();
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

  if let Some(content_id) = content_id {
    //   rename content
    let content_db = &db_ctx()?.tree_item_contents;
    let _ = content_db.fetch_and_update(content_id.as_bytes(), |x_opt| {
      if let Some(x) = x_opt {
        if let Ok(mut content) = bincode::deserialize::<TreeItemContent>(x) {
          content.name = label.clone();
          return Some(bincode::serialize(&content).ok()?);
        };
        None
      } else {
        None
      }
    });
  }

  Ok(label)
}

#[napi]
pub async fn set_item_content_id(id: String, content_id: Option<String>) -> Result<Option<String>> {
  let db = &db_ctx()?.tree_items;
  let _tx = db
    .fetch_and_update(id.as_bytes(), |x_opt| {
      if let Some(x) = x_opt {
        let mut item = bincode::deserialize::<TreeItem>(x).ok()?;
        item.content_id = content_id.clone();
        Some(bincode::serialize(&item).ok()?)
      } else {
        None
      }
    })
    .map_err(|err| Error::from_reason(err.to_string()))?;
  Ok(content_id)
}

#[napi]
pub async fn delete_tree_items(ids: Option<Vec<String>>) -> Result<()> {
  let db = &db_ctx()?.tree_items;
  if let Some(ids) = ids {
    for id in ids {
      if let Err(err) = db.remove(id.as_bytes()) {
        log!("Failed to remote item with id: {id}.\n{err:?}");
      } else {
        // Delete children
        db
          .iter()
          .for_each(|x| {
            if let Ok(x) = x {
              if let Ok(val) = bincode::deserialize::<TreeItem>(&x.1) {
                if val.parent_id == Some(id.clone()) {
                  let _ = db.remove(x.0);
                }
              }
            }
          });
      }
    }
  } else {
    // remove all
    db.clear()
      .map_err(|err| Error::from_reason(err.to_string()))?;
  }
  Ok(())
}

#[napi]
pub async fn delete_tree(id: String) -> Result<()> {
  let db = &db_ctx()?.file_trees;
  db.remove(id.as_bytes())
    .map_err(|err| Error::from_reason(err.to_string()))?;
  Ok(())
}
