document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
      const service = this.id;
      document.getElementById('service-cards').innerHTML = '';  // Clear current cards
  
      fetch(`/get-pricing?service=${service}`)
        .then(response => response.json())
        .then(data => {
          const cardsContainer = document.getElementById('service-cards');
          data.forEach(serviceCard => {
            const card = `
              <div class="col-md-4">
                <div class="pack-container">
                  <div class="header">
                    <p class="title">${serviceCard.title}</p>
                    <div class="price-container">
                      <span>$</span>${serviceCard.price}
                      <span>/mo</span>
                    </div>
                  </div>
                  <div>
                    <ul class="lists">
                      ${serviceCard.features.map(feature => 
                        `<li class="list">
                          <span>
                            <svg aria-hidden="true" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.5 12.75l6 6 9-13.5" stroke-linejoin="round" stroke-linecap="round"></path>
                            </svg>
                          </span>
                          <p>${feature}</p>
                        </li>`
                      ).join('')}
                    </ul>
                  </div>
                  <div class="button-container">
                    <button type="button">Buy Now</button>
                  </div>
                </div>
              </div>
            `;
            cardsContainer.innerHTML += card;
          });
        });
    });
  });
  