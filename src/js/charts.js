export function drawIndustryChart(data) {
  const industryTotals = {};

  data.forEach(item => {
    if (!industryTotals[item.industry]) {
      industryTotals[item.industry] = 0;
    }
    industryTotals[item.industry] += item.numberOfEmployees;
  });

  const labels = Object.keys(industryTotals);
  const values = Object.values(industryTotals);

  const ctx = document.getElementById('industryChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Employees per Industry',
        data: values,
        backgroundColor: generateColors(labels.length)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Number of Employees per Industry'
        }
      }
    }
  });
}

export function drawCountryChart(data) {
  const countryTotals = {};

  data.forEach(item => {
    countryTotals[item.country] = (countryTotals[item.country] || 0) + item.numberOfEmployees;
  });

  const labels = Object.keys(countryTotals);
  const values = Object.values(countryTotals);

  const ctx = document.getElementById('countryChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Employees per Country',
        data: values,
        backgroundColor: generateColors(labels.length)
      }]
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: 'Employees per Country'
        }
      }
    }
  });
}

// Helper to generate distinct colors
export function generateColors(count) {
  const colors = [
    '#4e79a7', '#f28e2c', '#e15759', '#76b7b2',
    '#59a14f', '#edc949', '#af7aa1', '#ff9da7',
    '#9c755f', '#bab0ab', '#86bc86', '#d4a6c8'
  ];

  while (colors.length < count) {
    colors.push(...colors);
  }
  return colors.slice(0, count);
}