import "reflect-metadata";
//
import cors from "cors";
import dotenv from "dotenv";
import * as path from "path";

// 순서 고정 (env를 불러오는 기능이므로 무조건 먼저 있어야함.)
dotenv.config({ path: path.resolve(__dirname, `../.env`) });
const env = process.env.NODE_ENV || "development"; // NODE_ENV가 설정되지 않았다면 'development'를 기본값으로
const envPath = path.resolve(__dirname, `../.env.${env}`); // 현재 파일 기준으로 .env 파일 경로 설정
dotenv.config({ path: envPath, override: true });
//
import express, { NextFunction, Request, Response, Router } from "express";
import * as fs from "fs";
import multer from "multer";

import { createServer } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { initializeDataSource } from "./data-source";
import { initializeModules } from "./expand/register";
import { applyConfiguredMiddlewares } from "./middleware";

export type SocketHandler = (
  socket: Socket,
  io: SocketIOServer,
  url: String,
  data: any
) => any | Promise<any>;

export type ApiHandler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => any | Promise<any>;

interface ApiModule {
  GET?: ApiHandler;
  POST?: ApiHandler;
  DELETE?: ApiHandler;
  PUT?: ApiHandler;
  PATCH?: ApiHandler;
  SOCKET?: SocketHandler;
}

const API_BASE_DIR = path.join(__dirname, "api"); // src/api 경로
const port = process.env.PORT || 8080;

const app = express();

if (process.env.CONSOLE_LOG)
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${
        req.ip
      }`
    );
    next();
  });
// CORS 설정

let origin;
if (process.env.CORS) {
  origin = process.env.CORS.split(",").map((domain) => {
    const escapedDomain = domain.replace(/\./g, "\\.").replace(/-/g, "\\-");
    return new RegExp(`^https?:\/\/(.+\\.)?${escapedDomain}(?::\\d{1,5})?$`);
  });
} else {
  origin = "*";
}
app.use(
  cors({
    origin: origin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin,
    methods: ["GET", "POST"],
  },
});

let collectedSocketHandlers: Map<string, any> = new Map();
async function __loadApiRoutes(appRouter: Router) {
  try {
    collectedSocketHandlers = new Map();
    const files = (
      await fs.promises.readdir(API_BASE_DIR, {
        recursive: true,
        withFileTypes: false,
      })
    ).sort((a, b) => {
      const isAStatic = !a.includes("[");
      const isBStatic = !b.includes("[");
      const isACatchAll = a.includes("[...");
      const isBCatchAll = b.includes("[...");

      if (isAStatic && isBStatic) return 0;
      if (isAStatic) return -1;
      if (isBStatic) return 1;
      if (isACatchAll) return 1;
      if (isBCatchAll) return -1;

      return 0;
    });
    for (const fileRelativePath of files) {
      const isRouteFile =
        fileRelativePath.endsWith("route.ts") ||
        fileRelativePath.endsWith("route.js");
      const isDefinitionFile = fileRelativePath.endsWith(".d.ts");
      if (isRouteFile && !isDefinitionFile) {
        const fullPath = path.join(API_BASE_DIR, fileRelativePath);

        let urlPath =
          "/" +
          fileRelativePath
            .replace(/\\/g, "/")
            .replace(/\/route\.ts$/, "")
            .replace("route.ts", "")
            .replace("route.js", "");

        // [...variable] 형태를 :variable* 로 변환 (catch-all parameter)
        urlPath = urlPath.replace(/\[\.\.\.(\w+)\]/g, "*$1");
        // [variable] 형태를 :variable 로 변환 (named parameter)
        // 이 순서가 중요 [...variable] 먼저, [variable] 나중
        urlPath = urlPath.replace(/\[(\w+)\]/g, ":$1");
        if (urlPath === "/") {
          urlPath = "";
        }
        try {
          const apiModule: ApiModule = await import(fullPath);
          if (apiModule.GET) {
            appRouter.get(urlPath, apiModule.GET);
          }
          if (apiModule.POST) {
            appRouter.post(urlPath, apiModule.POST);
          }
          if (apiModule.PUT) {
            appRouter.put(urlPath, apiModule.PUT);
          }
          if (apiModule.DELETE) {
            appRouter.delete(urlPath, apiModule.DELETE);
          }
          if (apiModule.PATCH) {
            appRouter.patch(urlPath, apiModule.PATCH);
          }
          if (apiModule.SOCKET) {
            if (urlPath.includes(":") || urlPath.includes("*")) {
              console.error(`${urlPath} is not allowed`);
            }
            collectedSocketHandlers.set(urlPath, apiModule.SOCKET);
          }
        } catch (importError) {
          console.error(`Error importing ${fullPath}:`, importError);
        }
      }
    }
  } catch (err) {
    console.error("Failed to read API directory:", err);
  }
}
initializeDataSource().then(() => {
  applyConfiguredMiddlewares(app).then(() => {
    const apiRouter = express.Router();

    __loadApiRoutes(apiRouter)
      .then(() => {
        app.use("/", apiRouter);

        // --- 전역 에러 처리 미들웨어 (항상 모든 라우트 및 미들웨어 정의 후 마지막에 위치) ---
        app.use(
          (err: Error, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof multer.MulterError) {
              console.error(
                "[Global Error Handler] Multer Error:",
                err.code,
                err.message
              );
              // 에러 코드에 따라 더 상세한 메시지 제공 가능
              if (err.code === "LIMIT_FILE_SIZE") {
                res.status(413).json({
                  message: "File too large.",
                  error: err.message,
                  status: 413,
                });
                return;
              }
              if (err.code === "LIMIT_FIELD_COUNT") {
                res.status(400).json({
                  message: "Too many fields.",
                  error: err.message,
                  status: 400,
                });
                return;
              }
              if (err.code === "LIMIT_UNEXPECTED_FILE") {
                res.status(400).json({
                  message: `Unexpected file field: ${err.field}`,
                  error: err.message,
                  status: 400,
                });
                return;
              }
              // 'Unexpected end of form' 같은 일반적인 Multer 오류
              res.status(400).json({
                message: `File upload error: ${err.message}`,
                error: err.message,
                status: 400,
              });
              return;
            }

            console.error("전역 오류 발생:", err.stack);
            res.status(500).json({
              error: "서버에서 예상치 못한 오류가 발생했습니다.",
              status: 500,
            });
          }
        );
        io.on("connection", (socket) => {
          // if (process.env.CONSOLE_LOG)
          //   console.log(
          //     `<Socket> [${new Date().toISOString()}] ${socket.id} connected`
          //   );
          for (let [
            urlPath,
            socketEvent,
          ] of collectedSocketHandlers.entries()) {
            if (urlPath.endsWith("/"))
              urlPath = urlPath.slice(0, urlPath.length - 1);
            socket.on(urlPath, async (data) =>
              socketEvent(socket, io, urlPath, data)
            );
          }
          if (process.env.CONSOLE_LOG)
            socket.onAny((...args) =>
              console.log(`<Socket> [${new Date().toISOString()}]`, args)
            );

          // if (process.env.CONSOLE_LOG)
          //   socket.on("disconnect", () => {
          //     console.log(
          //       `<Socket> [${new Date().toISOString()}] ${
          //         socket.id
          //       } disconnected`
          //     );
          //   });
        });
        // 서버 시작
        httpServer.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
        });
        initializeModules();
      })
      .catch((error) => {
        console.error("Failed to load API routes:", error);
        process.exit(1); // 라우트 로딩 실패 시 서버 종료
      });
  });
});

export default app;
