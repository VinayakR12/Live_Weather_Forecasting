
        const cities = ["Kolhapur", "Mumbai", "Pune", "Sangli", "Satara"];
        let selectedCities = ["Kolhapur", "Mumbai"];

        function createCityDropdown(cityName) {
    const div = document.createElement("div");
    div.classList.add("d-flex", "align-items-center", "justify-content-center", "mb-2", "gap-2");

    const iconWrapper = document.createElement("div");
    iconWrapper.classList.add("d-flex", "align-items-center", "justify-content-center");

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-city", "fs-4");

    const selectWrapper = document.createElement("div");
    selectWrapper.classList.add("d-flex", "align-items-center", "justify-content-center");

    const select = document.createElement("select");

    select.classList.add("custom-select-width");

    select.innerHTML = cities.map(city =>
        `<option value="${city}" ${city === cityName ? "selected" : ""}
        ${selectedCities.includes(city) && city !== cityName ? "disabled" : ""}>${city}</option>`
    ).join("");

    select.addEventListener("change", function () {
        const index = selectedCities.indexOf(cityName);
        selectedCities[index] = this.value;
        renderCityFields();
    });

    iconWrapper.appendChild(icon);
    selectWrapper.appendChild(select);
    div.appendChild(iconWrapper);
    div.appendChild(selectWrapper);

    return div;
}


        function renderCityFields() {
            const container = document.getElementById("city-container");
            container.innerHTML = "";
            selectedCities.forEach(city => {
                container.appendChild(createCityDropdown(city));
            });

            // Show Remove button only if more than 2 cities are selected
            document.getElementById("remove-btn").style.display = selectedCities.length > 2 ? "inline-block" : "none";
        }

        function addCity() {
            if (selectedCities.length < 5) {
                const availableCities = cities.filter(city => !selectedCities.includes(city));
                if (availableCities.length > 0) {
                    selectedCities.push(availableCities[0]);
                    renderCityFields();
                }
            }
        }

        function removeLastCity() {
            if (selectedCities.length > 2) {
                selectedCities.pop();
                renderCityFields();
            }
        }

        function fetchComparison() {
            const parameter = document.getElementById("parameter").value;
            const parameterText = document.getElementById("parameter").selectedOptions[0].text;
            document.getElementById("loader").style.display = "block";

            Promise.all(selectedCities.map(city => fetch(`https://weatherforecasting-2tbx.onrender.com/forecast?city=${city}`).then(res => res.json())))
                .then(results => {
                    document.getElementById("loader").style.display = "none";
                    plotComparison(results, selectedCities, parameter, parameterText);
                })
                .catch(error => console.error("Error fetching data:", error));
        }

        function plotComparison(results, cities, parameter, parameterText) {
            const ctx = document.getElementById("comparisonChart").getContext("2d");
            document.getElementById("graphTitle").textContent = `Comparison of ${parameterText} in Selected Cities`;

            const datasets = results.map((data, index) => ({
                label: cities[index],
                data: data.list.map(item => parameter.includes('.') ? item.wind.speed : item.main[parameter]),
                borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'yellow'
            }));

            if (window.chartInstance) window.chartInstance.destroy();

            window.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: results[0].list.map(item => {
                        let date = new Date(item.dt * 1000);
                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }),
                    datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    let fullDate = new Date(results[0].list[tooltipItem.dataIndex].dt * 1000);
                                    return ` ${tooltipItem.dataset.label}: ${tooltipItem.raw} (${fullDate.toLocaleString()})`;
                                }
                            }
                        }
                    }
                }
            });
        }

        renderCityFields();
        fetchComparison();

        // Toggle Mobile Menu
        document.getElementById('menuButton').addEventListener('click', function () {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });

        // Date & Time Update
        function updateTime() {
            let now = new Date();
            document.getElementById('currentDate').textContent = now.toDateString();
            document.getElementById('currentTime').textContent = now.toLocaleTimeString();
        }
        setInterval(updateTime, 1000);
        updateTime();
