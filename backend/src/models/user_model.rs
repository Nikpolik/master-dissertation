use super::common::serialize_object_id;
use bcrypt::{hash, verify, DEFAULT_COST};
use bson::oid::ObjectId;
use regex::Regex;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    password: String,
}

#[derive(Debug, Serialize)]
pub struct UserDTO {
    #[serde(
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_object_id"
    )]
    pub id: Option<ObjectId>,
    pub name: String,
}

fn hash_string(passphrase: &String) -> Result<String, ()> {
    let output = hash(passphrase, DEFAULT_COST);

    let hashed_string = match output {
        Ok(v) => v,
        Err(_) => return Err(()),
    };

    Ok(hashed_string)
}

impl User {
    pub fn hash_password(&mut self) -> Result<&mut Self, ()> {
        let hashed_password = match hash_string(&self.password) {
            Ok(v) => v,
            Err(_) => return Err(()),
        };

        self.password = hashed_password;

        Ok(self)
    }

    pub fn check_password(&self, potential_password: &str) -> Result<(), ()> {
        let result = match verify(potential_password, &self.password) {
            Ok(v) => v,
            Err(_) => return Err(()),
        };

        if result {
            Ok(())
        } else {
            Err(())
        }
    }

    pub fn validate_username(&self) -> bool {
        let username_regexp = Regex::new(r"^[A-Za-z][A-Za-z0-9_]{7,29}$").unwrap();
        username_regexp.is_match(&self.name)
    }

    pub fn to_dto(&self) -> UserDTO {
        UserDTO {
            id: self.id,
            name: self.name.clone(),
        }
    }
}
