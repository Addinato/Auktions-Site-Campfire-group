import { io, Socket } from "socket.io-client";

const productName = document.getElementById("product1") as HTMLSpanElement;
const startsum = document.getElementById("startsum") as HTMLSpanElement;
const bid = document.getElementById("bid") as HTMLSpanElement;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

function renderImage(url: string) {
    const img = document.getElementById("productImage") as HTMLImageElement;
    img.src = url;
}

function loadProduct() {
    fetch(`http://localhost:3000/api/product/${id}`)
        .then(res => res.json())
        .then(product => {
            productName.textContent = product.product1;
            startsum.textContent = product.startsum + " kr";
            bid.textContent = product.bid + " kr";

            renderImage(product.imgURL);
        });
}

loadProduct();

const currentRoom = new URLSearchParams(document.location.search).get('id');
const socket:Socket = io('http://localhost:3000',{
  query: {
      roomName: currentRoom,
  },
});

// Emit explicit join after connect to ensure server-side join
socket.on('connect', () => {
    if (currentRoom) socket.emit('join', currentRoom);
});


socket.on('productUpdate', (product) => {
    const product1 = document.getElementById("product1") as HTMLSpanElement;
    const bid = document.getElementById("bid") as HTMLSpanElement;
   
    product1.textContent = product.product1;
    bid.textContent = product.bid.toString();
});

const sendButton = document.getElementById("send") as HTMLButtonElement;
 sendButton.addEventListener("click", () => {
    const messageInput = document.getElementById("text") as HTMLInputElement;
    const messageText = messageInput.value.trim();
    const nameInput = document.getElementById("name") as HTMLInputElement;  
    const senderName = nameInput.value.trim() || "Anonymous";
    if (messageText) {
        //const message = new HockeyMessage(senderName, messageText);
        const message = { sender: senderName, text: messageText };
        console.log('Message sent:', message);
        alert(`Message sent: ${message.text} by ${message.sender}`);
        socket.emit("someoneTypedSomething", message);
        messageInput.value = "";
    }
});

socket.on("bidResponse", (response) => {
    console.log('Bid response received:', response);
    alert(`Bid response: ${response.message}`);
});

socket.on("anUpdateFromServer", (message) => {
    console.log('Update from server:', message);
    //alert(`Update from server: ${message.text} by ${message.sender}`);
    // append to div messages
    const messagesDiv = document.getElementById("messages") as HTMLDivElement;
    const messageElement = document.createElement("p");
    messageElement.textContent = `${message.sender}: ${message.text}`;
    messagesDiv.appendChild(messageElement);
});

//                   


