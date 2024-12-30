import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/conts";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

const Chat = () => {
  const id = useParams().id as string;
  const [currentResponse, setCurrentResponse] = useState("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [query, setQuery] = useState("");
  const [chats, setChats] = useState<{ id: string }[]>([]);
  const [replies, setReplies] = useState<
    {
      query: string;
      response: string;
    }[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/chat`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setChats(res.data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleAsk = async () => {
    setProcessing(true);
    setCurrentResponse("");
    try {
      const response = await fetch(`${API_URL}/api/v1/chat/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ query }),
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let responseText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        responseText += chunk;
        setCurrentResponse(responseText);
      }
      setProcessing(false);
      setReplies((prev) => [...prev, { query, response: responseText }]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-[300px] p-3">
        <h2 className="text-sm text-muted-foreground">History</h2>
        <div className="flex flex-col gap-3 mt-3">
          {chats.map((chat) => (
            <Link
              to={`/chat/${chat.id}`}
              key={chat.id}
              className="flex items-center justify-between text-muted-foreground hover:text-primary duration-300"
            >
              <h3 className="text-sm font-medium">{chat.id}</h3>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1 border-l p-3 flex flex-col gap-3 justify-between">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chat</h1>
          <div>
            <Button>New Chat</Button>
          </div>
        </div>
        <div className="flex-1 p-3 w-1/2 mx-auto overflow-y-auto ">
          <div>
            {replies.map((reply, index) => (
              <div key={index} className="mt-3">
                <p className="text-sm text-muted-foreground text-right">
                  {reply.query}
                </p>
                <p>{reply.response}</p>
              </div>
            ))}
            {processing && (
              <div>
                <p className="text-sm text-muted-foreground text-right">
                  {query}
                </p>
                <p>{currentResponse}</p>
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="md:w-3/4  mx-auto flex items-end bg-accent p-4 rounded-md"
        >
          <input
            onChange={(e) => setQuery(e.target.value)}
            disabled={processing}
            value={query}
            placeholder="Ask a question"
            className="w-full p-2  bg-transparent rounded-md border-none focus:outline-none focus:ring-0 resize-none"
          />
          <Button type="submit">Ask</Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
