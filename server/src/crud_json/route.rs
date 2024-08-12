use super::crud::JsonFile;
use actix_web::{get, post, web, HttpResponse, Responder};

const CONTENT_TYPE_STR: &str = "text/plain; charset=utf-8";

#[get("/")]
pub async fn json_crud_route() -> HttpResponse {
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body("Hello! I'm json_crud_route!")
}

#[post("/create")]
pub async fn create(req_body: web::Json<JsonFile>) -> HttpResponse {
    let json_file = req_body.0;

    let _ = json_file.create();
    HttpResponse::Ok().content_type(CONTENT_TYPE_STR).body("ok")
}

#[post("/read")]
pub async fn read(req_body: web::Json<JsonFile>) -> HttpResponse {
    let json_file = req_body.0;

    let read_data = JsonFile::read(&json_file.file_path).unwrap();
    let json_file_string = serde_json::to_string(&read_data).unwrap();
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body(json_file_string)
}

#[post("/update")]
pub async fn update(req_body: web::Json<JsonFile>) -> impl Responder {
    let json_file = req_body.0;

    let _ = JsonFile::update(&json_file.file_path, &json_file.contents);
    HttpResponse::Ok().content_type(CONTENT_TYPE_STR).body("ok")
}

#[post("/delete")]
pub async fn delete(req_body: web::Json<JsonFile>) -> impl Responder {
    let json_file = req_body.0;

    let _ = JsonFile::delete(&json_file.file_path);
    HttpResponse::Ok().content_type(CONTENT_TYPE_STR).body("ok")
}

#[get("/file_names/{dir_path}")]
pub async fn json_file_names(dir_path: web::Path<String>) -> impl Responder {
    let file_names = JsonFile::read_file_names(&dir_path).unwrap();
    let response: String = serde_json::to_string(&file_names).unwrap();
    HttpResponse::Ok()
        .content_type(CONTENT_TYPE_STR)
        .body(response)
}
