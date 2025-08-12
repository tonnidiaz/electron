use chrono::Local;

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

