use super::common::{create_error, ErrorResponse};
use crate::files::FileManager;
use crate::models::{
    asset_model::{AssetDTO, UpdateAssetDTO},
    User,
};
use crate::repositories::Repos;
use actix_multipart::Multipart;
use futures_util::stream::StreamExt as _;
use mime::IMAGE;
use serde::{Deserialize, Serialize};

use actix_web::{
    delete, get, post,
    web::{Data, Json, Path},
    HttpResponse,
};
use urlencoding::encode;

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateAssetDTO {
    name: String,
    description: String,
}

#[get("/assets")]
pub async fn get_assets(repos: Data<Repos>, current_user: User) -> HttpResponse {
    let assets = match repos.asset_repo.get_assets(&current_user).await {
        Ok(assets) => assets,
        Err(_) => {
            return create_error("Could not find assets");
        }
    };

    let dtos: Vec<AssetDTO> = assets.iter().map(|a| a.to_dto()).collect();

    HttpResponse::Ok().json(dtos)
}

#[post("/assets")]
pub async fn create_asset(
    repos: Data<Repos>,
    current_user: User,
    payload: Json<CreateAssetDTO>,
) -> HttpResponse {
    let asset = match repos
        .asset_repo
        .create_asset(
            payload.description.to_string(),
            payload.name.to_string(),
            &current_user,
        )
        .await
    {
        Ok(asset) => asset.to_dto(),
        Err(error) => return create_error(&error.to_string()),
    };

    HttpResponse::Ok().json(asset)
}

#[post("/assets/{asset_id}/file")]
pub async fn save_asset_file(
    repos: Data<Repos>,
    current_user: User,
    asset_id: Path<String>,
    file_manager: Data<FileManager>,
    mut form: Multipart,
) -> HttpResponse {
    while let Some(item) = form.next().await {
        let field = match item {
            Ok(field) => field,
            Err(_) => return create_error("Could not parse field from multipart form"),
        };

        let name = match field.content_disposition().get_name() {
            Some(name) => name,
            None => return create_error("Fields name is missing"),
        };

        let content_type = field.content_type().type_();

        if name != "asset" || content_type != IMAGE {
            continue;
        }

        match repos.asset_repo.get_asset(&asset_id, &current_user).await {
            Ok(Some(_)) => {}
            Ok(None) => {
                return HttpResponse::NotFound()
                    .json(ErrorResponse::from("Could not find asset with id"))
            }
            _ => return create_error("unknown error"),
        };

        let filepath = match file_manager.save_file(field).await {
            Ok(v) => v,
            Err(e) => {
                return create_error(&format!(
                    "Could not save file with error: {} kind: {}",
                    e.to_string(),
                    e.kind()
                ));
            }
        };

        match repos
            .asset_repo
            .set_asset_file(&asset_id, &current_user, &filepath)
            .await
        {
            Ok(true) => {
                let encoded_path = encode(&filepath);
                let url = format!("/static/{}", encoded_path);
                return HttpResponse::Ok().json(UpdateAssetDTO {
                    url: Some(url),
                    success: true,
                });
            }
            Err(err) => {
                println!("{}", err.to_string());
            }
            Ok(false) => {
                println!("Could not update matched assets path with new file");
            }
        }

        // failed to update asset clean up file
        match file_manager.delete_file(&filepath).await {
            Ok(_) => return create_error("Could not update asset with new file"),
            Err(_) => {
                return create_error("Could not update asset with new file and clean up failed.")
            }
        };
    }

    create_error("No asset field with content_type image found in the form")
}

#[get("/assets/{asset_id}")]
pub async fn get_asset(
    repos: Data<Repos>,
    current_user: User,
    asset_id: Path<String>,
) -> HttpResponse {
    match repos.asset_repo.get_asset(&asset_id, &current_user).await {
        Ok(Some(asset)) => HttpResponse::Ok().json(asset.to_dto()),
        Ok(None) => {
            HttpResponse::NotFound().json(ErrorResponse::from("Could not find asset with id"))
        }
        _ => create_error("unknown error"),
    }
}

#[delete("/assets/{asset_id}")]
pub async fn delete_asset(
    repos: Data<Repos>,
    current_user: User,
    asset_id: Path<String>,
    file_manager: Data<FileManager>,
) -> HttpResponse {
    let asset = match repos.asset_repo.get_asset(&asset_id, &current_user).await {
        Ok(Some(asset)) => asset,
        Ok(None) => {
            return HttpResponse::NotFound()
                .json(ErrorResponse::from("Could not find asset with id"))
        }
        _ => return create_error("unknown error"),
    };

    let result = match asset.filepath {
        Some(filepath) => file_manager.delete_file(&filepath).await,
        _ => Ok(()),
    };

    if let Err(err) = result {
        return create_error(&err.to_string());
    }

    match repos
        .asset_repo
        .delete_asset(&asset_id, &current_user)
        .await
    {
        Ok(true) => HttpResponse::Ok().finish(),
        _ => create_error("unknown error"),
    }
}

#[post("/assets/{asset_id}")]
pub async fn update_asset(
    repos: Data<Repos>,
    current_user: User,
    payload: Json<CreateAssetDTO>,
    asset_id: Path<String>,
) -> HttpResponse {
    let asset = match repos
        .asset_repo
        .update_asset(
            &asset_id,
            &current_user,
            payload.name.to_string(),
            payload.description.to_string(),
        )
        .await
    {
        Ok(result) => result.to_dto(),
        Err(error) => return create_error(&error.to_string()),
    };

    HttpResponse::Ok().json(asset)
}
