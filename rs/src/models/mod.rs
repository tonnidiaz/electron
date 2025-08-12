use std::collections::HashMap;

use napi_derive::napi;
use serde::{Deserialize, Serialize};
use sled::Tree;

use crate::{log, structs::TuResult};

#[napi(object)]
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct FileTree {
  pub id: u32,
  pub label: String,
  pub items: Vec<TreeItem>
}

#[napi(object)]
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct TreeItem {
  pub content_id: Option<u32>,
  pub label: String,
  pub prefix: Option<String>,
  pub children: Option<Vec<TreeItem>>,
}

#[napi(object)]
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct TreeItemContent {
  pub name: String,
  pub id: u32,
  pub url: String,
  pub method: String,
  pub params: Vec<(String, String)>,
  pub headers: Vec<(String, String)>,
  pub body: String,
  pub selected: HashMap<String, bool>,
}

impl FileTree {
  async fn create_update(db: &Tree,  tree: &Self) -> TuResult<u32> {
    let id = tree.id;
    let _ = db.insert(id.to_be_bytes(), bincode::serialize(&tree)?)?;
    db.flush_async().await?;
    Ok(id)
  }

  pub async fn create(db: &Tree, label: String) -> TuResult<Self> {
    log!("[create_tree]");
    let tree = Self{
        id: db.len() as u32 + 1,
        label, items: Vec::new()
    };
    Self::create_update(db, &tree).await?;
    Ok(tree)
  }
  pub async fn update(db: &Tree, tree: Self) -> TuResult<u32> {
    log!("[update_tree]");
    Self::create_update(db, &tree).await
  }

  pub async fn delete(db: &Tree, id: u32) -> TuResult<u32> {
    let _ = db.remove(id.to_be_bytes())?;
    Ok(id)
  }

  pub async fn find_one(db: &Tree, id: u32) -> TuResult<Self> {
    let r = db.get(id.to_be_bytes()).map(|x| {
      if let Some(x) = x {
        Some(bincode::deserialize::<Self>(&x))
      } else {
        None
      }
    })?;
    if let Some(r) = r {
      Ok(r?)
    } else {
      Err("Item not found.".into())
    }
  }


  pub async fn find_all(db: &Tree) -> TuResult<Vec<Self>> {
    let res: Vec<_> = db
      .iter()
      .filter_map(|x| {
        if x.is_err() {
          return None;
        }
        let tree = bincode::deserialize::<Self>(&x.unwrap().1).ok();
        tree
      })
      .collect();
    Ok(res)
  }
}
