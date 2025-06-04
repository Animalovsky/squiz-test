let industryChartInstance = null;
let countryChartInstance = null;

export function drawIndustryChart(data) {
  const industryTotals = {};
  data.forEach((item) => {
    industryTotals[item.industry] =
      (industryTotals[item.industry] || 0) + item.numberOfEmployees;
  });

  const labels = Object.keys(industryTotals);
  const values = Object.values(industryTotals);
  const ctx = document.getElementById("industryChart").getContext("2d");

  // Destroy old chart if it exists
  if (industryChartInstance) {
    industryChartInstance.destroy();
  }

  industryChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Employees per Industry",
          data: values,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: false,
          text: "Number of Employees per Industry",
        },
      },
      scales: {
        x: {
          ticks: {
            display: false, // Hides X-axis tick labels
          },
        },
      },
    },
  });
}

export function drawCountryChart(data) {
  const countryTotals = {};
  data.forEach((item) => {
    countryTotals[item.country] =
      (countryTotals[item.country] || 0) + item.numberOfEmployees;
  });

  const labels = Object.keys(countryTotals);
  const values = Object.values(countryTotals);
  const ctx = document.getElementById("countryChart").getContext("2d");

  // Destroy old chart if it exists
  if (countryChartInstance) {
    countryChartInstance.destroy();
  }

  countryChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      // labels,
      datasets: [
        {
          label: "Employees per Country",
          data: values,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false,
          text: "Employees per Country",
        },
      },
    },
  });
}
