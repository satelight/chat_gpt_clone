use actix_cors::Cors;
use actix_web::{
    get, http, middleware::Logger, post, web, App, HttpResponse, HttpServer, Responder,
};

const CONTENT_TYPE_STR: &str = "text/plain; charset=utf-8";

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct FrontEndRequest {
    pub question: String,
}

#[get("/")]
async fn hello() -> HttpResponse {
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body("Hello! I'm actix-web!")
}

#[post("/echo")]
async fn echo(req_body: actix_web::web::Json<FrontEndRequest>) -> impl Responder {
    let response = lib_chat_gpt::response_from_chat_gpt(&req_body.question)
        .await
        .unwrap();
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // logger設定
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    HttpServer::new(|| {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
            .allowed_header(http::header::CONTENT_TYPE)
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::new("%a %{User-agent}i"))
            .service(hello)
            .service(echo)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
