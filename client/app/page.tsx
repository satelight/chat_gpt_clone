import Image from "next/image";
import SideBar from "./SideBar";
import ChatView from "./ChatView";

export default function Home() {
  return (
    <div className="flex h-screen antialiased text-gray-10">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        <SideBar />
        <ChatView />
      </div>
    </div>
  );
}
