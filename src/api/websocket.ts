import { WebSocket } from "ws";

export let websocket = new WebSocket("wss://llm-proxy-server-slixmjmf2a-ez.a.run.app");

websocket.onclose = () => {
    // Attempt reconnect
    setTimeout(() => {
        websocket = new WebSocket("wss://llm-proxy-server-slixmjmf2a-ez.a.run.app");
    }, 1000);
}