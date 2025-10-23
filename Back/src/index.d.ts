import { NextFunction, Request, Response } from "express";
import { Socket, Server as SocketIOServer } from "socket.io";
declare global {
  type SocketHandler = (
    socket: Socket,
    io: SocketIOServer,
    url: String,
    data: any
  ) => any | Promise<any>;

  type ApiHandler = (
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
  declare namespace Express {
    interface Request {
      parsedQuery?: any;
      user?: any;
    }
  }
  declare interface Pageable<T> {
    content: T[];
    totalPages: number;
    pageSize: number;
    pageNumber: number;
    last: boolean;
    NumberOfTotalElements: number;
    NumberOfElements: number;
  }
  declare interface PageData {
    pageSize: number;
    pageNumber?: number;
  }

  declare interface Limitable<T> {
    content: T[];
    limit: number;
    offset: number;
    last: boolean;
    NumberOfTotalElements: number;
    NumberOfElements: number;
  }
  declare interface LimitData {
    limit: number;
    offset?: number;
  }

  declare interface UpdateResult<T> {
    affected: number;
    result?: T[];
  }
  declare interface RestoreResult<T> {
    affected: number;
    result?: T[];
  }

  declare interface TreeOptions {
    tree?: "ancestors" | "descendants";
  }
  declare interface InsertDocument {
    pageContent: string | object;
    metadata: Record<string, any>;
    source_id: string;
  }
  declare interface DocumentChunk {
    id: number;
    content: string;
    source_id: string;
    embedding_vector: string;
    intent: string;
  }
  declare interface Intention {
    id: number;
    keyword: string;
    intent: string;
  }
}
