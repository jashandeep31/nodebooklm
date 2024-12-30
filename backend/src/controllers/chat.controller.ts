import { catchAsync } from "../lib/catchAsync";
import { chroma, db } from "../lib/db";
import { NextFunction, Request, Response } from "express";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { AppError } from "../lib/appError";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

export const getChats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) throw new AppError("User not found", 401);
    const chats = await db.chat.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(200).json({
      status: "success",
      data: chats,
    });
  }
);

export const askChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.body;
    const userId = req.userId;
    if (!userId) throw new AppError("User not found", 401);
    const chatId = req.params.id;
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    });
    if (!chat) throw new AppError("Chat not found", 404);
    if (chat.userId !== userId) throw new AppError("Unauthorized", 401);
    const embeddings = new OllamaEmbeddings({
      model: "llama3.2",
    });
    const collection = await chroma.getCollection({
      name: chatId,
      embeddingFunction: {
        generate: embeddings.embedDocuments.bind(embeddings),
      },
    });
    const results = await collection.query({
      queryTexts: [query],
      nResults: 5,
    });

    // query the ollmam
    const ollama = new ChatOllama({
      model: "llama3.2",
    });

    const systemMessage = new SystemMessage({
      content: `You are an assistant that replies using the mentioned data only. If the data relevant to the given query is not present, respond with: "Data not present."`,
    });
    console.log(results.documents.join("\n"));
    const humanMessage = new HumanMessage({
      content: `Data:\n${results.documents.join("\n")}\nQuery: ${query}`,
    });
    const ollamaResult = ollama._streamResponseChunks(
      [systemMessage, humanMessage],
      {}
    );
    for await (const chunk of ollamaResult) {
      res.write(chunk.text);
    }
    res.end();
    // res.status(200).json({
    //   status: "success",
    //   response: ollamaResult.content,
    // });
  }
);

export const createChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const pdfs = req.files as Express.Multer.File[];
    if (!pdfs) throw new AppError("No PDF files uploaded", 400);

    const chatId = await db.$transaction(async (tx): Promise<string> => {
      const userId = req?.userId;
      if (!userId) throw new AppError("User not found", 401);
      const chat = await tx.chat.create({
        data: {
          userId: userId,
        },
      });

      // chroma collection
      const collection = await chroma.createCollection({
        name: chat.id,
      });
      pdfs.forEach(async (pdf) => {
        const blob = new Blob([pdf.buffer], { type: "application/pdf" });
        const loadedDoc = await new PDFLoader(blob).load();
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });
        const docsSplit = await textSplitter.splitDocuments(loadedDoc);
        const embeddings = new OllamaEmbeddings({
          model: "llama3.2",
        });

        // Generate embeddings and add to collection
        const vectors = await embeddings.embedDocuments(
          docsSplit.map((doc) => doc.pageContent)
        );

        await collection.add({
          ids: docsSplit.map((_, i) => `${chat.id}-${i}`),
          embeddings: vectors,
          documents: docsSplit.map((doc) => doc.pageContent),
          metadatas: docsSplit.map((doc) => doc.metadata),
        });
      });
      return chat.id;
    });

    res.status(201).json({
      status: "success",
      id: chatId,
    });
  }
);
