import { Socket,io } from "socket.io-client";


function getProductInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    fetch(`http://localhost:3000/api/product/${productId}`)
    .then(response => response.json())
    .then(product => {
        const product1 = document.getElementById("product1") as HTMLSpanElement;
        const startsum = document.getElementById("startsum") as HTMLSpanElement;
        const bid = document.getElementById("bid") as HTMLSpanElement;
     

        product1.textContent = product.product1;
        startsum.textContent = product.startsum;
        bid.textContent = product.bid1.toString();
        

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
    const startsum = document.getElementById("startsum") as HTMLSpanElement;
    const bid = document.getElementById("bid") as HTMLSpanElement;
  

    product1.textContent = product.product1;
    startsum.textContent = product.startsum;
    bid.textContent = product.bid.toString();
 
});
