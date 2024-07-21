//! ルートディレクトリに.envファイルで環境変数を追加する必要がある。
//! 以下を追加する。
//!
//! ```
//! OPENAI_API_KEY=""
//! ```
//!
//!
//! 会話の履歴データはAPIに保存しているわけでない。
//! こちらで会話の履歴を保存する必要がある。

use anyhow::Ok;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::env;

pub const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";
pub const AI_RESPONSE_ROLE: &str = "あなたは優秀なAIアシスタントです。";

#[derive(Serialize)]
pub struct ChatGptRequest {
    id: String,
    model: String,
    messages: Vec<Message>,
}

#[derive(Serialize)]
pub struct Message {
    role: String,
    content: String,
}

#[derive(Deserialize, Debug)]
pub struct ChatGptResponse {
    id: String,
    choices: Vec<Choice>,
}

#[derive(Deserialize, Debug)]
pub struct Choice {
    message: MessageResponse,
}

#[derive(Deserialize, Debug)]
pub struct MessageResponse {
    role: String,
    content: String,
}

pub async fn response_from_chat_gpt(question: &str) -> anyhow::Result<String> {
    // .envファイルの記述を環境変数に追加。
    dotenv().ok();
    let api_key = env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY must be set");

    // openAIのAPIにポストリクエストクライエント作成
    let client = reqwest::Client::new();
    let request = ChatGptRequest {
        id: String::from("chatcmpl-9nGIn8jEeBc1tmLtZg5J7ljLDbSk5"),
        model: "gpt-3.5-turbo".to_string(),
        messages: vec![
            Message {
                role: "system".to_string(),
                content: String::from(AI_RESPONSE_ROLE),
            },
            Message {
                role: "user".to_string(),
                content: String::from(question),
            },
        ],
    };

    // openAIのAPIにリクエストを送る
    let res = client
        .post(OPENAI_API_URL)
        .bearer_auth(api_key)
        .json(&request)
        .send()
        .await?;

    //
    if res.status().is_success() {
        let response: ChatGptResponse = res.json().await.expect("Failed to parse response");
        return Ok(response.choices[0].message.content.clone());
    } else {
        return Ok(res.text().await?);
    }
}
