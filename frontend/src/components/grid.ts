function ProductCard(product: any): HTMLElement {
    const card = document.createElement("div");

    card.className = `
        bg-white rounded-2xl shadow-sm overflow-hidden
        hover:shadow-md transition cursor-pointer
    `;

    const imageUrl = product.imgURL;
    
    card.innerHTML = `
        <img src="${imageUrl}" class="w-full h-40 object-cover" />

        <div class="p-4 space-y-2">
            <h2 class="font-semibold text-lg">${product.product1}</h2>
            
            <p class="text-gray-500 text-sm">
                Startbud: ${product.startsum} kr
            </p>

            <p class="font-bold text-blue-600">
                Bid: ${product.bid} kr
            </p>
        </div>
    `;

    card.onclick = () => {
        window.location.href = `/product.html?id=${product.id}`;
    };

    return card;
}

export { ProductCard };