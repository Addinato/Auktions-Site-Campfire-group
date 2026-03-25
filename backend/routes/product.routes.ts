import { Router, Request, Response } from "express";
import { getIo } from "../socket";

class Product {
  constructor(product1: string, startsum: number, imgURL: string) {
    this.id =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    this.product1 = product1;
    this.startsum = startsum;
    this.imgURL = imgURL;
  }
  id: string;
  product1: string;
  imgURL: string;
  startsum: number;
  bid: number = 0;
}

const products: Product[] = [];

function initProducts() {
  products.push(new Product("Volvo", 457580, "https://www.bilsport.se/api/images/d305-d12369337979094076-d605-d5662020905923345/1980x1320/ab9f6f97-c161-5dd4-b3ad-c4e798a12b08.jpg"));
  products.push(new Product("BMW", 15540, "https://kvdbil-images.imgix.net/7271206/1c69116d.jpg"));
  products.push(new Product("Porche", 10670, "https://a.storyblok.com/f/338913/1280x1024/f8ad827507/718-desktop_5-4.jpg/m/filters:format(webp):quality(80)"));
  products.push(new Product("Audi", 20000, "https://borjessonsbil.ams3.cdn.digitaloceanspaces.com/production/campaigns/_heroDefault/Audi_A5_Avant_2408.jpg"));
  products.push(new Product("Kia", 17888, "https://www.kia.com/content/dam/kwcms/kme/se/sv/assets/contents/new-car/ev9/Kia_EV9_1920x1080px.jpg"));
  products.push(new Product("Ford", 28883, "https://mnd-assets.mynewsdesk.com/image/upload/ar_16:9,c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782/pz9lzixo25becqb4bpul"));
  products.push(new Product("Skoda", 76542, "https://cdn.skoda-auto.com/images/sites/svse-v2/ae50dc60-d22b-46ba-940b-44825cbe99fd/7e90a24ea943cef16e7ede8d0c77c8e1"));
  products.push(new Product("Volkswagen", 93837, "https://borjessonsbil.ams3.cdn.digitaloceanspaces.com/production/campaigns/_heroDefault/Golf_2407.jpg"));
  products.push(new Product("Ferrari", 8229375, "https://www.hoom.se/wp-content/uploads/2021/06/01_296_GTB_34_ant-scaled.jpg"));
  products.push(new Product("Rolls-Royce", 627393837, "https://www.kingmagazine.se/app/uploads/2019/04/9555a3d4-5cb1f3b147906.jpg"));
}

/** Samma produktlista som API:et – här kollas och sparas budet. */
export function placeBidOnProduct(
  auctionId: string,
  amount: number,
): { ok: true; product: Product } | { ok: false; reason: string } {
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return { ok: false, reason: "Invalid bid amount" };
  }
  const product = products.find((p) => p.id === auctionId);
  if (!product) {
    return { ok: false, reason: "Auction not found" };
  }
  // Inget bud innan: räkna från startpris. Annars från senaste budet.
  const currentHigh = product.bid > 0 ? product.bid : product.startsum;
  if (amount <= currentHigh) {
    return { ok: false, reason: "Bid must be higher than the current bid" };
  }
  product.bid = amount;
  return { ok: true, product };
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
    const { product1, startsum, imgURL } = req.body;
    if (!product1 || !startsum || !imgURL) {
      return res.status(400).json({ message: "product are required" });
    }
    const product = new Product(product1, startsum, imgURL);
    products.push(product);
    
    res.status(201).json(product);
  });

export { productRouter, initProducts };
