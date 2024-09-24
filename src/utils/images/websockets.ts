export class WS<P> extends WebSocket {
  constructor(host: string) {
    super(`ws://${process.env.NEXT_PUBLIC_BACKEND_HOST}${host}`);
  }
  parseMessage(callbackFn: (arg: P) => void) {
    this.onmessage = (ev: MessageEvent) => {
      const parsed = JSON.parse(ev.data) as P;
      callbackFn(parsed);
    };
  }
}
