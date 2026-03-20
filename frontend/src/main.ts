let productRows = document.getElementById("productRows") as HTMLTableSectionElement;

function getAuctions() {
    fetch('http://localhost:3000/api/product')
        .then(res => res.json())
        .then(data => {
            productRows.innerHTML = "";

            data.forEach((product: any) => {
                const row = document.createElement("tr");

                row.className = "hover:bg-gray-50 cursor-pointer transition";

                row.innerHTML = `
                    <td class="px-6 py-4 text-blue-600">${product.id}</td>
                    <td class="px-6 py-4 font-medium">${product.product1}</td>
                    <td class="px-6 py-4">${product.startsum}</td>
                    <td class="px-6 py-4 font-semibold">${product.bid}</td>
                `;

                row.onclick = () => {
                    window.location.href = `/product.html?id=${product.id}`;
                };

                productRows.appendChild(row);
            });
        });
}

getAuctions();