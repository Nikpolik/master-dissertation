use super::User;
use bson::oid::ObjectId;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct PageDTO {
    id: String,
    #[serde(rename = "pageName")]
    page_name: String,
    #[serde(rename = "rootId")]
    root_id: String,
    #[serde(rename = "createdAt")]
    created_at: i64,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum BlockValue {
    String(String),
    Number(u64),
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum StringOrArray {
    String(String),
    StringArrat(Vec<String>),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Component {
    pub id: String,
    #[serde(rename = "blockName")]
    pub block_name: String,
    pub value: Option<BlockValue>,
    pub inputs: HashMap<String, Vec<String>>,
}

#[serde_with::serde_as]
#[derive(Debug, Serialize, Deserialize)]
pub struct Page {
    #[serde(rename = "_id")]
    #[serde_as(as = "bson::Uuid")]
    pub id: Uuid,
    #[serde(rename = "pageName")]
    page_name: String,
    #[serde(rename = "rootId")]
    #[serde_as(as = "bson::Uuid")]
    root_id: Uuid,
    pub user_id: ObjectId,
    #[serde(with = "bson::serde_helpers::chrono_datetime_as_bson_datetime")]
    created_at: DateTime<Utc>,
    description: String,
    pub components: Vec<Component>,
    pub public_components: Vec<Component>,
}

impl Page {
    pub fn new(page_name: String, description: String, user: &User) -> Result<Page, ()> {
        match user.id {
            Some(user_id) => Ok(Self {
                id: Uuid::new_v4(),
                root_id: Uuid::new_v4(),
                page_name,
                user_id,
                description,
                created_at: Utc::now(),
                components: Vec::new(),
                public_components: Vec::new(),
            }),
            None => Err(()),
        }
    }

    pub fn to_dto(&self) -> PageDTO {
        PageDTO {
            id: self.id.to_string(),
            page_name: self.page_name.clone(),
            root_id: self.root_id.to_string(),
            created_at: self.created_at.timestamp(),
            description: self.description.clone(),
        }
    }
}
