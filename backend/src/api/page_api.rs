use super::common::create_error;
use crate::{
    models::page_model::Component,
    models::{PageDTO, User},
    repositories::Repos,
};
use actix_web::{
    delete, get, post,
    web::{Data, Json, Path},
    HttpResponse,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreatePageDTO {
    #[serde(rename = "pageName")]
    page_name: String,
    description: String,
}

#[post("/pages")]
pub async fn create_page(
    repos: Data<Repos>,
    current_user: User,
    new_page: Json<CreatePageDTO>,
) -> HttpResponse {
    let page_result = match repos
        .page_repo
        .create_page(
            &current_user,
            new_page.page_name.clone(),
            new_page.description.clone(),
        )
        .await
    {
        Ok(v) => v.to_dto(),
        Err(err) => return create_error(&err.to_string()),
    };

    HttpResponse::Ok().json(page_result)
}

#[get("/pages")]
pub async fn get_pages(repos: Data<Repos>, current_user: User) -> HttpResponse {
    match repos.page_repo.get_pages(&current_user).await {
        Ok(v) => {
            let pages = v.iter().map(|page| page.to_dto()).collect::<Vec<PageDTO>>();
            HttpResponse::Ok().json(pages)
        }
        Err(_) => HttpResponse::NotFound().finish(),
    }
}

#[get("/pages/{page_id}")]
pub async fn get_page(
    repos: Data<Repos>,
    current_user: User,
    page_id: Path<String>,
) -> HttpResponse {
    let page = match repos.page_repo.get_page(&page_id, &current_user).await {
        Ok(v) => v,
        Err(_) => {
            return create_error("Could not fetch data");
        }
    };

    match page {
        Some(page) => HttpResponse::Ok().json(page.to_dto()),
        None => HttpResponse::NotFound().finish(),
    }
}

#[delete("/pages/{page_id}")]
pub async fn delete_page(
    repos: Data<Repos>,
    current_user: User,
    page_id: Path<String>,
) -> HttpResponse {
    match repos.page_repo.delete_page(&page_id, &current_user).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(_) => HttpResponse::UnprocessableEntity().finish(),
    }
}

#[post("/pages/{page_id}/components")]
pub async fn set_page_components(
    repos: Data<Repos>,
    current_user: User,
    page_id: Path<String>,
    components: Json<Vec<Component>>,
) -> HttpResponse {
    match repos
        .page_repo
        .set_page_components(&page_id, &components, &current_user)
        .await
    {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(err) => create_error(&err.to_string()),
    }
}

#[post("/pages/{page_id}/publish")]
pub async fn publish_page(
    repos: Data<Repos>,
    current_user: User,
    page_id: Path<String>,
) -> HttpResponse {
    match repos.page_repo.publish(&page_id, &current_user).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(err) => create_error(&err.to_string()),
    }
}

#[get("/pages/{page_id}/components")]
pub async fn get_page_components(
    repos: Data<Repos>,
    current_user: User,
    page_id: Path<String>,
) -> HttpResponse {
    let page = match repos.page_repo.get_page(&page_id, &current_user).await {
        Ok(v) => v,
        Err(_) => {
            return create_error("Could not fetch page");
        }
    };

    match page {
        Some(p) => HttpResponse::Ok().json(p.components),
        None => HttpResponse::NotFound().body("Could not find page with id"),
    }
}

#[get("/pages/{page_id}/public")]
pub async fn get_public_page(repos: Data<Repos>, page_id: Path<String>) -> HttpResponse {
    let page = match repos.page_repo.get_public_page(&page_id).await {
        Ok(v) => v,
        Err(err) => {
            return create_error(
                format!("Could not fetch page: {} {}", err.to_string(), page_id).as_str(),
            )
        }
    };

    match page {
        Some(p) => HttpResponse::Ok().json(p.to_dto()),
        None => HttpResponse::NotFound().body("Could not find page with id"),
    }
}

#[get("/pages/{page_id}/public/components")]
pub async fn get_public_components(repos: Data<Repos>, page_id: Path<String>) -> HttpResponse {
    let page = match repos.page_repo.get_public_page(&page_id).await {
        Ok(v) => v,
        Err(_) => {
            return create_error("Could not fetch page");
        }
    };

    match page {
        Some(p) => HttpResponse::Ok().json(p.public_components),
        None => HttpResponse::NotFound().body("Could not find page with id"),
    }
}
