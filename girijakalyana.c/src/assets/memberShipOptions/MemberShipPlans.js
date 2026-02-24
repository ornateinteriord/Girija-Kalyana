// MemberShipPlans.js
// ============================================================
// CENTRALIZED PRICING CONFIGURATION
// Update prices here and they will reflect everywhere in the app
// ============================================================

// Pricing configuration (in INR) - Change values here to update everywhere
export const PLAN_PRICES = {
  SILVER: {
    originalPrice: 2399.60,
    discountedPrice: 599,
    discountPercent: 70,
  },
  PREMIUM: {
    originalPrice: 2399.60,
    discountedPrice: 999,
    discountPercent: 60,
  },
};

// Promocode discount amount (in INR)
export const PROMOCODE_DISCOUNT = 100;

// Helper function to format price with currency symbol
export const formatPrice = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

// Helper function to get numeric price from plan name
export const getPlanPrice = (planName) => {
  if (planName.includes('PREMIUM')) {
    return PLAN_PRICES.PREMIUM.discountedPrice;
  }
  return PLAN_PRICES.SILVER.discountedPrice;
};

// Membership options with all display information
export const membershipOptions = [
  {
    name: 'SILVER MEMBERSHIP',
    planType: 'silver',
    userRole: 'SilverUser',
    // Numeric values for calculations
    originalPriceNum: PLAN_PRICES.SILVER.originalPrice,
    discountedPriceNum: PLAN_PRICES.SILVER.discountedPrice,
    discountPercent: PLAN_PRICES.SILVER.discountPercent,
    // Display strings for UI
    originalPrice: formatPrice(PLAN_PRICES.SILVER.originalPrice),
    discountedPrice: formatPrice(PLAN_PRICES.SILVER.discountedPrice),
    discount: `Save ${PLAN_PRICES.SILVER.discountPercent}%`,
    duration: '6 MONTHS',
    features: [
      'View Profile Details',
      'Contact Details on request',
      'Photo Privacy Settings',
      'Express Interest',
      'Share Your Profile Details',
      'Mobile Application Access'
    ],
    color: '#6a5acd',
    gradient: 'linear-gradient(135deg, #6a5acd 0%, #9370db 100%)'
  },
  {
    name: 'PREMIUM MEMBERSHIP',
    planType: 'premium',
    userRole: 'PremiumUser',
    // Numeric values for calculations
    originalPriceNum: PLAN_PRICES.PREMIUM.originalPrice,
    discountedPriceNum: PLAN_PRICES.PREMIUM.discountedPrice,
    discountPercent: PLAN_PRICES.PREMIUM.discountPercent,
    // Display strings for UI
    originalPrice: formatPrice(PLAN_PRICES.PREMIUM.originalPrice),
    discountedPrice: formatPrice(PLAN_PRICES.PREMIUM.discountedPrice),
    discount: `Save ${PLAN_PRICES.PREMIUM.discountPercent}%`,
    duration: '1 YEAR',
    features: [
      'All Silver Features',
      'Priority Customer Support',
      'Featured Profile Listing',
      'Advanced Match Filters',
      'Unlimited Interests',
      'Profile Boost Monthly'
    ],
    color: '#ff6b6b',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)'
  }
];
