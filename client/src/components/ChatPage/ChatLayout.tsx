import ChatView from "./ChatView";
import SideBar from "./SideBar";
import SwitchService from "./SwitchService";
import TextArea from "./TextArea";

const ChatLayout = () => {
  return (
    <div className="h-full w-full overflow-hidden">
      <div className="flex">
        <SideBar />
        <ChatView />
      </div>
      <div className="flex">
        <div className="w-40">
          <SwitchService />
        </div>
        <div className="flex-grow h-full">
          <TextArea />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
