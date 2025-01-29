const express = require('express');
const router = express.Router();

router.get('/pricing', (req, res) => {
    res.render('Pricing/Pricing', { currentRoute: '/pricing', service: null });

})



// GET pricing data based on service
router.get('/get-pricing', (req, res) => {
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
          features: ['Color grading and advanced effects', 'Motion graphics', 'Videos up to 10 minutes', '2 revisions']
        },
        {
          title: 'Premium Package',
          price: '800-1,500',
          features: ['Full production editing', 'Custom animations and sound design', 'Videos up to 20 minutes', 'Unlimited revisions']
        },
        {
          title: 'Short Form Videos (Monthly)',
          price: '950/month',
          features: ['16 short-form video edits (e.g., social media clips, reels, etc.)', 'Full production editing', 'Custom animations and sound design', 'Maximum 1 minute and 30 seconds per video']
        }
      ];
    }
    // Web Development Service
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
    // Graphic Design Service
    else if (service === 'graphic-design') {
        pricingData = [
          {
            title: 'Basic Plan',
            price: '50-150',
            features: [
              '2 designs with all sizes of social media posts',
              'Logos, social media posts, or flyers',
              'Custom branding and color schemes',
              'Up to 2 revisions per design'
            ]
          },
          {
            title: 'Standard Plan',
            price: '300-500',
            features: [
              'Branding package (logo, business card, letterhead)',
              'Custom color schemes and typography',
              '4 designs with all sizes of social media posts',
              '3 revisions'
            ]
          },
          {
            title: 'Premium Plan',
            price: '800-1,500',
            features: [
              'Full-scale campaigns (social, print, and digital designs)',
              'Detailed market research and design strategy',
              '6 designs with all sizes of social media posts',
              'Unlimited revisions'
            ]
          }
        ];
      }
    // 3D Art Service
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
        }
      ];
    }
  
    res.json(pricingData);
  });
  

module.exports = router;