//! ルートディレクトリに.envファイルで環境変数を追加する必要がある。
//! 以下を追加する。
//!
//! ```
//! OPENAI_API_KEY=""
//! ```
//!
//!

mod crud_json;
use actix_cors::Cors;
use actix_web::{
    http::{self, header::ContentType},
    middleware::Logger,
    web, App, HttpResponse, HttpServer, Responder,
};

use dotenv::dotenv;
use lib_chat_gpt::Message;
use std::env;

pub async fn response_chatgpt(req_body: web::Json<Vec<Message>>) -> impl Responder {
    // 環境変数からapiキーを取得
    let api_key = env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY must be set");
    let response = lib_chat_gpt::response_from_chat_gpt(req_body.0, &api_key)
        .await
        .unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::plaintext())
        .body(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // .envファイルの記述を環境変数に追加。
    dotenv().ok();

    // logger設定
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:5173") // 開発用の許可ポート番号
            .allowed_origin("http://localhost:8080") // 開発用の許可ポート番号
            .allowed_methods(vec!["GET", "POST", "OPTIONS"]) // 開発用の許可メソッド
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::new("%a %{User-agent}i"))
            .service(web::resource("/response_chatgpt").route(web::post().to(response_chatgpt)))
            .service(
                web::scope("/json_crud")
                    .service(crud_json::route::read)
                    .service(crud_json::route::update)
                    .service(crud_json::route::delete)
                    .service(crud_json::route::json_crud_route)
                    .service(crud_json::route::json_file_names),
            )
            // 最後に書かないとすべてのルートがgetメソッド限定として動く。一番下に書くこと。
            .service(actix_files::Files::new("/", "dist").index_file("index.html"))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
