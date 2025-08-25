"use client";
import socketIOClient from "socket.io-client";

const mode = process.env.REACT_APP_MODE;
const socket = mode
  ? process.env["NEXT_PUBLIC_BACK_" + mode.toUpperCase()] ||
    process.env.NEXT_PUBLIC_BACK
  : process.env.NEXT_PUBLIC_BACK;

class _SocketRequester {
  instance;

  constructor() {
    this.instance = socketIOClient(socket, {
      reconnectionAttempts: 10,
    });
  }

  subscribe(url: string, method: (res: any) => void) {
    let instance = this.instance;
    instance.on(url, method);
    // instance.emit("subscribe", url);
  }
  unSubscribe(url: string) {
    let instance = this.instance;
    instance.off(url);
    // instance.emit("unsubscribe", url);
  }

  publish(url: string, data: any) {
    let instance = this.instance;
    return instance.emit(url, data);
  }
}

export default _SocketRequester;

let socketRequester: _SocketRequester;

if (process.env.NEXT_PUBLIC_DEV) {
  socketRequester = new _SocketRequester();
} else {
  if (typeof window !== "undefined") {
    // 클라이언트에서만 사용 가능
    if (!(window as any).socketRequesterInstance) {
      (window as any).socketRequesterInstance = new _SocketRequester();
    }
    socketRequester = (window as any).socketRequesterInstance;
  }
}

export { socketRequester };
