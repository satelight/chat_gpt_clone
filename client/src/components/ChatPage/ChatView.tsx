// 2024-08-13
// react-markdownについては古い記事が多いので
// 公式ドキュメントを参照すること。
// 公式ドキュメント通りにコードのシンタックスハイライトを追加しても
// vscodeからのlint警告があるので注意。今のところバグ修正待ち。
import { useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { sendChatGPTAPI, RequestMessage } from "../../lib/ChatGPT";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

// ユーザー側の質問内容欄
const Question = ({ questionText }: { questionText: string }) => {
  return (
    <div className="w-full">
      <p className="flex mt-4 mx-32 px-8 py-4 break-all rounded-full bg-slate-100 text-lg">
        {questionText}
      </p>
    </div>
  );
};

// chatGPTからの返答欄
const Answer = ({ answerText }: { answerText: string }) => {
  return (
    <div className="w-full">
      <div className="mt-4 mx-32 px-8 bg-white break-all text-lg">
        <CodeBlock markdown={answerText} />
      </div>
    </div>
  );
};

// Loadingからの返答欄
const Loading = () => {
  return (
    <div className="w-full">
      <div className="animate-pulse mt-4 mx-32 px-8 rounded-full text-lg">
        ...回答待ち
      </div>
    </div>
  );
};

// markdown内のコード部分をシンタックスハイライトのコードに変更する
const CodeBlock = ({ markdown }: { markdown: string }) => {
  return (
    <Markdown
      children={markdown}
      components={{
        code(props) {
          // refのlintからの警告はバグのようなので今のところ放置で。動きには問題なし。
          // https://github.com/remarkjs/react-markdown/issues/826
          // https://github.com/remarkjs/react-markdown/issues/666#issuecomment-1001215783
          // 変数refがないとSyntaxHighlighterで警告が出る。
          // 右下のeslint-disable-lineのコメント分でrefの変数を未使用警告を無視できるので追加。
          const { children, className, ref, ...rest } = props; // eslint-disable-line
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              style={okaidia}
            />
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

// main部分
const ChatView = () => {
  // textareaの値の読み取り
  const [questionText, setQuestionText] = useState<string>("");
  // chat内容の値の読み取り
  const [ChatHistorys, setChatHistorys] = useState<RequestMessage[]>([]);
  // 回答待ちのtrue/false
  const [isWaitResponse, setIsWaitResponse] = useState(false);
  // ボタン操作の制御用
  const [isdisableButton, setIsdisableButton] = useState(true);

  // requestを投げるとき用の変数。
  const chatHistorysForRequest: RequestMessage[] = [];

  // 質問を送って答え表示。
  async function sendQAndWriteA() {
    // 質問が返ってくるまでは「回答待ち」の表示と次の質問はできないようにしている。
    setIsWaitResponse(true);
    setIsdisableButton(true);
    const userMessage: RequestMessage = {
      role: "user",
      content: questionText,
    };
    setQuestionText("");

    setChatHistorys((c) => [...c, userMessage]);
    chatHistorysForRequest.push(userMessage); //useStateは随時に変数を更新しないため、普通の配列に入れている。

    const chatGPTAnswer: string = await sendChatGPTAPI(chatHistorysForRequest);
    const answerMessage: RequestMessage = {
      role: "assistant",
      content: chatGPTAnswer,
    };
    chatHistorysForRequest.push(answerMessage); //useStateは随時に変数を更新しないため、普通の配列に入れている。

    setChatHistorys((c) => [...c, answerMessage]);

    // 「回答待ち」の表示と次の質問を受け付けるようにする。
    setIsWaitResponse(false);
    setIsdisableButton(false);
  }

  return (
    <div className="col-span-7">
      <div className="flex-grow bg-white h-96 w-full overflow-auto">
        {ChatHistorys.map((displayChatHistory, index) => (
          <div key={index}>
            {displayChatHistory.role === "user" && (
              <Question questionText={displayChatHistory.content} />
            )}
            {displayChatHistory.role === "assistant" && (
              <Answer answerText={displayChatHistory.content} />
            )}
          </div>
        ))}
        {isWaitResponse === true && <Loading />}
      </div>
      <div className="flex flex-grow justify-center mx-auto w-full h-24 items-center bg-white">
        <div className="flex"></div>
        <div className="flex w-full py-4 px-4">
          <div className="flex flex-auto bg-slate-100 w-full mx-20 my-8 px-8 py-4 rounded-full">
            <textarea
              className="border-0  justify-center bg-slate-100 overflow-x-hidden w-full cursor-auto resize-none focus:outline-none"
              rows={1}
              placeholder="質問を送信する"
              value={questionText}
              onChange={(e) => {
                setQuestionText(e.target.value);
                if (e.target.value.length === 0) {
                  setIsdisableButton(true);
                } else {
                  setIsdisableButton(false);
                }
              }}
            />

            <button
              className=""
              onClick={sendQAndWriteA}
              disabled={isdisableButton}
            >
              <FaArrowCircleUp
                className={
                  isdisableButton == true || isWaitResponse == true
                    ? "text-lg  justify-center h-8 w-8 text-gray-200"
                    : "text-lg  justify-center h-8 w-8 text-slate-600"
                }
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
