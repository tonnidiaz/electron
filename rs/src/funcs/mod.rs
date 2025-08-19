use chrono::Local;
use napi::Error;
use serde_json::json;

use crate::models::TreeItem;

pub fn stamp() -> String{
    Local::now().to_rfc3339().replace("T", " ").split(".").nth(0).unwrap().to_owned()
}

#[macro_export]
macro_rules! log {

    () => {
        println!();
    };
    ($($arg:expr),*) => {{
        use chrono::Local;
        #[allow(unused_macros)]
        {
            let now = Local::now();
            let msg = format!($($arg),*);
            println!("\n[{}] {}", now.format("%Y-%m-%d %H:%M:%S"), msg);
        }
    }};
}


pub async fn get_tree_items(tree_id: &str) -> napi::Result<Vec<TreeItem>>{
    TreeItem::find(Some(json!({"treeId": tree_id})))
    .await
    .map_err(|err| Error::from_reason(err.to_string()))
}