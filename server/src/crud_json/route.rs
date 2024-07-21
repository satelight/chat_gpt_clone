use actix_web::{get, post, web, HttpResponse, Responder};
use lib_chat_gpt::Message;

const CONTENT_TYPE_STR: &str = "text/plain; charset=utf-8";

#[post("/create")]
pub async fn create(req_body: web::Json<Vec<Message>>) -> HttpResponse {
    let response = lib_chat_gpt::response_from_chat_gpt(req_body.0)
        .await
        .unwrap();
    println!("{}", response);
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body(response)
}

#[get("/read")]
pub async fn read(req_body: web::Json<Vec<Message>>) -> HttpResponse {
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body("Hello! I'm actix-web!")
}

#[post("/update")]
pub async fn update(req_body: web::Json<Vec<Message>>) -> impl Responder {
    let response = lib_chat_gpt::response_from_chat_gpt(req_body.0)
        .await
        .unwrap();
    println!("{}", response);
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body(response)
}

#[post("/delete")]
pub async fn delete(req_body: web::Json<Vec<Message>>) -> impl Responder {
    let response = lib_chat_gpt::response_from_chat_gpt(req_body.0)
        .await
        .unwrap();
    println!("{}", response);
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body(response)
}
