import { GoogleGenAI } from "@google/genai";
import { TaskType } from "@google/generative-ai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { AppDataSource } from "data-source";
import fs from "fs";
import { Document } from "langchain";
import _ from "lodash";
import path from "path";

interface Module {
  query?: (question: string, metadata?: Record<string, any>) => Promise<void>;
}

const EMBEDDING_MODEL = process.env.BOT_EMBEDDING_MODEL || "text-embedding-004";
const GENERATION_MODEL = process.env.BOT_GENERATION_MODEL || "gemini-2.5-flash";
let ai: GoogleGenAI;
let splitter: RecursiveCharacterTextSplitter;
let embeddings: GoogleGenerativeAIEmbeddings;

export function init(DEV: Boolean) {
  ai = new GoogleGenAI({ apiKey: process.env.BOT_API_KEY });
  splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", // 768 dimensions
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
    apiKey: process.env.BOT_API_KEY,
  });
}
export async function generateDefault(question: string) {
  const response = await ai.models.generateContent({
    model: GENERATION_MODEL,
    contents: question,
  });
  return response?.text?.trim() || "답변을 생성할 수 없습니다.";
}
export async function generateContent(prompty: string, question: string) {
  const response = await ai.models.generateContent({
    model: GENERATION_MODEL,
    contents: prompty.replace("{question}", question),
  });
  return response.text?.trim();
}

export async function embedContent(
  query: string,
  intent?: string,
  K_RESULTS: number = 100
) {
  const embeddingResult = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: query,
    config: {
      taskType: TaskType.RETRIEVAL_QUERY,
    },
  });
  const queryVector = Array.from(embeddingResult.embeddings?.values() || []);

  const vectorString = `[${queryVector
    .map((query) => query.values)
    .join(",")}]`;

  const queryText = `
        SELECT 
            content,
            source_id 
        FROM 
            document_chunks
        ${intent ? `WHERE intent = '${intent}'` : ""}
        ORDER BY 
            embedding_vector <=> $1 
        LIMIT $2;
    `;

  const result: DocumentChunk[] = await AppDataSource.manager.query(queryText, [
    vectorString,
    K_RESULTS,
  ]);

  const contextChunks = result.map((row) => row.content);
  return contextChunks;
}
export async function dataToVector(data: string) {
  const vectors = await embeddings.embedDocuments([data]);
  return `[${vectors[0].join(",")}]`;
}

export async function insertDocument(data: InsertDocument[], intent: string) {
  let chunksToSave = [];
  for (const datum of data) {
    const doc = new Document({
      pageContent:
        typeof datum.pageContent === "object"
          ? JSON.stringify(datum.pageContent, null, 2)
          : datum,
      metadata: _.merge(datum.metadata || {}, { source_id: datum.source_id }),
    });
    const splitDocs = await splitter.splitDocuments([doc]);
    chunksToSave.push(...splitDocs);
  }
  const vectors = await embeddings.embedDocuments(
    chunksToSave.map((chunk) => chunk.pageContent)
  );

  const entitiesToSave: DocumentChunk[] = chunksToSave.map((chunk, index) => {
    const entity = {} as DocumentChunk;
    entity.content = chunk.pageContent;
    entity.source_id = chunk.metadata.source_id.toString();
    entity.embedding_vector = `[${vectors[index].join(",")}]`;
    entity.intent = intent.toUpperCase();
    return entity;
  });
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const table = "document_chunks";
    const rows = entitiesToSave.map((datum) => {
      const content = datum.content.replace(/'/g, "''");
      const source_id = datum.source_id.replace(/'/g, "''");
      const embedding_vector = datum.embedding_vector.replace(/'/g, "''");
      const intent = datum.intent.replace(/'/g, "''");
      return `('${content}', '${source_id}', '${embedding_vector}', '${intent}')`;
    });
    const sql = `
      INSERT INTO "${table}" (content, source_id, embedding_vector, intent)
      VALUES ${rows}
      ON CONFLICT (source_id, intent)
      DO UPDATE SET
        content = EXCLUDED.content,
        embedding_vector = EXCLUDED.embedding_vector;
    `;
    return await queryRunner.query(sql);
  } catch (error) {
    console.error("Raw SQL 삽입/업데이트 오류:", error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}
export async function insertIntention(data: string[], intent: string) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  try {
    const table = "intention";
    const rows = data.map((datum) => {
      const keyword = datum.replace(/'/g, "''");
      const intentValue = intent.toUpperCase().replace(/'/g, "''");
      return `('${keyword}', '${intentValue}')`;
    });
    const sql = `
    INSERT INTO "${table}" (keyword, intent)
    VALUES ${rows}
    ON CONFLICT (keyword, intent)
    --DO UPDATE SET
    --  keyword = EXCLUDED.keyword;
    DO NOTHING
  `;
    return await queryRunner.query(sql);
  } catch (error) {
    console.error("Raw SQL 삽입/업데이트 오류:", error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}

export async function Process(
  question: string,
  intent?: string,
  metadata?: Record<string, any>
) {
  const fileType = __dirname.includes("dist") ? "js" : "ts";
  const modulePath = path.join(
    __dirname,
    "intents",
    `${(intent || "INTENT").toUpperCase()}.${fileType}`
  );
  if (fs.existsSync(modulePath)) {
    try {
      const module: Module = await import(modulePath);
      if (typeof module.query === "function") {
        return await module.query(question, metadata);
      } else {
        console.warn(
          `Module at ${modulePath} found, but no 'query' function exported.`
        );
      }
    } catch (error) {
      console.error(
        `Failed to load or initialize module from ${modulePath}:`,
        error
      );
    }
  } else return intent;
}
