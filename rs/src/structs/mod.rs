use std::{error, fs, sync::Arc};

use crate::{log, DB_CTX};

pub struct DbCtx {
    pub db: sled::Db,
    pub file_trees: sled::Tree,
    pub users: sled::Tree,
    pub tree_item_contents: sled::Tree,
}

impl DbCtx {
    pub fn init(db_name: &str) -> Result<Arc<Self>, Box<dyn error::Error>> {
        if let Some(ctx) = DB_CTX.get(){
            return Ok(ctx.clone());
        }
        log!("Initializing DB at {db_name}...");
        fs::create_dir_all(db_name).unwrap_or_else(|err| {
            println!("Failed to create dirs. {err:?}");
        });

        let db = sled::open(db_name)?;

        let ctx = DbCtx {
            file_trees: db.open_tree("file_trees")?,
            users: db.open_tree("users")?,
            tree_item_contents: db.open_tree("tree_item_contents")?,
            db,
        };
        let ctx = Arc::new(ctx);
        DB_CTX.get_or_init(|| ctx.clone());
        log!("DB initialized!!!");
        Ok(ctx)
    }
}


pub type TuResult<T> = Result<T, Box<dyn error::Error>>;
pub type TuNeonResult<T> = Result<T, String>;