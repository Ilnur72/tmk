(() => {
  // src/js/components/report-donut-chart.js
  (function() {
    "use stirct";
    if ($("#report-donut-chart").length) {
      const chartColors = () => [

        getColor("primary", 0.9),
        getColor("warning", 0.9)
      ];
      const ctx = $("#report-donut-chart")[0].getContext("2d");
      const reportDonutChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: [
            "Эркак киши",
            "Аёл киши"
          ],
          datasets: [
            {
              data: [62, 33],
              backgroundColor: chartColors,
              hoverBackgroundColor: chartColors,
              borderWidth: 5,
              borderColor: () => $("html").hasClass("dark") ? getColor("darkmode.700") : getColor("white")
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          cutout: "80%"
        }
      });
      helper.watchClassNameChanges($("html")[0], (currentClassName) => {
        reportDonutChart.update();
      });
    }
  })();
})();
