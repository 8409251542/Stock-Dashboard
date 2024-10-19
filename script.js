const dropdown = document.getElementById('trending-stocks');
const api="QC83RPXC7001Z8P9";
let symInput=document.getElementById("search-bar");

symInput.addEventListener('change',()=>{
    stockData(symInput.value);
});
dropdown.addEventListener('change',()=>{  
    stockData(dropdown.value);
});

async function stockData(input){
    try {
        let response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${input}&apikey=${api}`);
        let result = await response.json();
        console.log(result);

        if (result['Time Series (Daily)']) {
            const timeSeries = result['Time Series (Daily)'];

            const dates = [];
            const closingValues = [];

            // Extract the last 30 days of data
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
function renderChart(dates, closingValues) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const stockChart = new Chart(ctx, {
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
