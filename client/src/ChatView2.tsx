// // "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface RequestMessage {
//   role: string;
//   content: string;
// }

// type Props = {
//   inputData?: string;
//   question?: string;
//   answer?: string;
// };

// type Conversations = {
//   questions?: string[];
//   answers?: string[];
// };

// export const QuestionSection: React.FC<Props> = (props) => {
//   return (
//     <div className="p-3 rounded-lg">
//       <div className="flex flex-row items-center">
//         {/* <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"> */}
//         <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
//           Q
//         </div>
//         <div className="ml-3 text-sm bg-white py-1 px-1 shadow rounded-xl">
//           <div className="w-9/12">
//             <div>test-------------------------</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export const AnswerSection: React.FC<Props> = (props) => {
//   return (
//     <div className="col-start p-3 rounded-lg">
//       <div className="flex items-center justify-center h-10 w-10 mt-4 rounded-full bg-indigo-500 flex-shrink-0">
//         A
//       </div>
//       <div className="flex items-center justify-start ">
//         <div className="mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl w-full ">
//           <div>{props.answer}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChatView = () => {
//   // -----------------------------------------------------------------------------
//   const [formTextData, setFormTextData] = useState<string>("");
//   const [questionDisplayDatas, setQuestionDisplayDatas] = useState<string[]>(
//     []
//   );
//   const [answerDisplayDatas, setAnswerDisplayDatas] = useState<string[]>([]);
//   let newRequestMessages: RequestMessage[] = [];
//   // -----------------------------------------------------------------------------
//   //
//   //
//   // -----------------------------------------------------------------------------
//   const setQuestion = async () => {
//     setQuestionDisplayDatas([...questionDisplayDatas, formTextData]);
//     console.log("questionDisplayDatas:", questionDisplayDatas);
//     let insertData: RequestMessage = {
//       role: "user",
//       content: formTextData,
//     };

//     // useStateはDOMの変化がないときは即座に変数に反映しない仕様なので、新しい変数にディープコピーして挿入。
//     newRequestMessages.push(insertData);
//     setFormTextData("");
//     const res = await axios.post(
//       "http://localhost:8080/response_chatgpt",
//       newRequestMessages
//     );
//     // console.log(res.data);
//     setAnswerDisplayDatas([...answerDisplayDatas, res.data]);
//     let resData: RequestMessage = {
//       role: "assistant",
//       content: res.data,
//     };
//     newRequestMessages.push(resData);
//   };
//   // -----------------------------------------------------------------------------
//   //
//   //
//   // -----------------------------------------------------------------------------
//   useEffect(() => {
//     // let testData: RequestMessage = {
//     //   role: "user",
//     //   content: "pythonについて教えて下さい。",
//     // };
//     // newRequestMessages.push(testData);
//     // console.log(newRequestMessages);
//     // setChatDisplayData(newRequestMessages[0].content);
//     // setQuestion();
//   }, []);

//   // -----------------------------------------------------------------------------
//   //
//   //
//   return (
//     <div>
//       {questionDisplayDatas.map((q, index) => {
//         return (
//           <div className="relative" key={index}>
//             <QuestionSection question={questionDisplayDatas[0]} />
//             <AnswerSection answer={answerDisplayDatas[0]} />
//           </div>
//         );
//       })}

//       {/* 添付ファイル用アイコン */}
//       <div className="flex flex-row  items-center h-16 rounded-xl bg-white w-full px-4">
//         <div>
//           <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//               ></path>
//             </svg>
//           </button>
//         </div>
//         {/* 添付ファイル用アイコン */}

//         {/* inputタグの中に↑ボタン */}
//         <div className="flex-grow ml-4">
//           <div className="relative w-full">
//             <input
//               type="text"
//               className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
//               value={formTextData}
//               onChange={(e) => {
//                 setFormTextData(e.target.value);
//               }}
//             />
//             <button
//               className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
//               onClick={() => setQuestion()}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="size-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//         {/* inputタグの中に↑ボタン */}
//       </div>
//       <p className="text-center text-small">
//         ChatGPT
//         の回答は必ずしも正しいとは限りません。重要な情報は確認するようにしてください。
//       </p>
//     </div>
//   );
// };

// export default ChatView;
