const dropdown = document.getElementById('trending-stocks');
let showInfo=document.getElementById('stock-data');
const api="HE1F6AVAW18A1SSL";
let symInput=document.getElementById("search-bar");
let srcBtn=document.getElementById("search-btn");

srcBtn.addEventListener('click',()=>{
    stockData(symInput.value);
})
symInput.addEventListener('change',()=>{
    stockData(symInput.value);
});
dropdown.addEventListener('change',()=>{  
    stockData(dropdown.value);
});
let tableData=document.getElementById("tableStock");

async function stockData(input){
    let Name = document.getElementById("Name");
    let sprice=document.getElementById("price");
    let schange=document.getElementById("change");
    let svolume=document.getElementById("Volume");
    try {
        let response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${input}&apikey=${api}`);
        let result = await response.json();
        console.log(result);
        showInfo.style.display='flex';
        let sName=result['Meta Data']['2. Symbol'];
        console.log(result['Meta Data']['2. Symbol']);
        let date=result['Meta Data']['3. Last Refreshed'];
        let High=result['Time Series (Daily)'][date]['2. high'];
        let Low=result['Time Series (Daily)'][date]['3. low'];
        let price=result['Time Series (Daily)'][date]['4. close'];
        let change=High-Low;
        let volume=result['Time Series (Daily)'][date]['5. volume'];
        console.log(price,change,volume);
        schange.innerHTML=`${change}`;
        sprice.innerHTML=`${price}`;
        svolume.innerHTML=`${volume}`;
        Name.innerHTML=`${sName.toUpperCase()}`;
        
        let tr=document.createElement('tr');
        tr.innerHTML=
        `<td>
            ${sName.toUpperCase()}
        </td>
        <td>
            ${price}
        </td>
        <td>
            ${change}
        </td>
        <td>
            ${volume}
        </td>`
        tableData.appendChild(tr);

        if (result['Time Series (Daily)']) {
            const timeSeries = result['Time Series (Daily)'];

            const dates = [];
            const closingValues = [];

            Object.keys(timeSeries).slice(0, 30).reverse().forEach(date => {
                dates.push(date);
                closingValues.push(parseFloat(timeSeries[date]['4. close']));
            });

            // Call function to render the chart with the fetched data
            renderChart(dates, closingValues);
        } else {
            console.error("Error fetching stock data: ", result);
        }
        
    } catch (error) {
        console.log("Something not good",error);
        
    }
}
let stockChart=null;
function renderChart(dates, closingValues) {
    const ctx = document.getElementById('stockChart');
    ctx.getContext('2d');
    if(stockChart!=null){
        stockChart.destroy();
    }
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `Closing Price (Last 30 Days)`,
                data: closingValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Closing Price'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Stock Closing Prices for (Last 30 Days)`
                }
            }
        }
    });
}
