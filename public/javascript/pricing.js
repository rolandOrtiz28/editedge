document.addEventListener("DOMContentLoaded", function () {
  const pricingContainer = document.getElementById("pricing-cards");
  const buttons = document.querySelectorAll(".pricing-tabs .btn");

  // Button click event
  buttons.forEach(button => {
      button.addEventListener("click", function () {
          buttons.forEach(btn => btn.classList.remove("active"));
          this.classList.add("active");

          const service = this.id;
          fetchPricingData(service);
      });
  });

  function fetchPricingData(service) {
    pricingContainer.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;

    fetch(`/get-pricing?service=${service}`)
        .then(response => response.json())
        .then(data => {
            pricingContainer.innerHTML = "";
            data.forEach(plan => {
                const encodedTitle = encodeURIComponent(plan.title);
                const encodedService = encodeURIComponent(service);

                let priceDisplay = `$${plan.price}`;
                let discountBadge = "";
                let descriptionText = "";
                
                if (plan.discountedPrice) {
                    priceDisplay = `<span class="original-price">$${plan.price}</span> <span class="discounted-price">$${plan.discountedPrice}</span>`;
                    discountBadge = `<span class="discount-badge">${plan.discountPercentage}% OFF</span>`;
                
                    if (plan.discountDescription && plan.discountDescription.trim() !== "") {
                        descriptionText = `<p class="discount-description">${plan.discountDescription}</p>`;
                    }
                }

                const card = `
                    <div class="card mt-4 card_box">
                    ${plan.hasActiveDiscount ? discountBadge : ''}
                        <div class="mx-2 card-body">
                            <h5 class="card-title my-2">${plan.title}</h5>
                            <p class="text-muted mb-2">Tailored solutions to bring your ideas to <span>life.</span></p>
                            <p class="h2 fw-bold">${priceDisplay}</p>

                            ${plan.hasActiveDiscount && plan.discountDescription.trim() !== "" ? `
            <p class="text-info small mt-2">${plan.discountDescription}</p>
        ` : ''}
                            <button class="btn btn-dark d-block mb-2 mt-3 text-capitalize select-package" 
                                    data-service="${encodedService}" 
                                    data-plan="${encodedTitle}">
                                Select Package
                            </button>
                        </div>
                        <div class="card-footer">
                            <p class="text-uppercase fw-bold" style="font-size: 12px;">What's included</p>
                            <ol class="list-unstyled mb-0 px-4">
                                ${plan.features.map(feature => `
                                    <li class="mb-3">
                                        <i class="fas fa-check text-success me-3"></i>
                                        <small>${feature}</small>
                                    </li>
                                `).join('')}
                            </ol>
                        </div>
                    </div>
                `;
                pricingContainer.innerHTML += card;
            });

            attachSelectPackageListeners();
        })
        .catch(error => console.error("Error loading pricing:", error));
}

  function attachSelectPackageListeners() {
      document.querySelectorAll(".select-package").forEach(btn => {
          btn.addEventListener("click", function () {
              const service = this.getAttribute("data-service");
              const plan = this.getAttribute("data-plan");

              window.location.href = `/pricing-form?service=${service}&plan=${plan}`;
          });
      });
  }

  fetchPricingData("video-editing");


  document.querySelectorAll('.special-offer-btn').forEach(button => {
    button.addEventListener('click', function () {
      const plan = this.getAttribute('data-plan');
      const isSpecialOffer = "true";
  
      // If it's a Limited-Time Deal, we add an extra promo flag
      const isLimitedTimeDeal = plan.includes("Limited-Time Deals") ? "true" : "false";
  
      window.location.href = `/pricing-form?service=Special Offer&plan=${encodeURIComponent(plan)}&special=${isSpecialOffer}&promo=${isLimitedTimeDeal}`;
    });
  });
});


