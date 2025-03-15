
document.addEventListener("DOMContentLoaded", function () {
    const tempCtx = document.getElementById("temperatureChart").getContext("2d");
    const humidityCtx = document.getElementById("humidityChart").getContext("2d");
    const windCtx = document.getElementById("windChart").getContext("2d");

    let selectedCity = "Mumbai";
    let timeLabels = [];
    let tempChart, humidityChart, windChart;

        function showLoader() {
        document.getElementById("loader").style.display = "flex";
        document.getElementById("main-content").style.opacity = "0.5";
    }

  function hideLoader() {
    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("main-content");

    if (loader) {
        loader.style.display = "none";
    }
    if (mainContent) {
        mainContent.style.opacity = "1";
        mainContent.style.display = "block";
    }
}



    function initializeCharts() {
        tempChart = createChart(tempCtx, "Temperature (°C)", "rgba(255, 99, 132, 0.8)");
        humidityChart = createChart(humidityCtx, "Humidity (%)", "rgba(54, 162, 235, 0.8)");
        windChart = createChart(windCtx, "Wind Speed (km/h)", "rgba(75, 192, 192, 0.8)");
    }

    function updateDateTime() {
        const now = new Date();
        document.getElementById("currentDate").innerText = now.toDateString();
        document.getElementById("currentTime").innerText = now.toLocaleTimeString();
    }

    function getNextTime(interval = 0) {
        const now = new Date();
        return new Date(now.getTime() + interval * 10000).toLocaleTimeString();
    }

    function fetchWeather(city, resetGraph = false) {
        fetch(`https://weatherforecasting-2tbx.onrender.com/weather?city=${city}`)
            .then(response => response.json())
            .then(data => {

            console.log("My data ",data);
                 document.getElementById("weather").innerText = `${data.weather[0].description}`;
                document.getElementById("temperature").innerText = `${data.main.temp} °C`;
                document.getElementById("humidity").innerText = `${data.main.humidity}%`;
                document.getElementById("windSpeed").innerText = `${data.wind.speed} km/h`;
                document.getElementById("sunrise").innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
                document.getElementById("sunset").innerText = new Date(data.sys.sunset * 1000).toLocaleTimeString();

                if (resetGraph) {
                    timeLabels = [];
                    tempChart.data.labels = [];
                    tempChart.data.datasets[0].data = [];
                    humidityChart.data.labels = [];
                    humidityChart.data.datasets[0].data = [];
                    windChart.data.labels = [];
                    windChart.data.datasets[0].data = [];
                }

                let currentTime = getNextTime(0);
                let nextTime = getNextTime(1);

                if (timeLabels.length === 0) {
                    timeLabels.push(currentTime);
                    timeLabels.push(nextTime);
                    updateChart(tempChart, data.main.temp, currentTime);
                    updateChart(humidityChart, data.main.humidity, currentTime);
                    updateChart(windChart, data.wind.speed, currentTime);
                } else {
                    timeLabels.push(nextTime);
                    updateChart(tempChart, data.main.temp, timeLabels[timeLabels.length - 2]);
                    updateChart(humidityChart, data.main.humidity, timeLabels[timeLabels.length - 2]);
                    updateChart(windChart, data.wind.speed, timeLabels[timeLabels.length - 2]);
                }
                hideLoader();
            })
            .catch(error => console.error("Error fetching data:", error));
    }

    function createChart(ctx, label, borderColor) {
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    borderColor: borderColor,
                    borderWidth: 3,
                    pointRadius: 4,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    fill: true,
                    data: [],
                }]
            },
            options: {
                animation: { duration: 500 },
                scales: {
                    x: { display: true, title: { display: true, text: "Time (HH:MM:SS)", font: { size: 14 } } },
                    y: { beginAtZero: true, title: { display: true, text: label, font: { size: 14 } } }
                },
                plugins: {
                    legend: { labels: { font: { size: 14 } } }
                }
            }
        });
    }

function air(city){
        fetch(`https://weatherforecasting-2tbx.onrender.com/air_quality?city=${city}`)
        .then(response => response.json()
        )
        .then(data => {
                    console.log("happy_AIR",data);
        document.getElementById("1").innerText = `${data.list[0].components.co} µg/m³`;  // CO (Micrograms per cubic meter)
        document.getElementById("2").innerText = `${data.list[0].components.no} µg/m³`;  // NO
        document.getElementById("3").innerText = `${data.list[0].components.no2} µg/m³`; // NO2
        document.getElementById("4").innerText = `${data.list[0].components.o3} µg/m³`;  // O3
        document.getElementById("5").innerText = `${data.list[0].components.pm2_5} µg/m³`; // PM2.5
        document.getElementById("6").innerText = `${data.list[0].components.pm10} µg/m³`;  // PM10
        document.getElementById("7").innerText = `${data.list[0].components.so2} µg/m³`;  // SO2
        document.getElementById("8").innerText = `${data.list[0].components.nh3} µg/m³`;  // NH3

        }).catch(error => console.error("Error fetching Air data:", error));
}


    function updateChart(chart, newData, timeLabel) {
        chart.data.labels.push(timeLabel);
        chart.data.datasets[0].data.push(newData);
        if (chart.data.labels.length > 10) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update();
    }

    updateDateTime();
    setInterval(updateDateTime, 500);
    initializeCharts();
    fetchWeather(selectedCity, true);

    setInterval(() => fetchWeather(selectedCity), 5000);

  document.getElementById("citySelect").addEventListener("change", function () {
    showLoader();

    setTimeout(() => {
        selectedCity = this.value;
        fetchWeather(selectedCity, true);
        air(selectedCity);
        hideLoader();
    }, 800);
});

    selectedCity1 = document.getElementById("citySelect").value;
    fetchWeather(selectedCity1, true);
    air(selectedCity1);
});

