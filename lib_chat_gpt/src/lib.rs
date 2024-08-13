//! 会話の履歴データはAPIに保存しているわけでない。
//! こちらで会話の履歴を保存する必要がある。

use anyhow::Ok;
use serde::{Deserialize, Serialize};

pub const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";

/// マークダウン形式で固定。
pub const AI_RESPONSE_ROLE: &str =
    "あなたは優秀なAIアシスタントです。返答はmarkdown形式でお願いします";

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ChatGptRequest {
    model: String,
    messages: Vec<Message>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Message {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ChatGptResponse {
    choices: Vec<Choice>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Choice {
    message: MessageResponse,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct MessageResponse {
    role: String,
    content: String,
}

pub async fn response_from_chat_gpt(
    request_messages: Vec<Message>,
    api_key: &str,
) -> anyhow::Result<String> {
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
