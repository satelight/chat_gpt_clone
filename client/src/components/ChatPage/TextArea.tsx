import { FaArrowCircleUp } from "react-icons/fa";
const TextArea = () => {
  return (
    <div className="flex justify-center mx-auto flex-1 max-w-full h-24 items-center bg-white">
      <div className="flex w-28"></div>
      <div className="flex w-full py-4 px-4">
        <div className="flex flex-auto bg-slate-100 w-full mx-20 my-8 px-8 py-4 rounded-full">
          <textarea
            className="border-0  justify-center bg-slate-100 overflow-x-hidden w-full cursor-auto resize-none focus:outline-none"
            rows={1}
            placeholder="質問を送信する"
          />
          <button className="">
            <FaArrowCircleUp className="text-lg  justify-center h-8 w-8 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextArea;
