import {
  w3cwebsocket as WebSocketClient,
  type ICloseEvent,
  type IMessageEvent,
} from "websocket";
import { type CommsIncMessage, type CommsOutMessage } from "./CommsMessage";

type WSErrorCallback = (error: Error) => void;
type WSOpenCallback = () => void;
type WSCloseCallback = (event: ICloseEvent) => void;
type WSMessageCallback = (message: CommsOutMessage) => void;

export class BrowserWSClient {
  private client: WebSocketClient;

  private onerror: WSErrorCallback | null = null;
  private onopen: WSOpenCallback | null = null;
  private onclose: WSCloseCallback | null = null;
  private onmessage: WSMessageCallback | null = null;

  constructor(url: string, auth: string) {
    this.client = new WebSocketClient(`${url}?token=${auth}`);

    this.client.onerror = (error) => {
      console.error(error);
      if (typeof this.onerror === "function") {
        this.onerror(error);
      }
    };

    this.client.onopen = () => {
      if (typeof this.onopen === "function") {
        this.onopen();
      }
    };

    this.client.onclose = (event) => {
      console.log("WebSocket closed", event);
      if (typeof this.onclose === "function") {
        this.onclose(event);
      }
    };

    this.client.onmessage = async (message: any) => {
      const awaitedMessage = await message.data.text();
      if (typeof this.onmessage === "function") {
        this.onmessage(JSON.parse(awaitedMessage));
      }
    };
  }

  get isConnecting() {
    return this.client._readyState === this.client.CONNECTING;
  }

  get isConnected() {
    return this.client._readyState === this.client.OPEN;
  }

  onError(callback: WSErrorCallback): void {
    this.onerror = callback;
  }

  onOpen(callback: WSOpenCallback): void {
    this.client.onopen = callback;
  }

  onClose(callback: WSCloseCallback): void {
    this.client.onclose = callback;
  }

  onMessage(callback: WSMessageCallback): void {
    this.onmessage = callback;
  }

  send(message: CommsIncMessage) {
    this.client.send(JSON.stringify(message));
  }

  disconnect() {
    this.client.close();
  }
}
