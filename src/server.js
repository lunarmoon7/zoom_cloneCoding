// BackEnd(Server)

import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home")); // 우리 홈페이지로 이동 시 사용될 템플릿을 렌더해준다.
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);
// const handleListen = () => console.log(`Listening on ws://localhost:3000`);

// http 서버 위에 ws 서버 구축
const server = http.createServer(app); // http server
const wss = new WebSocketServer({ server }); // websocket server

const onSocketClose = () => {
    console.log("Disconnected from the Browser❌");
}

const sockets = [];
// connection 이벤트를 Listen하는 곳
// chrome, safari 끼리의 통신은 안된다. => 서버가 각각의 브라우저에 연결되어 있다.
wss.on("connection", (socket) => {
    // 연결된 socket(브라우저) 저장
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser✅");
    // 브라우저가 꺼졌을 때 Listener
    socket.on("close", onSocketClose);
    // 브라우저가 서버에 메시지 보냈을 때 Listener
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type) {
            case "new_message":
                sockets.forEach((eSocket) => eSocket.send(`${socket.nickname}: ${message.payload}`));
            case "nickname":
                socket['nickname'] = message.payload;                
        }
    });
    // // 브라우저에게 메시지 보내기
    // socket.send("hello!!!");
});

server.listen(3000, handleListen);