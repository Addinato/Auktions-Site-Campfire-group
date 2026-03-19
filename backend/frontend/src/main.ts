import './style.css'



let productRows = document.getElementById("gameRows") as HTMLTableSectionElement;


function getAuctions(){
    fetch('http://localhost:3000/api/product')
    .then(response => response.json())
    .then(data => {
        data.forEach((product:any) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                <a href="/product.html?id=${product.id}">
                ${product.id}</a>
                </td>
                <td>${product.product1}</td>
                <td>${product.product2}</td>
                <td>${product.bid1} - ${product.bid2}</td>
            `;
            productRows.appendChild(row);
        });
    });
}

getAuctions();

