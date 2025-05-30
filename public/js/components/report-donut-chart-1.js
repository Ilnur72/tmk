(() => {
  // src/js/components/report-donut-chart-1.js
  (function() {
    "use strict";
    if ($(".report-donut-chart-1").length) {
      $(".report-donut-chart-1").each(function() {
        const chartColors = () => [
          getColor("warning", 0.9),
          getColor("primary", 0.9)
        ];
        const ctx = $(this)[0].getContext("2d");
        const reportDonutChart1 = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Yellow", "Dark"],
            datasets: [
              {
                data: [300, 13300],
                backgroundColor: chartColors,
                hoverBackgroundColor: chartColors,
                borderWidth: 2,
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
            cutout: "83%"
          }
        });
        helper.watchClassNameChanges($("html")[0], (currentClassName) => {
          reportDonutChart1.update();
        });
      });
    }
  })();
})();
