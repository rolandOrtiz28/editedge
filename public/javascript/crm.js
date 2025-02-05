  // Customer Growth Chart
  const growthCtx = document.getElementById('customerGrowthChart').getContext('2d');
  new Chart(growthCtx, {
      type: 'line',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
              label: 'Customer Growth',
              data: [800, 900, 1000, 1100, 1200, 1234],
              borderColor: 'rgba(147, 230, 207, 1)',
              fill: true,
              backgroundColor: 'rgba(147, 230, 207, 0.1)'
          }]
      },
      options: {
          plugins: {
              legend: {
                  display: false
              }
          }
      }
  });

  // Customer Segments Chart
  const segmentsCtx = document.getElementById('customerSegmentsChart').getContext('2d');
  new Chart(segmentsCtx, {
      type: 'doughnut',
      data: {
          labels: ['New', 'Regular', 'VIP', 'Inactive'],
          datasets: [{
              data: [30, 45, 15, 10],
              backgroundColor: [
                  'rgba(147, 230, 207, 0.8)',
                  'rgba(100, 180, 157, 0.8)',
                  'rgba(70, 150, 127, 0.8)',
                  'rgba(180, 180, 180, 0.8)'
              ]
          }]
      }
  });