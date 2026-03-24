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