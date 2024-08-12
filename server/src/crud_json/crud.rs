use anyhow::{Context, Ok};
use lib_chat_gpt::Message;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JsonFile {
    pub file_path: String,
    pub contents: Vec<Message>,
}

impl JsonFile {
    pub fn _new(file_path: &str, contents: &[Message]) -> Self {
        Self {
            file_path: file_path.to_string(),
            contents: contents.to_vec(),
        }
    }

    pub fn create(&self) -> anyhow::Result<()> {
        let f = std::fs::File::create(&self.file_path)
            .with_context(|| format!("cannot open file:{}", &self.file_path))?;
        serde_json::to_writer_pretty(f, &self.contents)?;
        Ok(())
    }

    pub fn read(file_path: &str) -> anyhow::Result<Self> {
        let s = std::fs::read_to_string(file_path)
            .with_context(|| format!("cannot read file:{}", file_path))?;
        let json_file: Self = serde_json::from_str(&s)?;
        Ok(json_file)
    }

    pub fn update(file_path: &str, contents: &[Message]) -> anyhow::Result<Self> {
        let s = std::fs::read_to_string(file_path)
            .with_context(|| format!("cannot read file:{}", file_path))?;
        let mut json_file: Self = serde_json::from_str(&s)?;

        for content in contents {
            json_file.contents.push(content.clone());
        }

        Ok(json_file)
    }

    pub fn delete(file_path: &str) -> anyhow::Result<()> {
        std::fs::remove_file(file_path)?;
        Ok(())
    }

    pub fn read_file_names(dir_path: &str) -> anyhow::Result<Vec<String>> {
        let read_dir = std::fs::read_dir(dir_path)?;
        let mut json_file_names = vec![];
        for entry in read_dir.flatten() {
            if let Some(file_name) = entry.file_name().to_str() {
                if file_name.contains(".json") {
                    json_file_names.push(file_name.replace(".json", "").to_string());
                }
            }
        }

        Ok(json_file_names)
    }
}
