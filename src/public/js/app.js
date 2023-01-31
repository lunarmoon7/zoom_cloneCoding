// FrontEnd(Browser)

const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick")
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
    const msg = {type, payload}
    return JSON.stringify(msg);
}
// connection 됐을 때
socket.addEventListener("open", () => {
    console.log("Connected to Server✅");
});
// 메시지 받았을 때 
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});
// 서버가 오프라인 됐을 때
socket.addEventListener("close", () => {
    console.log("Disconnected from Server❌");
});

// // 서버에게 메시지 보내기 send
// setTimeout(() => {
//     socket.send("Hello from the browser!");
// }, 10000);

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    // FrontEnd의 Form에서 BackEnd로 보내기
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li");
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);