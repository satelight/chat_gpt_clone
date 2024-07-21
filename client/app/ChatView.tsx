"use client";
import React, { useState } from "react";
import axios from "axios";

const ChatView = () => {
  // const conversations = { yourQestion: "koreha" };
  const [formTextData, setFormTextData] = useState<string>("");
  const [chatDisplayData, setChatDisplayData] = useState<string>("");
  const [answerFromChatGPT, setAnswerFromChatGPT] = useState<string>("");

  const setQuestion = async () => {
    setChatDisplayData(formTextData);
    const data = {
      question: formTextData,
    };
    const res = await axios.post("http://localhost:8080/echo", data);
    console.log(res.data);
    setFormTextData("");
    setAnswerFromChatGPT(res.data);
  };

  return (
    <div className="flex flex-col flex-auto h-full p-4 w-full">
      <div className="flex flex-col flex-auto flex-shrink-0 bg-white h-full  p-8">
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full w-full">
            <div className="grid grid-cols-12 gap-y-2">
              {/* あなた */}
              <div className="col-start-1 col-end-8 p-3 rounded-lg">
                <div className="flex flex-row items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                    Q
                  </div>
                  <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                    <div>{chatDisplayData}</div>
                  </div>
                </div>
              </div>

              {/* chat gpt 回答 */}
              <div className="col-start-6 col-end-13 p-3 rounded-lg">
                <div className="flex items-center justify-start flex-row-reverse">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                    A
                  </div>
                  <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                    <div>{answerFromChatGPT}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 添付ファイル用アイコン */}
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
          <div>
            <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
          </div>
          {/* 添付ファイル用アイコン */}

          {/* inputタグの中に↑ボタン */}
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                value={formTextData}
                onChange={(e) => {
                  setFormTextData(e.target.value);
                }}
              />
              <button
                className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                onClick={() => setQuestion()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* inputタグの中に↑ボタン */}
        </div>
        <p className="text-center text-small">
          ChatGPT
          の回答は必ずしも正しいとは限りません。重要な情報は確認するようにしてください。
        </p>
      </div>
    </div>
  );
};

export default ChatView;
