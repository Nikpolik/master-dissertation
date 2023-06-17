use mongodb::{Client, Collection};
use std::env;

pub struct MongoRepo<T> {
    pub(super) col: Collection<T>,
}

impl<T> MongoRepo<T> {
    pub async fn init(db_name: &str, collection_name: &str) -> Result<Self, ()> {
        let uri = match env::var("MONGOURI") {
            Ok(v) => v.to_string(),
            Err(_) => return Err(()),
        };
        let client = Client::with_uri_str(uri).await.unwrap();
        let db = client.database(db_name);
        let col: Collection<T> = db.collection(collection_name);
        Ok(Self { col })
    }
}
