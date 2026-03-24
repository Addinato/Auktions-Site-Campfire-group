import { Hero } from "./components/hero";
import { ProductCard } from "./components/grid";

let productGrid = document.getElementById("productGrid") as HTMLDivElement;

document.body.prepend(Hero());

function getAuctions() {
    fetch('http://localhost:3000/api/product')
        .then(res => res.json())
        .then(data => {
            productGrid.innerHTML = "";

            data.forEach((product: any) => {
                const card = ProductCard(product);
                productGrid.appendChild(card);
            });
        });
}

getAuctions();