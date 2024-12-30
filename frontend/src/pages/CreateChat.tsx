import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/conts";
import axios from "axios";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router";

const CreateChat = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const handleSubmit = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    try {
      const response = await axios.post(`${API_URL}/api/v1/chat`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      navigate(`/chat/${response.data.id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <div className="container min-h-screen flex flex-col items-center justify-center">
      <div className="md:min-w-[500px] border rounded-md  p-4">
        <h1 className="text-center text-2xl font-bold">Drop Files</h1>
        <div className="mt-12">
          <Dropzone onDrop={(acceptedFiles) => setFiles(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section className="py-12 border-2 border-dashed border-gray-300 rounded-md">
                <div {...getRootProps()}>
                  <input
                    {...getInputProps()}
                    className="outline-none focus:outline-none focus:border-none"
                  />
                  <p className="text-center">
                    Drag 'n' drop some files here, or click to select files
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        <div className="mt-4 flex justify-center">
          <Button onClick={handleSubmit}>Start Chat</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
