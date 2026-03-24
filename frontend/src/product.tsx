import { Socket } from "socket.io-client";

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
    const bid1 = document.getElementById("bid1") as HTMLSpanElement;
   
    product1.textContent = product.product1;
    bid1.textContent = product.bid1.toString();
});
