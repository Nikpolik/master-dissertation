use crate::models::user_model::User;
use crate::repositories::Repos;
use actix_web::web::Data;
use actix_web::{error::ErrorUnauthorized, Error, FromRequest};
use futures::future::Future;
use hmac::{Hmac, Mac};
use jwt::{SignWithKey, VerifyWithKey};
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use std::env;
use std::pin::Pin;

#[derive(Debug, Serialize, Deserialize)]
pub struct JWT {
    pub id: String,
}


pub fn generate_token(id: String) -> Result<String, jwt::Error> {
    let secret = env::var("SECRET").expect("Variable SECRET not initialized in env");

    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();
    let claims = JWT { id };

    return claims.sign_with_key(&key);
}

pub fn decrypt_token(token: &str) -> Result<JWT, jwt::Error> {
    let secret = env::var("SECRET").expect("Variable SECRET not initialized in env");
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

    return token.verify_with_key(&key);
}

impl FromRequest for User {
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output = Result<User, Error>>>>;

    fn from_request(req: &actix_web::HttpRequest, _: &mut actix_web::dev::Payload) -> Self::Future {
        let req = req.clone();
        Box::pin(async move {
            let repos = req.app_data::<Data<Repos>>().unwrap();
            let header_option = req.headers().get("Authorization");
            let header_result = match header_option {
                Some(v) => v,
                None => return Err(ErrorUnauthorized("Could not extract bearer header")),
            };

            let header_parts = match header_result.to_str() {
                Ok(v) => v,
                Err(_) => return Err(ErrorUnauthorized("Could not convert header to string")),
            }
            .split_whitespace()
            .collect::<Vec<&str>>();

            let token = match header_parts.get(1) {
                Some(v) => v,
                None => {
                    return Err(ErrorUnauthorized(
                        "Could not split header or not enough values",
                    ))
                }
            };

            let jwt = match decrypt_token(token) {
                Ok(v) => v,
                Err(_) => return Err(ErrorUnauthorized("Could not validate token")),
            };

            match repos.user_repo.fetch_user_by_id(&jwt.id).await {
                Ok(v) => Ok(v),
                Err(_) => Err(ErrorUnauthorized("Could not find user by token id")),
            }
        })
    }
}
