document.addEventListener('DOMContentLoaded', () => {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarNav');
    const servicesDropdown = document.getElementById('servicesDropdown');

    // Handle Navbar Toggler
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });
    }

    // Handle Dropdown Click
    if (servicesDropdown) {
        servicesDropdown.addEventListener('click', function () {
            console.log('Dropdown clicked');
            const dropdown = new bootstrap.Dropdown(this);
            dropdown.toggle();
        });
    }
});
