use std::env;

pub fn get_setting_or_default(variable: &str, default: String) -> String {
    match env::var(variable) {
        Ok(value) => value,
        Err(err) => {
            println!(
                "Error getting filepath: {}, using default filepath ./files",
                err.to_string()
            );
            default
        }
    }
}
