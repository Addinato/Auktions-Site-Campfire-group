function ProductCard(product: any): HTMLElement {
    const card = document.createElement("div");

    card.className = `
        bg-white rounded-2xl shadow-sm overflow-hidden
        hover:shadow-md transition cursor-pointer
    `;

    card.innerHTML = `
        <a href="product.html?id=${product.id}">
            <img src="${product.imgURL}" class="w-full h-40 object-cover" />

            <div class="p-4 space-y-2">
                <h2 class="font-semibold text-lg text-[#19323C]">${product.product1}</h2>
                <p class="text-[#A93F55] text-sm">
                    Startbud: ${product.startsum} kr
                </p>
                <p class="font-bold text-[#19323C]">
                    Bid: ${product.bid} kr
                </p>
            </div>
        </a>
    `;

    card.onclick = () => {
        window.location.href = `product.html?id=${product.id}`;
    };

    return card;
}

export { ProductCard };