 // Level Chart
 const levelCtx = document.getElementById('levelChart').getContext('2d');
 new Chart(levelCtx, {
     type: 'bar',
     data: {
         labels: ['Volume', 'Service'],
         datasets: [{
             data: [65, 85],
             backgroundColor: ['rgba(147, 230, 207, 0.8)', 'rgba(147, 230, 207, 0.8)']
         }]
     },
     options: {
         scales: {
             y: {
                 beginAtZero: true
             }
         },
         plugins: {
             legend: {
                 display: false
             }
         }
     }
 });

 // Customer Fulfillment Chart
 const fulfillmentCtx = document.getElementById('fulfillmentChart').getContext('2d');
 new Chart(fulfillmentCtx, {
     type: 'line',
     data: {
         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
         datasets: [{
             label: 'This Month',
             data: [4200, 4500, 4800, 4600, 4700, 4785],
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

 // Visitor Insights Chart
 const visitorCtx = document.getElementById('visitorChart').getContext('2d');
 new Chart(visitorCtx, {
     type: 'doughnut',
     data: {
         labels: ['New', 'Returning'],
         datasets: [{
             data: [65, 35],
             backgroundColor: [
                 'rgba(147, 230, 207, 0.8)',
                 'rgba(180, 180, 180, 0.8)'
             ]
         }]
     }
 });