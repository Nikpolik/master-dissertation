use crate::models::{Asset, User};
use crate::repositories::MongoRepo;
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;

pub enum CreationError {
    SaveFileError(String),
    CannotInsert,
}

pub enum FindError {
    CannotFind,
    MongoError,
}

impl ToString for FindError {
    fn to_string(&self) -> String {
        match &self {
            Self::CannotFind => "Could not find asset with given id".to_string(),
            Self::MongoError => "Cannot connect to mongo database".to_string(),
        }
    }
}

impl ToString for CreationError {
    fn to_string(&self) -> String {
        match &self {
            Self::SaveFileError(err) => err.to_string(),
            Self::CannotInsert => "Cannot insert asset to database".to_string(),
        }
    }
}

impl MongoRepo<Asset> {
    pub async fn create_asset(
        &self,
        description: String,
        name: String,
        current_user: &User,
    ) -> Result<Asset, CreationError> {
        let mut asset_record = match Asset::new(name, description, current_user) {
            Ok(asset) => asset,
            Err(_) => return Err(CreationError::CannotInsert),
        };

        let result = self.col.insert_one(&asset_record, None).await;

        match result {
            Ok(result) => {
                asset_record.id = Some(
                    result
                        .inserted_id
                        .as_object_id()
                        .expect("Object id should never be empty"),
                );
                Ok(asset_record)
            }
            Err(_) => Err(CreationError::CannotInsert),
        }
    }

    pub async fn set_asset_file(
        &self,
        asset_id: &str,
        current_user: &User,
        filepath: &str,
    ) -> Result<bool, CreationError> {
        let id = match ObjectId::parse_str(asset_id) {
            Ok(v) => v,
            Err(_) => return Err(CreationError::CannotInsert),
        };
        let query = doc! { "_id":  id, "userId": current_user.id };
        let update = doc! { "$set": { "filepath": filepath }};

        println!("query {} update {}", query, update);
        match self.col.update_one(query, update, None).await {
            Ok(result) => Ok(result.modified_count > 0),
            Err(err) => Err(CreationError::SaveFileError(err.to_string())),
        }
    }

    pub async fn get_assets(&self, current_user: &User) -> Result<Vec<Asset>, FindError> {
        let query = doc! { "userId": current_user.id };
        let mut cursor = match self.col.find(query, None).await {
            Ok(v) => v,
            Err(_) => return Err(FindError::CannotFind),
        };

        let mut pages_vec: Vec<Asset> = Vec::new();

        while let Ok(true) = cursor.advance().await {
            let current_asset = cursor
                .deserialize_current()
                .ok()
                .expect("Could not deserialize_current");
            pages_vec.push(current_asset);
        }

        Ok(pages_vec)
    }

    pub async fn get_asset(
        &self,
        asset_id: &str,
        current_user: &User,
    ) -> Result<Option<Asset>, FindError> {
        let id = match ObjectId::parse_str(asset_id) {
            Ok(v) => v,
            Err(_) => return Err(FindError::CannotFind),
        };
        let query = doc! { "_id": id, "userId": current_user.id };
        match self.col.find_one(query, None).await {
            Ok(asset) => Ok(asset),
            Err(e) => {
                println!("{}", e.to_string());
                Err(FindError::MongoError)
            }
        }
    }

    pub async fn delete_asset(
        &self,
        asset_id: &String,
        current_user: &User,
    ) -> Result<bool, FindError> {
        let id = match ObjectId::parse_str(asset_id) {
            Ok(v) => v,
            Err(_) => return Err(FindError::CannotFind),
        };
        let query = doc! { "_id": id, "userId": current_user.id };

        match self.col.delete_one(query, None).await {
            Ok(result) => Ok(result.deleted_count == 1),
            Err(e) => {
                println!("{}", e.to_string());
                return Err(FindError::MongoError);
            }
        }
    }

    pub async fn update_asset(
        &self,
        asset_id: &String,
        current_user: &User,
        name: String,
        description: String,
    ) -> Result<Asset, FindError> {
        let id = match ObjectId::parse_str(asset_id) {
            Ok(v) => v,
            Err(_) => return Err(FindError::CannotFind),
        };
        let query = doc! { "_id": id, "userId": current_user.id };

        match self.col.find_one(query.clone(), None).await {
            Ok(Some(asset)) => asset,
            Ok(None) => return Err(FindError::CannotFind),
            Err(e) => {
                println!("{}", e.to_string());
                return Err(FindError::MongoError);
            }
        };

        let update = doc! { "$set": { "name": name, "description": description }};

        match self.col.update_one(query.clone(), update, None).await {
            Ok(_) => match self.col.find_one(query.clone(), None).await {
                Ok(Some(asset)) => Ok(asset),
                Ok(None) => Err(FindError::CannotFind),
                Err(e) => {
                    println!("{}", e.to_string());
                    return Err(FindError::MongoError);
                }
            },
            Err(e) => {
                println!("{}", e.to_string());
                return Err(FindError::MongoError);
            }
        }
    }
}
