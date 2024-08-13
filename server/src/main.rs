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
    get, http, http::header::ContentType, middleware::Logger, post, web, App, HttpResponse,
    HttpServer, Responder,
};
use dotenv::dotenv;
use lib_chat_gpt::Message;
use std::env;

const CONTENT_TYPE_STR: &str = "text/plain; charset=utf-8";

#[get("/")]
pub async fn hello() -> HttpResponse {
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body("Hello! I'm actix-web!")
}

#[post("/response_chatgpt")]
pub async fn response_chatgpt(req_body: web::Json<Vec<Message>>) -> impl Responder {
    // 環境変数からapiキーを取得
    let api_key = env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY must be set");
    let response = lib_chat_gpt::response_from_chat_gpt(req_body.0, &api_key)
        .await
        .unwrap();
    println!("{}", response);
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
            .allowed_origin("http://localhost:5173")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::new("%a %{User-agent}i"))
            .service(hello)
            .service(response_chatgpt)
            .service(
                web::scope("/json_crud")
                    .service(crud_json::route::read)
                    .service(crud_json::route::update)
                    .service(crud_json::route::delete)
                    .service(crud_json::route::json_crud_route)
                    .service(crud_json::route::json_file_names),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
