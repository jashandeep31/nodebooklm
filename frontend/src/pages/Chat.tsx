import { Button } from "@/components/ui/button";

const Chat = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-[300px] "></div>
      <div className="flex-1 border-l p-3 flex flex-col gap-3 justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chat</h1>
          <div>
            <Button>New Chat</Button>
          </div>
        </div>
        <div className="md:w-3/4  mx-auto flex items-end bg-gray-200 p-4 rounded-md">
          <textarea
            placeholder="Ask a question"
            className="w-full p-2  bg-transparent rounded-md border-none focus:outline-none focus:ring-0 resize-none"
          ></textarea>
          <Button>Ask</Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
