import { log } from "../log"
import { WebSocket, MessageEvent } from "ws";
import { createId } from "@paralleldrive/cuid2"


export default class WSReqManager {
    requests: Record<string, any> = {};
    ws: WebSocket | null = null;

    constructor() { }

    register(ws: WebSocket) {
        this.ws = ws;
        ws.onmessage = (msgEv: MessageEvent) => {
            log.info("Received message from LLM-API");
            this.onMessage(msgEv.data.toString());
        }
    }

    private onMessage(msg: string) {
        const response = JSON.parse(msg);
        const responseId: string = response.id;

        if (responseId in this.requests) {
            this.requests[responseId](response);
        } else {
            log.warn(`Received id ${response.id} which does not match.`);
        }
    }

    async send(type: string, body: any) {
        if (this.ws === null) {
            throw "WebSocket is not connected"
        }

        const id = createId();
        const msg = {
            id: id,
            type: type,
            body: body
        }
        this.ws.send(JSON.stringify(msg));

        const respPromise = new Promise<any>((res) => {
            this.requests[id] = res;
        });

        return respPromise;
    }
}