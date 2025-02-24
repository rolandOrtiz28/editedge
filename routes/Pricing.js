const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const Discount = require('../models/Discount');

router.get('/pricing', (req, res) => {
    res.render('Pricing/Pricing', { currentRoute: '/pricing', service: null });

})



// GET pricing data based on service
router.get('/get-pricing', catchAsync(async(req, res) => {
  const { service } = req.query;
  let pricingData = [];

  // Video Editing Service
  if (service === 'video-editing') {
    pricingData = [
      {
        title: 'Basic Package',
        price: '150-250',
        features: ['Simple cuts and transitions', 'Audio syncing', 'Videos up to 5 minutes', '1 revision']
      },
      {
        title: 'Standard Package',
        price: '400-600',
        features: ['Color grading and advanced effects', 'Motion graphics', 'Videos up to 5 minutes', '2 revisions']
      },
      {
        title: 'Premium Package',
        price: '800-1,500',
        features: ['Full production editing', 'Custom animations and sound design', 'Videos up to 10 minutes', '5 revisions']
      },
      {
        title: 'Short-form Monthly Subscription',
        price: '950/month',
        features: ['8 short-form video edits (e.g., social media clips, reels, etc.)', 'Full production editing', 'Custom animations and sound design', 'Maximum of 1 minute and 30 seconds per video']
      },
      {
        title: 'Long-form Monthly Subscription',
        price: '1,200/month',
        features: ['5 long-form video edits (e.g., YouTube videos, tutorials, etc.)', 'Full production editing', 'Custom animations and sound design', 'Maximum of 10 minutes per video']
      },
      {
        title: 'Ultimate Video Editing Subscription',
        price: '2,500/month',
        features: ['10 short &  5 long-form video edits', 'Advanced effects & custom animations', 'Priority delivery', 'Dedicated editor support']
      }
    ];
  }

  // Web Development Service (No changes needed)
  else if (service === 'web-dev') {
    pricingData = [
      {
        title: 'Starter Plan',
        price: '800-1,200',
        features: ['Single-page website', 'Mobile-friendly design', 'Basic SEO setup']
      },
      {
        title: 'Growth Plan',
        price: '1,500-2,500',
        features: ['5-10 page website', 'Basic animations and integrations', 'Advanced SEO']
      },
      {
        title: 'Pro Plan',
        price: '3,000+',
        features: ['Advanced 3D animations and effects', 'Custom integrations', 'E-commerce functionality']
      }
    ];
  }

  // Graphic Design Service (Added another monthly plan)
  else if (service === 'graphic-design') {
    pricingData = [
      {
        title: 'Basic Plan',
        price: '50-150',
        features: ['4 unique design concepts, each adapted to various social media sizes', 'Includes logos, social media posts, or flyers', 'Custom branding and color schemes']
      },
      {
        title: 'Standard Plan',
        price: '300-500',
        features: ['Complete branding package (logo, business card, letterhead)', '6 unique design concepts, each adapted to various social media sizes', '3 revisions']
      },
      {
        title: 'Premium Plan',
        price: '800-1,500',
        features: ['Full-scale campaigns (social, print, and digital designs)', '8 unique design concepts, each adapted to various social media sizes', '8 revisions']
      },
      {
        title: 'Monthly Subscription',
        price: '800/month',
        features: ['15 social media post designs', 'Up to 8 revisions per month', 'Custom branding for consistency across all designs', 'Priority support and fast turnaround times']
      },
      {
        title: 'Elite Branding Subscription',
        price: '1,500/month',
        features: ['20 premium branding & ad designs', 'Fast turnaround', 'Direct collaboration with designers', 'Monthly strategy meetings']
      }
    ];
  }

  // 3D Art Service (Added another monthly plan)
  else if (service === '3d-art') {
    pricingData = [
      {
        title: 'Simple Package',
        price: '300-500',
        features: ['Single object or product modeling', 'Basic textures']
      },
      {
        title: 'Detailed Package',
        price: '700-1,200',
        features: ['Environment design or detailed character modeling', 'High-quality rendering']
      },
      {
        title: 'High-End Package',
        price: '2,000+',
        features: ['Full 3D animations or complex scenes', 'Custom textures and advanced lighting']
      },
      {
        title: '3D Monthly Subscription',
        price: '1,000/month',
        features: ['4 custom 3D assets per month', 'Full high-quality rendering', 'Texturing & lighting included']
      },
      {
        title: 'Advanced 3D Monthly Subscription',
        price: '2,500/month',
        features: ['Unlimited 3D models & animations', 'Game-ready assets', 'Realistic character modeling', 'Custom scene environments']
      }
    ];
  }

  else if (service === 'digital-marketing') {
    pricingData = [
      {
        title: 'Starter Marketing Plan',
        price: '500/month',
        features: ['Social media management', 'Basic SEO optimization', 'Content creation (5 posts/month)']
      },
      {
        title: 'Growth Marketing Plan',
        price: '1,200/month',
        features: ['Social media & paid ad campaigns', 'Advanced SEO strategy', 'Content creation (10 posts/month)', 'Monthly performance reports']
      },
      {
        title: 'Enterprise Marketing Plan',
        price: '2,500/month',
        features: ['Complete digital marketing solution', 'SEO, PPC, and social media advertising', 'Content strategy & lead generation', 'Dedicated account manager']
      }
    ];
  }

  const discounts = await Discount.find({ service });

  // Apply discounts
  pricingData = pricingData.map(plan => {
    const discount = discounts.find(d => d.plan === plan.title && d.status === "active"); // Only apply active discounts
    if (discount) {
        const discountAmount = (parseFloat(plan.price.split('-')[0]) * discount.discountPercentage) / 100;
        const discountedPrice = parseFloat(plan.price.split('-')[0]) - discountAmount;
        plan.discountedPrice = discountedPrice.toFixed(2);
        plan.discountPercentage = discount.discountPercentage;
        plan.discountDescription = discount.description || ""; // Include the description
        plan.hasActiveDiscount = true; // Flag to indicate active discount
    } else {
        plan.hasActiveDiscount = false; // No active discount
    }
    return plan;
});

  res.json(pricingData);
}));


  

module.exports = router;