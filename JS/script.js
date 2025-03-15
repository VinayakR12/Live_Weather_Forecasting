

document.addEventListener("DOMContentLoaded", function () {
    const tempCtx = document.getElementById("temperatureChart").getContext("2d");
    const humidityCtx = document.getElementById("humidityChart").getContext("2d");
    const windCtx = document.getElementById("windChart").getContext("2d");

    let selectedCity = document.getElementById("citySelect").value;
    let timeLabels = [];
    let tempChart, humidityChart, windChart;
    let isError = false; // Track error state

    function hideLoader() {
        if (!isError) {  // Only hide loader if there's no error
            const loader = document.getElementById("loader");
            if (loader) loader.style.display = "none";
        }
    }

    function showLoader() {
        const loader = document.getElementById("loader");
        if (loader) loader.style.display = "flex";
    }

    function initializeCharts() {
        tempChart = createChart(tempCtx, "Temperature (°C)", "rgba(255, 99, 132, 0.8)");
        humidityChart = createChart(humidityCtx, "Humidity (%)", "rgba(54, 162, 235, 0.8)");
        windChart = createChart(windCtx, "Wind Speed (km/h)", "rgba(75, 192, 192, 0.8)");
    }

    function updateDateTime() {
        document.getElementById("currentDate").innerText = new Date().toDateString();
        document.getElementById("currentTime").innerText = new Date().toLocaleTimeString();
    }

    function fetchWeather(city, resetGraph = false, showLoading = false) {
        if (showLoading) showLoader();

        fetch(`https://weatherforecasting-2tbx.onrender.com/weather?city=${city}`)
            .then(response => response.json())
            .then(data => {
                isError = false;  // Reset error flag on success

                document.getElementById("weather").innerText = data.weather[0].description;
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

                let currentTime = new Date().toLocaleTimeString();
                timeLabels.push(currentTime);
                updateChart(tempChart, data.main.temp, currentTime);
                updateChart(humidityChart, data.main.humidity, currentTime);
                updateChart(windChart, data.wind.speed, currentTime);

                hideLoader(); // Hide loader after successful fetch
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                isError = true; // Set error flag
                showLoader(); // Keep loader visible until success
            });
    }

    function fetchAirQuality(city, showLoading = false) {
        if (showLoading) showLoader();

        fetch(`https://weatherforecasting-2tbx.onrender.com/air_quality?city=${city}`)
            .then(response => response.json())
            .then(data => {
                isError = false;  // Reset error flag on success

                document.getElementById("1").innerText = `${data.list[0].components.co} µg/m³`;
                document.getElementById("2").innerText = `${data.list[0].components.no} µg/m³`;
                document.getElementById("3").innerText = `${data.list[0].components.no2} µg/m³`;
                document.getElementById("4").innerText = `${data.list[0].components.o3} µg/m³`;
                document.getElementById("5").innerText = `${data.list[0].components.pm2_5} µg/m³`;
                document.getElementById("6").innerText = `${data.list[0].components.pm10} µg/m³`;
                document.getElementById("7").innerText = `${data.list[0].components.so2} µg/m³`;
                document.getElementById("8").innerText = `${data.list[0].components.nh3} µg/m³`;

                hideLoader(); // Hide loader after successful fetch
            })
            .catch(error => {
                console.error("Error fetching air quality data:", error);
                isError = true; // Set error flag
                showLoader(); // Keep loader visible until success
            });
    }

    function createChart(ctx, label, borderColor) {
        return new Chart(ctx, {
            type: "line",
            data: { labels: [], datasets: [{ label, borderColor, borderWidth: 3, pointRadius: 4, backgroundColor: "rgba(255,255,255,0.2)", fill: true, data: [] }] },
            options: {
                animation: { duration: 500 },
                scales: { x: { title: { text: "Time (HH:MM:SS)", font: { size: 14 } } }, y: { beginAtZero: true, title: { text: label, font: { size: 14 } } } },
                plugins: { legend: { labels: { font: { size: 14 } } } }
            }
        });
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

    // First-time load: show loader
    fetchWeather(selectedCity, true, true);
    fetchAirQuality(selectedCity, true);

    // Automatic updates every 5 seconds (without loader)
    setInterval(() => {
        if (!isError) {
            fetchWeather(selectedCity, false, false);
        }
    }, 5000);

    document.getElementById("citySelect").addEventListener("change", function () {
        selectedCity = this.value;
        fetchWeather(selectedCity, true, true);
        fetchAirQuality(selectedCity, true);
    });
});
