import http, { IncomingMessage } from "http";
import type { Duplex } from "stream";
import WebSocket, { WebSocketServer } from "ws";
import { CommsModels, RedisModels } from "extorris-common";
import RedisConnector from "./RedisConnector.js";

type OnError = (self: WebSocket, error: Error) => void;
type OnMessage = (ws: WebSocket, data: CommsModels.CommsIncMessage, userId: number) => void;

type OnConnection = (userId: number) => void;

export default class NodeWSServer {
  private wss: WebSocketServer;
  private server: http.Server;

  private customOnConnection: OnConnection | null = null;

  private customOnMessage: OnMessage | null = null;
  private customOnError: OnError | null = null;

  private webSocketMappedUsers: Map<WebSocket, number> = new Map();
  private userMappedWebSockets: Record<number, WebSocket> = {};

  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ noServer: true });
    this.server = server;
    this.server.on("upgrade", (...args) => this.upgrade(this, ...args));
    this.wss.on("connection", (...args) => this.onConnection(this, ...args));
  }

  private onConnection(
    self: NodeWSServer,
    ws: WebSocket,
    request: IncomingMessage,
  ) {
    ws.on("error", (ws: WebSocket, error: Error) => {
      if (typeof self.customOnError === "function") {
        self.customOnError(ws, error);
      }
    });

    ws.on("message", (data: WebSocket.RawData, isBinary: boolean) => {
      const parsedData = JSON.parse(data.toString());
      const userId = self.webSocketMappedUsers.get(ws);
      console.log(`Received message ${data} from ${userId}`);
      if (!userId) {
        console.log("mapping webSocketMappedUsers failed")
        return;
      }
      if (typeof self.customOnMessage === "function") {
        self.customOnMessage(ws, parsedData, userId);
      }
    });

    ws.on("close", (code: number, reason: Buffer) => {
      console.log(`closed connection with code: ${code} because "${reason}"`)
      self.deleteMapWebSocket(ws);
    });
  }

  private async upgrade(
    self: NodeWSServer,
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer<ArrayBufferLike>,
  ) {
    const urlString = request.url;
    if (!urlString) {
      return;
    }
    const url = new URL(urlString, "wss://base.url");
    const token = url.searchParams.get("token");
    if (!token) {
      return;
    }

    const redisConnector = await RedisConnector.getInstance();
    const session = await redisConnector.getUserSession(token);
    if (!session) {
      console.log(`session by ${token} doesn't exist`);
      return;
    }

    console.log("user connected", session);

    self.wss.handleUpgrade(
      request,
      socket,
      head,
      (client: WebSocket, request: IncomingMessage) => {
        if (!session.user_id) {
          return;
        }

        self.mapWebSocket(client, session.user_id);
        // console.log("established connection", request.headers);
        self.wss.emit("connection", client, request);
      },
    );
  }

  private mapWebSocket(ws: WebSocket, userId: number) {
    this.webSocketMappedUsers.set(ws, userId);
    this.userMappedWebSockets[userId] = ws;

    console.log("mapping ws and user id", userId)
  }

  private deleteMapWebSocket(ws: WebSocket) {
    const userId = this.webSocketMappedUsers.get(ws);
    this.webSocketMappedUsers.delete(ws);

    console.log(`removed ${userId} from mapped websockets`)

    if (userId) {
      delete this.userMappedWebSockets[userId];
    }
  }

  setOnMessage(callback: OnMessage) {
    this.customOnMessage = callback;
  }

  setOnError(callback: OnError) {
    this.customOnError = callback;
  }

  setOnConnectionEstablish(callback: OnConnection) {
    this.customOnConnection = callback;
  }

  send(message: CommsModels.CommsOutMessage, usersIds?: Array<number>) {
    if (usersIds) {
      for (let i = 0; i < usersIds.length; i++) {
        const userId = usersIds[i];
        const ws = this.userMappedWebSockets[userId];
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(Buffer.from(JSON.stringify(message)));
        }
      }
    } else {
      console.log("sending message to all clients")
      this.wss.clients.forEach((ws) => {
        console.log(ws.readyState);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(Buffer.from(JSON.stringify(message)));
        }
      });
    }
  }
}
