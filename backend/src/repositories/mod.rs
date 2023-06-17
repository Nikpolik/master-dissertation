mod asset_repository;
mod errors;
mod mongo_repository;
mod page_repository;
mod user_repository;

use self::mongo_repository::MongoRepo;
use crate::models::{Asset, Component, Page, User};

pub struct Repos {
    pub user_repo: MongoRepo<User>,
    pub component_repo: MongoRepo<Component>,
    pub page_repo: MongoRepo<Page>,
    pub asset_repo: MongoRepo<Asset>,
}

impl Repos {
    pub async fn init() -> Result<Self, ()> {
        let user_repo: MongoRepo<User> = MongoRepo::init("dev", "User").await?;
        let component_repo: MongoRepo<Component> = MongoRepo::init("dev", "Component").await?;
        let page_repo: MongoRepo<Page> = MongoRepo::init("dev", "Page").await?;
        let asset_repo: MongoRepo<Asset> = MongoRepo::init("dev", "Asset").await?;

        Ok(Self {
            user_repo,
            component_repo,
            page_repo,
            asset_repo,
        })
    }
}
