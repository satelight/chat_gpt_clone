//! 会話の履歴データはAPIに保存しているわけでない。
//! こちらで会話の履歴を保存する必要がある。
//!
//! こんな感じでデータを送れば履歴おくることができる。
//! システムに答え方の形式やロールの要求する際は"system"　←これについてはサーバー側で固定している。
//! 質問する側:"user"
//! chatGPTの答えた内容は"assistant"
//! [
//!     {"role": "system", "content": "You are a helpful assistant."},
//!     {"role": "user", "content": "こんにちは、天気はどうですか？"},
//!     {"role": "assistant", "content": "こんにちは！今日は晴れています。"},
//!     {"role": "user", "content": "明日の天気は？"}
//! ]

use anyhow::Ok;
use serde::{Deserialize, Serialize};

pub const OPENAI_API_URL: &str = "https://api.openai.com/v1/chat/completions";

/// 答える形式はマークダウン形式で固定。
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

/// chatGPTからのデータ形式は以下のようになる。
/// 必要なデータは[choices]部分のみ
/// {
///   "id": "chatcmpl-123",
///   "object": "chat.completion",
///   "created": 1677652288,
///   "model": "gpt-4o-mini",
///   "system_fingerprint": "fp_44709d6fcb",
///   "choices": [{
///      "index": 0,
///      "message": {
///        "role": "assistant",
///        "content": "\n\nHello there, how may I assist you today?",
///      },
///      "logprobs": null,
///      "finish_reason": "stop"
///   }],
///   "usage": {
///      "prompt_tokens": 9,
///      "completion_tokens": 12,
///      "total_tokens": 21
///   }
/// }
///
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
    let mut msgs = vec![];

    // 最初にAIに返答モデルを設定する。
    let ai_role_model = Message {
        role: "system".to_string(),
        content: String::from(AI_RESPONSE_ROLE),
    };
    msgs.push(ai_role_model);

    // requestメッセージを追加。
    for resqest_message in request_messages {
        msgs.push(resqest_message);
    }
    println!("{:?}", msgs);

    // openAIのAPIにポストリクエストクライエント作成
    let request = ChatGptRequest {
        model: "gpt-3.5-turbo".to_string(),
        messages: msgs,
    };

    // openAIのAPIにリクエストを送る
    let client = reqwest::Client::new();
    let res = client
        .post(OPENAI_API_URL)
        .bearer_auth(api_key)
        .json(&request)
        .send()
        .await?;

    //
    if res.status().is_success() {
        let response: ChatGptResponse = res.json().await.expect("Failed to parse response");
        println!("ChatGPTからの返答:{:?}", response);
        return Ok(response.choices[0].message.content.clone());
    } else {
        print!("NG");
        return Ok(res.text().await?);
    }
}
