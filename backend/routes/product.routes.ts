import { Router,Request,Response } from "express";
import { getIo } from "../socket";


class Product{
    constructor(product1:string, product2:string){
        this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.product1 = product1;
        this.product2 = product2;
    }
    id:string;
    product1:string;
    product2:string;
    bid1:number = 0;
    bid2:number = 0;

};


const products:Product[] = [];

function initProducts(){
    products.push(new Product("Boat", "Motorcycle"));
    products.push(new Product("Bicycle", "Football"));
    products.push(new Product("PS5", "Fortnite"));
}




const productRouter = Router();

productRouter.get("/",(req:Request,res:Response)=>{
    res.json(products);
});

productRouter.put("/:id",(req:Request,res:Response)=>{
    const {id} = req.params;
    const {bid1, bid2} = req.body;
    const product = products.find(g => g.id === id);
    if(!product){
        return res.status(404).json({message:"Product not found"});
    }
    if(bid1 !== undefined){
        product.bid1 = bid1;
    }
    if(bid2 !== undefined){   
        product.bid2 = bid2;
    }
    try{
        getIo().to(id).emit('productUpdate', product);
    }catch(e){
        // Socket.IO not initialized yet; ignore emit
    }
    res.json(product);
});


productRouter.get("/:id",(req:Request,res:Response)=>{
    const {id} = req.params;
    const product = products.find(g => g.id === id);
    if(!product){
        return res.status(404).json({message:"Product not found"});
    }   
    res.json(product);
});


productRouter.post("/",(req:Request,res:Response)=>{
    const {product1, product2} = req.body;
    if(!product1 || !product2){
        return res.status(400).json({message:"product1 and product2 are required"});
    }
    const product = new Product(product1, product2);
    products.push(product);
    res.status(201).json(product);
});


export { productRouter, initProducts };