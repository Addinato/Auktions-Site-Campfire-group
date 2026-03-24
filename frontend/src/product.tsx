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

export default ProductPage;