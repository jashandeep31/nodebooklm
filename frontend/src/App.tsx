import { BrowserRouter, Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import { Toaster } from "@/components/ui/sonner";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import CreateChat from "./pages/CreateChat";

const App = () => {
  return (
    <div>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<CreateChat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
