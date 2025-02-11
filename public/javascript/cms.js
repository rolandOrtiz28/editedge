
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

    document.addEventListener("DOMContentLoaded", function () {
        const statusDropdowns = document.querySelectorAll('.status-dropdown');
    
        statusDropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', async function () {
                const blogId = this.getAttribute('data-blog-id');  // Get blog slug
                const newStatus = this.value;  // Get selected status
    
                try {
                    const response = await fetch(`/blogs/${blogId}/status`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: newStatus })
                    });
    
                    const result = await response.json();
    
                    if (result.success) {
                        alert('Status updated successfully!');
                    } else {
                        alert('Error updating status.');
                    }
                } catch (error) {
                    console.error("Error updating status:", error);
                    alert("Failed to update status. Try again.");
                }
            });
        });
    });
    


    