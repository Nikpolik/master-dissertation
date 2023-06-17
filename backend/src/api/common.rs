use actix_web::HttpResponse;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ErrorResponse {
    error: String,
}

impl ErrorResponse {
    pub fn from(error: &str) -> Self {
        Self {
            error: error.to_string(),
        }
    }
}

pub fn create_error(error: &str) -> HttpResponse {
    return HttpResponse::UnprocessableEntity().json(ErrorResponse::from(error));
}
