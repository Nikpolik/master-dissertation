use super::common::create_error;
use crate::{models::user_model::User, repositories::Repos};
use actix_web::{
    get, post,
    web::{Data, Json},
    HttpResponse,
};
use serde::{Deserialize, Serialize};

#[post("/user")]
pub async fn create_user(repos: Data<Repos>, new_user: Json<User>) -> HttpResponse {
    let user_detail = repos.user_repo.create_user(new_user.into_inner()).await;
    match user_detail {
        Ok(user) => HttpResponse::Ok().json(user.to_dto()),
        Err(err) => create_error(&err.to_string()),
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthenticateDTO {
    name: String,
    password: String,
}
#[derive(Serialize)]
pub struct TokenResponseDTO {
    token: String,
}
#[post("/user/authenticate")]
pub async fn authenticate(repos: Data<Repos>, data: Json<AuthenticateDTO>) -> HttpResponse {
    let user_detail = repos
        .user_repo
        .authenticate(&data.name, &data.password)
        .await;

    match user_detail {
        Ok(jwt) => HttpResponse::Ok().json(TokenResponseDTO { token: jwt }),
        Err(_) => create_error("Invalid username or password"),
    }
}

#[get("/user/me")]
pub async fn me(user: User) -> HttpResponse {
    HttpResponse::Ok().json(user.to_dto())
}
