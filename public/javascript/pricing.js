document.querySelectorAll('.icon-content a').forEach(button => {
  button.addEventListener('click', function() {
    const service = this.id;  // Get the service based on the button's ID
    const cardsContainer = document.getElementById('service-cards');
    
    // Add fade-out class to start fading out
    cardsContainer.classList.add('fade-out');

    // Add a slight delay to ensure the fade-out happens before we clear and update content
    setTimeout(() => {
      // Hide the content temporarily to avoid blinking
      cardsContainer.classList.add('hidden');

      // Clear current cards content
      cardsContainer.innerHTML = '';  

      fetch(`/get-pricing?service=${service}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(serviceCard => {
            const card = `
              <div class="pack-container">
                <div class="header">
                  <p class="title">${serviceCard.title}</p>
                  <div class="price-container">
                    <span>$</span>${serviceCard.price}
                  </div>
                </div>
                <div>
                  <ul class="lists">
                    ${serviceCard.features.map(feature => 
                      `<li class="list">
                        <span>
                          <i class="fa-solid fa-circle-check"></i>
                        </span>
                        <p class="mt-3">${feature}</p>
                      </li>`
                    ).join('')}
                  </ul>
                </div>
                <div class="button-container">
                  <button type="button">Select Package</button>
                </div>
              </div>
            `;
            cardsContainer.innerHTML += card;
          });

          // Remove fade-out and hidden classes, fade in the updated content
          cardsContainer.classList.remove('fade-out');
          cardsContainer.classList.remove('hidden');
        });
    }, 500);  // Match the timeout with the fade-out duration (0.5s)
  });
});
