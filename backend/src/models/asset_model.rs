use super::common::serialize_object_id;
use super::User;
use bson::oid::ObjectId;
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use urlencoding::encode;

#[serde_with::serde_as]
#[derive(Debug, Serialize, Deserialize)]
pub struct Asset {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    name: String,
    description: String,
    #[serde(rename = "userId")]
    pub user_id: ObjectId,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub filepath: Option<String>,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    created_at: DateTime<Utc>,
}

#[serde_with::serde_as]
#[derive(Debug, Serialize)]
pub struct AssetDTO {
    #[serde(
        skip_serializing_if = "Option::is_none",
        serialize_with = "serialize_object_id"
    )]
    id: Option<ObjectId>,
    name: String,
    description: String,
    #[serde(with = "ts_milliseconds", rename = "createdAt")]
    created_at: DateTime<Utc>,
    url: String,
}

#[derive(Serialize)]
pub struct UpdateAssetDTO {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    pub success: bool,
}

impl Asset {
    pub fn new(name: String, description: String, user: &User) -> Result<Self, &str> {
        let user_id = match user.id {
            Some(id) => id,
            None => return Err("Invalid user, missing id"),
        };

        Ok(Self {
            name,
            description,
            user_id,
            filepath: None,
            id: None,
            created_at: Utc::now(),
        })
    }

    pub fn to_dto(&self) -> AssetDTO {
        let path = self
            .filepath
            .clone()
            .or_else(|| Some("placeholder.png".to_string()))
            .unwrap();

        let encoded_path = encode(&path);
        let url = format!("/static/{}", encoded_path);

        AssetDTO {
            id: self.id.clone(),
            name: self.name.clone(),
            created_at: self.created_at.clone(),
            description: self.description.clone(),
            url,
        }
    }
}
