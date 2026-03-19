import { Socket,io } from "socket.io-client";


function getProductInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    fetch(`http://localhost:3000/api/product/${productId}`)
    .then(response => response.json())
    .then(product => {
        const team1 = document.getElementById("product1") as HTMLSpanElement;
        const team2 = document.getElementById("product2") as HTMLSpanElement;
        const score1 = document.getElementById("bid1") as HTMLSpanElement;
        const score2 = document.getElementById("bid2") as HTMLSpanElement;

        product1.textContent = product.product1;
        product2.textContent = product.product2;
        bid1.textContent = product.bid1.toString();
        bid2.textContent = product.bid2.toString();

    });
}



getProductInfo();



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
    const product2 = document.getElementById("product2") as HTMLSpanElement;
    const bid1 = document.getElementById("bid1") as HTMLSpanElement;
    const bid2 = document.getElementById("bid2") as HTMLSpanElement;

    product1.textContent = product.product1;
    product2.textContent = product.product2;
    bid1.textContent = product.bid1.toString();
    bid2.textContent = product.bid2.toString();
});
