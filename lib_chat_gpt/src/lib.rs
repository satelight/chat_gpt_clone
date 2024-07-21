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

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatGptRequest {
    model: String,
    messages: Vec<Message>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ChatGptResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Choice {
    message: MessageResponse,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MessageResponse {
    role: String,
    content: String,
}

pub async fn response_from_chat_gpt(request_messages: Vec<Message>) -> anyhow::Result<String> {
    // .envファイルの記述を環境変数に追加。
    dotenv().ok();
    let api_key = env::var("OPENAI_API_KEY").expect("OPENAI_API_KEY must be set");

    // リクエスト用メッセージ作成。
    let ai_role_model = Message {
        role: "system".to_string(),
        content: String::from(AI_RESPONSE_ROLE),
    };
    let mut msgs = vec![];
    msgs.push(ai_role_model);
    println!("{:?}", request_messages);
    for resqest_message in request_messages {
        msgs.push(resqest_message);
    }

    println!("{:?}", msgs);
    // openAIのAPIにポストリクエストクライエント作成
    let client = reqwest::Client::new();
    let request = ChatGptRequest {
        model: "gpt-3.5-turbo".to_string(),
        messages: msgs,
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
        println!("{:?}", response.choices[0]);
        return Ok(response.choices[0].message.content.clone());
    } else {
        print!("NG");
        return Ok(res.text().await?);
    }
}
