document.querySelectorAll('.icon-content a').forEach(button => {
  button.addEventListener('click', function () {
    const service = this.id;
    const cardsContainer = document.getElementById('service-cards');

    cardsContainer.classList.add('fade-out');

    setTimeout(() => {
      cardsContainer.classList.add('hidden');
      cardsContainer.innerHTML = '';

      fetch(`/get-pricing?service=${service}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(serviceCard => {
            const encodedTitle = encodeURIComponent(serviceCard.title);
            const encodedService = encodeURIComponent(service);

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
                      </li>`).join('')}
                  </ul>
                </div>
                <div class="button-container">
                  <button id="btn" class="btns select-package" data-service="${encodedService}" data-plan="${encodedTitle}" data-special="false">
                    Select Package
                  </button>
                </div>
              </div>
            `;
            cardsContainer.innerHTML += card;
          });

          // Add event listeners for dynamically generated package buttons
          document.querySelectorAll('.select-package').forEach(btn => {
            btn.addEventListener('click', function () {
              const service = this.getAttribute('data-service');
              const plan = this.getAttribute('data-plan');
              const isSpecialOffer = this.getAttribute('data-special'); // "false" for normal selections

              window.location.href = `/pricing-form?service=${service}&plan=${plan}&special=${isSpecialOffer}`;
            });
          });

          cardsContainer.classList.remove('fade-out', 'hidden');
        });
    }, 500);
  });
});

// Handle Special Offer Selection
document.querySelectorAll('.special-offer-btn').forEach(button => {
  button.addEventListener('click', function () {
    const plan = this.getAttribute('data-plan');
    const isSpecialOffer = "true";

    // If it's a Limited-Time Deal, we add an extra promo flag
    const isLimitedTimeDeal = plan.includes("Limited-Time Deals") ? "true" : "false";

    window.location.href = `/pricing-form?service=Special Offer&plan=${encodeURIComponent(plan)}&special=${isSpecialOffer}&promo=${isLimitedTimeDeal}`;
  });
});
