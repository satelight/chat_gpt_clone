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

const ChatView = () => {
  const [questionText, setQuestionText] = useState<string>("");
  const [displayQuestionText, setDisplayQuestionText] = useState<string>("");
  const [displayAnswerText, setDisplayAnswerText] = useState<string>("");

  let chatHistory: string[] = [];

  function addDisplayQuestionText() {
    setDisplayQuestionText(questionText);
    chatHistory.push(questionText);
    sendQAndWriteA();
    setQuestionText("");
  }

  // 質問を送って答え表示。。addDisplayQuestionText関数で利用。
  async function sendQAndWriteA() {
    const requestMessage: RequestMessage = {
      role: "user",
      content: questionText,
    };
    const newMessages: RequestMessage[] = [requestMessage];
    const res: string = await sendChatGPTAPI(newMessages);
    console.log(res);
    setDisplayAnswerText(res);
  }

  return (
    <div className="col-span-7">
      <div className="flex-grow bg-white h-96 w-full overflow-auto">
        {displayQuestionText === "" ? (
          <div></div>
        ) : (
          <Question questionText={displayQuestionText} />
        )}

        <Answer answerText={displayAnswerText} />
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
              onChange={(e) => setQuestionText(e.target.value)}
            />
            <button className="" onClick={addDisplayQuestionText}>
              <FaArrowCircleUp className="text-lg  justify-center h-8 w-8 text-slate-400" />
            </button>
          </div>
        </div>
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

export default ChatView;
