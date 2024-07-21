mod crud_json;
use actix_cors::Cors;
use actix_web::{
    get, http, middleware::Logger, post, web, App, HttpResponse, HttpServer, Responder,
};
use lib_chat_gpt::Message;

const CONTENT_TYPE_STR: &str = "text/plain; charset=utf-8";

#[get("/")]
pub async fn hello() -> HttpResponse {
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body("Hello! I'm actix-web!")
}

#[post("/response_chatgpt")]
pub async fn response_chatgpt(req_body: web::Json<Vec<Message>>) -> impl Responder {
    let response = lib_chat_gpt::response_from_chat_gpt(req_body.0)
        .await
        .unwrap();
    println!("{}", response);
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
            .service(web::scope("").service(hello).service(response_chatgpt))
            .service(
                web::scope("/json_crud")
                    .service(crud_json::route::create)
                    .service(crud_json::route::read)
                    .service(crud_json::route::update)
                    .service(crud_json::route::delete),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
