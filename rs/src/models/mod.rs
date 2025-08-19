use std::{collections::HashMap, vec};

use napi_derive::napi;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sled::{IVec, Tree};

use crate::{db_ctx, log, structs::TuResult};

#[napi(object)]
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct FileTree {
  pub id: String,
  pub label: String,
  pub items: Vec<TreeItem>
}

#[napi(object)]
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
#[serde(rename_all = "camelCase")]
pub struct TreeItem {
  pub id: String,
  pub tree_id: String,
  pub parent_id: Option<String>,
  pub content_id: Option<String>,
  pub label: String,
  pub r#type: String,
  pub prefix: Option<String>,
}

#[napi(object)]
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct TreeItemContent {
  pub name: String,
  pub id: String,
  pub url: String,
  pub method: String,
  pub params: Vec<(String, String)>,
  pub headers: Vec<(String, String)>,
  pub body: String,
  pub selected: HashMap<String, HashMap<String, bool>>,
}

impl FileTree {
  async fn create_update(db: &Tree, tree: &Self) -> TuResult<String> {
    let id = &tree.id;
    let _ = db.insert(id.as_bytes(), bincode::serialize(&tree)?)?;
    db.flush_async().await?;
    Ok(id.to_string())
  }

  pub async fn create(db: &Tree, label: String) -> TuResult<Self> {
    log!("[create_tree]");
    let tree = Self {
      id: (db.len() + 1).to_string(),
      label, items: vec![]
    };
    Self::create_update(db, &tree).await?;
    Ok(tree)
  }
  pub async fn update(db: &Tree, tree: Self) -> TuResult<String> {
    log!("[update_tree]");
    Self::create_update(db, &tree).await
  }

  pub async fn delete(db: &Tree, id: String) -> TuResult<String> {
    let _ = db.remove(id.as_bytes())?;
    Ok(id)
  }

  pub async fn find_one(db: &Tree, id: String) -> TuResult<Self> {
    let r = db.get(id.as_bytes()).map(|x| {
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

impl TreeItem {
    pub fn db() -> Tree{
        db_ctx().unwrap().tree_items.clone()
    }

    pub fn try_into(bytes: &IVec) -> TuResult<Self>{
        bincode::deserialize::<Self>(bytes).map_err(|err| err.into())
    }

    pub async fn find(filter: Option<Value>) -> TuResult<Vec<Self>>{
        let items = Self::db().iter().filter_map(|x|{
            if x.is_err(){ 
                return None;
            }
            let x = x.unwrap();
            let item = Self::try_into(&x.1).ok()?;

            if filter.is_none(){
                return Some(item);
            }
            let filter = filter.as_ref().unwrap().as_object().unwrap();

            let item_map = serde_json::to_value(item.clone()).expect("Failed to coonvert tree_item to serde_value");
            // log!("{:?}", item_map);
            for (k, v) in filter {
                let item_v = item_map.get(k);
                if let Some(item_v) = item_v{
                    if v == item_v{
                        return Some(item);
                    }
                }
            }
            None
        }).collect::<Vec<_>>();

        Ok(items)
    }

}