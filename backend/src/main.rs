mod api;
mod auth;
mod files;
mod models;
mod repositories;
mod settings;

use crate::api::asset_api::{
    create_asset, delete_asset, get_asset, get_assets, save_asset_file, update_asset,
};
use crate::api::page_api::{
    create_page, delete_page, get_page, get_page_components, get_pages, get_public_components,
    publish_page, set_page_components,
};
use crate::api::user_api::{authenticate, create_user, me};
use crate::files::FileManager;
use actix_cors::Cors;
use actix_files::Files;
use actix_web::middleware::Logger;
use actix_web::{get, web::Data, App, HttpResponse, HttpServer, Responder};
use dotenv::dotenv;
use env_logger::Env;
use std::env;

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json("Hello from rust and mongoDB")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    println!("{}: Starting server", chrono::Local::now());
    let repo = match repositories::Repos::init().await {
        Ok(repo) => repo,
        Err(_) => panic!("Could not initialize repositories"),
    };

    println!("{}: Initialized repos", chrono::Local::now());
    let repos = Data::new(repo);
    println!("{}: Initializing file manager", chrono::Local::now());
    let file_manager = Data::new(FileManager::init());
    println!(
        "{}: Initialized manager at path {}",
        chrono::Local::now(),
        file_manager.base_path
    );
    let port = match env::var("PORT") {
        Ok(port) => port
            .parse::<u16>()
            .expect("Could not parse port, it shoud be a u16 number e.g. 8080"),
        Err(_) => 8080,
    };

    println!("{}: Creating application", chrono::Local::now());

    HttpServer::new(move || {
        let cors = Cors::permissive().supports_credentials();

        App::new()
            .wrap(Logger::default())
            .app_data(repos.clone())
            .app_data(file_manager.clone())
            .service(
                Files::new("/static/", format!("{}/", file_manager.base_path)).prefer_utf8(true),
            )
            .service(hello)
            .service(create_user)
            .service(authenticate)
            .service(me)
            .service(create_page)
            .service(get_pages)
            .service(get_page)
            .service(delete_page)
            .service(set_page_components)
            .service(get_page_components)
            .service(get_public_components)
            .service(publish_page)
            .service(create_asset)
            .service(save_asset_file)
            .service(get_asset)
            .service(delete_asset)
            .service(get_assets)
            .service(update_asset)
            .wrap(cors)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}
