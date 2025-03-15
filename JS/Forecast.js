let apiUrl = "https://weatherforecasting-2tbx.onrender.com/forecast?city=";
        let charts = {};

        fetchWeatherData();
        setInterval(fetchWeatherData, 60000);

        async function fetchWeatherData() {
            const city = document.getElementById("citySelect").value;

            try {
                document.getElementById("error-message").style.display = "none";
                const response = await fetch(`${apiUrl}${city}`);
                const data = await response.json();

                if (!data.list || data.list.length === 0) {
                    showError("No weather data found! Try another city.");
                    return;
                }

                processWeatherData(data.list);
            } catch (error) {
                showError("Error fetching data! Check console.");
                console.error("Fetch error:", error);
            }
        }

        function showError(message) {
            let errorDiv = document.getElementById("error-message");
            errorDiv.innerText = message;
            errorDiv.style.display = "block";
        }

        function processWeatherData(weatherList) {
            let dates = [];
            let temperatures = [];
            let humidityLevels = [];
            let windSpeeds = [];
            let pressureLevels = [];
            let conditions = {};

            weatherList.forEach(data => {
                let date = data.dt_txt.split(" ")[0];
                let temp = data.main.temp;
                let humidity = data.main.humidity;
                let windSpeed = data.wind.speed;
                let pressure = data.main.pressure;
                let condition = data.weather[0].main;

                if (!dates.includes(date)) dates.push(date);
                temperatures.push(temp);
                humidityLevels.push(humidity);
                windSpeeds.push(windSpeed);
                pressureLevels.push(pressure);

                if (!conditions[condition]) conditions[condition] = 0;
                conditions[condition]++;
            });

            updateCharts(dates, temperatures, humidityLevels, windSpeeds, pressureLevels, conditions);
        }

        function destroyChart(chartId) {
            if (charts[chartId]) {
                charts[chartId].destroy();
                charts[chartId] = null;
            }
        }

        function updateCharts(dates, temperatures, humidityLevels, windSpeeds, pressureLevels, conditions) {
            let colors = ["#ff5733", "#33ff57", "#5733ff", "#33ffff", "#ffcc33"];
            let totalConditions = Object.values(conditions).reduce((a, b) => a + b, 0);
            let conditionPercentages = Object.keys(conditions).map(key => ({
                label: key,
                value: ((conditions[key] / totalConditions) * 100).toFixed(2)
            }));

            destroyChart("weeklyTempChart");
            destroyChart("humidityChart");
            destroyChart("weatherPieChart");
            destroyChart("windSpeedChart");
            destroyChart("pressureChart");

            charts["weeklyTempChart"] = new Chart(document.getElementById("weeklyTempChart"), {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{ label: "Temperature (°C)", data: temperatures, borderColor: "#ff5733", fill: false }]
                },
                options: {
        plugins: {
            title: {
                display: true,
                text: "📈 Daily Temperature Trend",
                font: { size: 18 },
                color: "#333"
            }
        }
    }
            });

            charts["humidityChart"] = new Chart(document.getElementById("humidityChart"), {
                type: "bar",
                data: {
                    labels: dates,
                    datasets: [{ label: "Humidity (%)", data: humidityLevels, backgroundColor: "#33ff57" }]
                },
                options: {
        plugins: {
            title: {
                display: true,
                text: "💧 Atmospheric Humidity Trends",
                font: { size: 18 },
                color: "#333"
            }
        }
    }

            });

            charts["windSpeedChart"] = new Chart(document.getElementById("windSpeedChart"), {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{ label: "Wind Speed (m/s)", data: windSpeeds, borderColor: "#ff9900", fill: true }]
                },
                options: {
        plugins: {
            title: {
                display: true,
                text: "🌪️ Wind Speed Variations",
                font: { size: 18 },
                color: "#333"
            }
        }
    }

            });

            charts["pressureChart"] = new Chart(document.getElementById("pressureChart"), {
                type: "line",
                data: { labels: dates, datasets: [{ label: "Pressure (hPa)", data: pressureLevels, borderColor: "#6600cc" }] }
           ,options: {
        plugins: {
            title: {
                display: true,
                text: "🌎 Atmospheric Pressure Trends",
                font: { size: 18 },
                color: "#333"
            }
        }
    }

            });

            charts["weatherPieChart"] = new Chart(document.getElementById("weatherPieChart"), {
                type: "pie",
                data: { labels: conditionPercentages.map(c => c.label), datasets: [{ data: conditionPercentages.map(c => c.value), backgroundColor: colors }] }
           , options: {
        plugins: {
            title: {
                display: true,
                text: "⛈️ Weekly Weather Condition Distribution (%)",
                font: { size: 18 },
                color: "#333"
            }
        }
    }

            });
        }

        document.getElementById('menuButton').addEventListener('click', function () {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });


        function updateTime() {
            let now = new Date();
            document.getElementById('currentDate').textContent = now.toDateString();
            document.getElementById('currentTime').textContent = now.toLocaleTimeString();
        }
        setInterval(updateTime, 1000);
        updateTime();


