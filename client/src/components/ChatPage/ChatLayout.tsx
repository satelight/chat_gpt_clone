import ChatView from "./ChatView";
import SideBar from "./SideBar";
import SwitchService from "./SwitchService";

const ChatLayout = () => {
  return (
    <div className="bg-white">
      <div className="overflow-hidden">
        <div className="grid grid-cols-10">
          <SideBar />
          <SwitchService />
          <ChatView />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
