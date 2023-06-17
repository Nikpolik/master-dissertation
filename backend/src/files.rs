use crate::settings::get_setting_or_default;
use actix_multipart::Field;
use async_fs::{remove_file, File};
use futures::{AsyncWriteExt, StreamExt};
use rand::distributions::Alphanumeric;
use rand::{thread_rng, Rng};
use std::io::{Error, ErrorKind};

pub struct FileManager {
    pub base_path: String,
}

impl FileManager {
    pub fn init() -> Self {
        Self {
            base_path: get_setting_or_default("FILE_PATH", "./files".to_string()),
        }
    }

    pub async fn delete_file(&self, filepath: &str) -> Result<(), std::io::Error> {
        let path = format!("{}/{}", self.base_path, filepath);
        remove_file(path).await
    }

    pub async fn save_file(&self, mut payload: Field) -> Result<String, Error> {
        let rng = thread_rng();
        let original = match payload.content_disposition().get_filename() {
            Some(v) => v,
            None => return Err(Error::new(ErrorKind::InvalidInput, "No filename present")),
        };

        let prefix: String = rng
            .sample_iter(Alphanumeric)
            .take(8)
            .map(char::from)
            .collect();

        let relative_path = format!("{}_{}", prefix, original);
        let filepath = format!("{}/{}", self.base_path, relative_path);

        let mut file = File::create(&filepath).await?;

        // Field in turn is stream of *Bytes* object
        while let Some(chunk) = payload.next().await {
            let data = match chunk {
                Ok(v) => v,
                Err(c) => {
                    println!("{}", c.to_string());
                    return Err(Error::new(
                        ErrorKind::InvalidInput,
                        "Could not parse chunk of data",
                    ));
                }
            };

            // filesystem operations are blocking, we have to use threadpool
            match file.write_all(&data).await {
                Ok(_) => {}
                Err(err) => {
                    println!("Got error when saving file to disk {}", err.to_string());
                    match err.kind() {
                        ErrorKind::NotFound => {
                            panic!("Could not save file aborting with error {}", err)
                        }
                        _ => {}
                    }
                    return Err(Error::new(
                        ErrorKind::InvalidInput,
                        format!(
                            "Could not write data to file, code os error {:?}",
                            err.raw_os_error()
                        ),
                    ));
                }
            };
        }

        Ok(relative_path)
    }
}
