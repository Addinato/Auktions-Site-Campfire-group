import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Product = {
  id: string;
  product1: string;
  startsum: number;
  bid: number;
  imgURL: string;
};

const ProductPage = () => {
  const [product, setProduct] = useState<Product | null>(null);

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      const res = await fetch(`http://localhost:3000/api/product/${id}`);
      const data = await res.json();
      setProduct(data);
    };

    loadProduct();

    const socket: Socket = io("http://localhost:3000", {
      query: { roomName: id },
    });

    socket.on("connect", () => {
      socket.emit("join", id);
    });

    socket.on("productUpdate", (updatedProduct: Product) => {
      setProduct(updatedProduct);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  if (!product) return <p>Laddar...</p>;

  return (
    <div>
      <h1>{product.product1}</h1>

      <img src={product.imgURL} width={300} />

      <p>Startpris: {product.startsum} kr</p>
      <p>Nuvarande bud: {product.bid} kr</p>
    </div>
  );
};



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
