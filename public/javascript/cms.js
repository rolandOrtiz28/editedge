
    document.addEventListener("DOMContentLoaded", function () {
        const ctx = document.getElementById('blogPerformanceChart').getContext('2d');

        // ✅ Fix: Use JSON.parse to safely inject EJS data
        const topBlogs = JSON.parse('<%- JSON.stringify(topBlogs) %>');

        console.log("Top Blogs Data:", topBlogs); // ✅ Debugging

        const data = {
            labels: topBlogs.map(blog => blog.title),  // ✅ Titles
            datasets: [{
                label: 'Views',
                data: topBlogs.map(blog => blog.views),  // ✅ Views
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        };

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    });

