import { Router, Request, Response } from "express";
import { getIo } from "../socket";

class Product {
  constructor(product1: string, startsum: number) {
    this.id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    this.product1 = product1;
    this.startsum = startsum;
  }
  id: string;
  product1: string;
  startsum: number;
  bid: number = 0;
}

const products: Product[] = [];

function initProducts() {
  products.push(new Product("Volvo", 457580));
  products.push(new Product("BMW", 15540));
  products.push(new Product("Porche", 10670));
  products.push(new Product("Audi", 20000));
  products.push(new Product("Kia", 17888));
  products.push(new Product("Ford", 28883));
  products.push(new Product("Skoda", 76542));
  products.push(new Product("Volkswagen", 93837));
  products.push(new Product("Ferrari", 8229375));
  products.push(new Product("Rolls-Royce", 627393837));
}

const productRouter = Router();

productRouter.get("/", (req: Request, res: Response) => {
  res.json(products);
});
// uppdaterar bids.
productRouter.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { bid } = req.body;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (bid !== undefined) {
    product.bid = bid;
  }
  try {
    getIo().to(id).emit("productUpdate", product);
  } catch (e) {
    // Socket.IO not initialized yet; ignore emit
  }
  res.json(product);
});
// lägger/hämtar bud med hjälp av produktens id.
productRouter.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// skapar en ny product kan bort
productRouter.post("/", (req: Request, res: Response) => {
  const { product1, startsum } = req.body;
  if (!product1 || !startsum) {
    return res.status(400).json({ message: "product are required" });
  }
  const product = new Product(product1, startsum);
  products.push(product);
  res.status(201).json(product);
});

export { productRouter, initProducts };
