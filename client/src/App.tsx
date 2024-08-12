import { Routes, Route } from "react-router-dom";
import ChatLayout from "./components/ChatPage/ChatLayout";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <div>
        <Routes>
          <Route path="/" element={<ChatLayout />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
