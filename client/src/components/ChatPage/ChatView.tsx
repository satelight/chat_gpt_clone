import { useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { sendChatGPTAPI, RequestMessage } from "../../lib/ChatGPT";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism";

const Question = ({ questionText }: { questionText: string }) => {
  return (
    <div className="w-full">
      <p className="flex mt-4 mx-32 px-8 py-4 break-all rounded-full bg-slate-100 text-lg">
        {questionText}
      </p>
    </div>
  );
};

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
  const [QuestionText, setQuestionText] = useState<string>("");
  const [displayQuestionText, setDisplayQuestionText] = useState<string>("");
  const [displayAnswerText, setDisplayAnswerText] = useState<string>("");

  // let  historyTalk =

  function addDisplayQuestionText() {
    setDisplayQuestionText(QuestionText);
    fetchData();
    setQuestionText("");
  }

  async function fetchData() {
    const requestMessage: RequestMessage = {
      role: "user",
      content: QuestionText,
    };
    const newMessages: RequestMessage[] = [requestMessage];
    const res: string = await sendChatGPTAPI(newMessages);
    console.log(res);
    setDisplayAnswerText(res);
  }

  return (
    <div className="col-span-7">
      <div className="flex-grow bg-white h-96 w-full overflow-auto">
        <Question questionText={displayQuestionText} />
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
              value={QuestionText}
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

const CodeBlock = ({ markdown }: { markdown: string }) => {
  return (
    <Markdown
      children={markdown}
      components={{
        code(props) {
          // refのlintからの警告はバグのようなので今のところ放置で。動きには問題なし。
          // https://github.com/remarkjs/react-markdown/issues/826
          // https://github.com/remarkjs/react-markdown/issues/666#issuecomment-1001215783
          const { children, className, ref, ...rest } = props;
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
