use crate::models::{Component, Page, User};
use crate::repositories::MongoRepo;
use mongodb::bson::doc;

pub enum PageRepoError {
    CannotCreatePage,
    CannotInsert,
    IdParseError,
    MongoError,
    CannotFind,
}

impl ToString for PageRepoError {
    fn to_string(&self) -> String {
        match &self {
            Self::CannotCreatePage => "Cannot perform create/update operation".to_string(),
            Self::CannotInsert => "Cannot insert page".to_string(),
            Self::IdParseError => "Could not parse page id to valid uuid".to_string(),
            Self::MongoError => "Could not execute mongodb query".to_string(),
            Self::CannotFind => "Could not find page with corresponding page id".to_string(),
        }
    }
}

impl MongoRepo<Page> {
    pub async fn create_page(
        &self,
        current_user: &User,
        page_name: String,
        description: String,
    ) -> Result<Page, PageRepoError> {
        let page = match Page::new(page_name, description, current_user) {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::CannotCreatePage),
        };

        match self.col.insert_one(&page, None).await {
            Ok(_) => Ok(page),
            Err(_) => Err(PageRepoError::CannotInsert),
        }
    }

    pub async fn get_pages(&self, current_user: &User) -> Result<Vec<Page>, PageRepoError> {
        let query = doc! { "user_id": current_user.id };

        let mut cursor = match self.col.find(query, None).await {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::CannotFind),
        };

        let mut pages_vec: Vec<Page> = Vec::new();

        while let Ok(true) = cursor.advance().await {
            let current_page = cursor
                .deserialize_current()
                .ok()
                .expect("Could not deserialize_current");
            pages_vec.push(current_page);
        }

        return Ok(pages_vec);
    }

    pub async fn get_page(
        &self,
        page_id: &String,
        current_user: &User,
    ) -> Result<Option<Page>, PageRepoError> {
        let parsed_id = match uuid::Uuid::parse_str(page_id) {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::IdParseError),
        };
        let query = doc! { "user_id": current_user.id, "_id": parsed_id};
        println!("{}", query);

        match self.col.find_one(query, None).await {
            Ok(v) => Ok(v),
            Err(_) => Err(PageRepoError::CannotFind),
        }
    }

    pub async fn delete_page(
        &self,
        page_id: &String,
        current_user: &User,
    ) -> Result<(), PageRepoError> {
        let parsed_id = match uuid::Uuid::parse_str(page_id) {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::IdParseError),
        };

        let query = doc! { "user_id": current_user.id, "_id": parsed_id};
        let result = match self.col.delete_one(query, None).await {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::MongoError),
        };

        if result.deleted_count > 0 {
            Ok(())
        } else {
            Err(PageRepoError::CannotFind)
        }
    }

    pub async fn set_page_components(
        &self,
        page_id: &String,
        components: &Vec<Component>,
        current_user: &User,
    ) -> Result<(), PageRepoError> {
        let parsed_id = match uuid::Uuid::parse_str(page_id) {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::IdParseError),
        };
        let query = doc! { "user_id": current_user.id, "_id": parsed_id};
        let serialized_inputs = match bson::to_bson(components) {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::CannotInsert),
        };

        let update = doc! { "$set": { "components": serialized_inputs }};
        match self.col.update_one(query, update, None).await {
            Ok(_) => Ok(()),
            Err(_) => return Err(PageRepoError::CannotInsert),
        }
    }

    pub async fn publish(
        &self,
        page_id: &String,
        current_user: &User,
    ) -> Result<bool, PageRepoError> {
        let parsed_id = match uuid::Uuid::parse_str(page_id) {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::IdParseError),
        };
        let query = doc! { "user_id": current_user.id, "_id": parsed_id};
        let page = match self.col.find_one(query, None).await {
            Ok(Some(page)) => page,
            _ => return Err(PageRepoError::CannotFind),
        };

        println!("{:?}", &page.components);
        let serialized_inputs = match bson::to_bson(&page.components) {
            Ok(v) => v,
            Err(_) => return Err(PageRepoError::CannotFind),
        };
        let update = doc! { "$set": { "public_components": serialized_inputs }};
        let query = doc! { "user_id": current_user.id, "_id": parsed_id};
        match &self.col.update_one(query, update, None).await {
            Ok(result) => Ok(result.matched_count > 0),
            Err(_) => Err(PageRepoError::CannotInsert),
        }
    }
}
