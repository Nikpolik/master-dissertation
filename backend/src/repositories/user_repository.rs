extern crate dotenv;

use crate::auth;
use crate::models::user_model::User;
use crate::repositories::mongo_repository::MongoRepo;
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;
use std::fmt::Display;

pub enum CreationError {
    InvalidUsername,
    UserAlreadyExists,
    PasswordHash,
    CouldNotInsert,
}

#[derive(Debug)]
pub enum FindError {
    CouldNotFind,
    NoMatchingUser,
    InvalidPassword,
    TokenGeneration,
}

impl Display for CreationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match &self {
            Self::UserAlreadyExists => write!(f, "User already exists"),
            Self::CouldNotInsert => {
                write!(
                    f,
                    "There was an error when inserting the user to the database"
                )
            }
            Self::PasswordHash => write!(f, "Could not process selected password please try again"),
            Self::InvalidUsername => write!(f, "Username is invalid. It must be between 7 and 30 characters long and not contain special characters"),
        }
    }
}

impl MongoRepo<User> {
    pub async fn create_user(&self, mut new_user: User) -> Result<User, CreationError> {
        new_user.id = None;

        if !new_user.validate_username() {
            return Err(CreationError::InvalidUsername);
        }

        let filter = doc! {"name": &new_user.name};
        let prev_user = self.col.find_one(filter, None).await;

        if prev_user.is_ok() && prev_user.unwrap().is_some() {
            return Err(CreationError::UserAlreadyExists);
        }

        match new_user.hash_password() {
            Ok(_) => {}
            Err(_) => return Err(CreationError::PasswordHash),
        }

        let insert_result = match self.col.insert_one(&new_user, None).await {
            Ok(v) => v,
            Err(error) => {
                println!("Mongo error: {}", error);
                return Err(CreationError::CouldNotInsert);
            }
        };

        new_user.id = insert_result.inserted_id.as_object_id();

        Ok(new_user)
    }

    pub async fn authenticate(&self, name: &str, password: &str) -> Result<String, FindError> {
        let filter = doc! {"name": name};
        let user_option = match self.col.find_one(filter, None).await {
            Ok(v) => v,
            Err(err) => {
                println!("{}", err);
                return Err(FindError::CouldNotFind);
            }
        };

        let user = match user_option {
            Some(v) => v,
            None => return Err(FindError::NoMatchingUser),
        };

        match user.check_password(password) {
            Ok(()) => {}
            Err(()) => return Err(FindError::InvalidPassword),
        }

        let token = match auth::generate_token(user.id.unwrap().to_string()) {
            Ok(v) => v,
            Err(_) => return Err(FindError::TokenGeneration),
        };

        Ok(token)
    }

    pub async fn fetch_user_by_id(&self, id: &str) -> Result<User, FindError> {
        let id = match ObjectId::parse_str(id) {
            Ok(v) => v,
            Err(_) => return Err(FindError::NoMatchingUser),
        };

        let filter = doc! { "_id":  id };

        let query_result = match self.col.find_one(filter, None).await {
            Ok(v) => v,
            Err(_) => return Err(FindError::CouldNotFind),
        };

        match query_result {
            Some(v) => Ok(v),
            None => return Err(FindError::NoMatchingUser),
        }
    }
}
