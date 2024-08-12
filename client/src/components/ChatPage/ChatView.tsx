const Question = () => {
  return (
    <div className="min-w-full">
      <p className="flex mr-28 ml-64 my-4 py-4 break-all rounded-lg bg-slate-100 px-8 text-lg">
        たｓがんｇさｄｇｆんｓぢｇんがｓｐｇなｓｄｇｊｍｋｌｆｄｍｇｋんｍｓｄｆｋｍｄｓｌんｆｇｌｋｄｓｆｓｄ
        testegfasdgsadfgdsfgsdfgsdagsdfgsdfgdsfsdafadsgfsgsagdsagdsafgsadfgdsfagsdafgfdsgdsfagsadfgsfdgsadgsafgsadfgsafsdf"
      </p>
    </div>
  );
};

const Answer = () => {
  return (
    <div className="flex mr-28 ml-64 my-4 px-8 ">
      <div className="bg-white break-all">
        Pythonは、非常に人気のあるプログラミング言語の一つで、シンプルで読みやすい文法が特徴です。多くの用途に対応できる汎用的な言語であり、以下のような特徴や用途があります。
      </div>
    </div>
  );
};

const ChatView = () => {
  return (
    <div className="flex-grow bg-white h-96 overflow-auto">
      <Question />
      <Answer />
    </div>
  );
};

export default ChatView;
