// Mock location-to-climate mapping for demo purposes
export type ClimateType = 'hot-humid' | 'dry-hot' | 'cold-dry' | 'moderate' | 'high-pollution';

export interface ClimateInfo {
  type: ClimateType;
  label: string;
  temperature: string;
  humidity: string;
  pollution: 'Low' | 'Moderate' | 'High';
  skinStressors: string[];
  hairStressors: string[];
  recommendations: {
    skincare: string[];
    haircare: string[];
  };
}

export interface NearbySupport {
  id: string;
  name: string;
  type: 'clinic' | 'pharmacy';
  area: string;
  contact: string;
  specialization?: string;
}

// Mock climate data based on location keywords
const climateMapping: Record<string, ClimateInfo> = {
  'hot-humid': {
    type: 'hot-humid',
    label: 'Hot & Humid',
    temperature: '28-38°C',
    humidity: '70-90%',
    pollution: 'Moderate',
    skinStressors: ['Excess sebum production', 'Clogged pores', 'Fungal acne risk', 'Sweat-related breakouts'],
    hairStressors: ['Frizz', 'Oily scalp', 'Fungal infections', 'Limp hair'],
    recommendations: {
      skincare: ['Lightweight gel moisturizers', 'Salicylic acid cleansers', 'Oil-free SPF', 'Niacinamide serums'],
      haircare: ['Clarifying shampoos weekly', 'Anti-humidity serums', 'Lightweight conditioners', 'Scalp exfoliation'],
    },
  },
  'dry-hot': {
    type: 'dry-hot',
    label: 'Dry & Hot',
    temperature: '30-45°C',
    humidity: '20-40%',
    pollution: 'High',
    skinStressors: ['Dehydration', 'Sun damage', 'Premature aging', 'Dust accumulation'],
    hairStressors: ['Dryness', 'Brittle ends', 'Scalp flaking', 'Color fading'],
    recommendations: {
      skincare: ['Hydrating toners', 'Hyaluronic acid', 'Rich SPF 50+', 'Overnight masks'],
      haircare: ['Deep conditioning masks', 'Leave-in conditioners', 'UV protection sprays', 'Oil treatments'],
    },
  },
  'cold-dry': {
    type: 'cold-dry',
    label: 'Cold & Dry',
    temperature: '0-15°C',
    humidity: '30-50%',
    pollution: 'Low',
    skinStressors: ['Cracking', 'Redness', 'Sensitivity', 'Barrier damage'],
    hairStressors: ['Static', 'Breakage', 'Dry scalp', 'Dullness'],
    recommendations: {
      skincare: ['Ceramide creams', 'Gentle cleansers', 'Facial oils', 'Barrier repair products'],
      haircare: ['Moisturizing shampoos', 'Anti-static sprays', 'Argan oil', 'Protective styling'],
    },
  },
  'moderate': {
    type: 'moderate',
    label: 'Moderate / Mixed',
    temperature: '18-28°C',
    humidity: '50-65%',
    pollution: 'Low',
    skinStressors: ['Seasonal transitions', 'Variable hydration needs', 'Occasional sensitivity'],
    hairStressors: ['Seasonal shedding', 'Occasional frizz', 'Varying scalp conditions'],
    recommendations: {
      skincare: ['Balanced moisturizers', 'Vitamin C serums', 'Regular SPF', 'Weekly exfoliation'],
      haircare: ['Balanced shampoos', 'Regular conditioning', 'Occasional masks', 'Minimal heat'],
    },
  },
  'high-pollution': {
    type: 'high-pollution',
    label: 'High Pollution Exposure',
    temperature: '20-35°C',
    humidity: '50-70%',
    pollution: 'High',
    skinStressors: ['Free radical damage', 'Dull complexion', 'Clogged pores', 'Accelerated aging'],
    hairStressors: ['Product buildup', 'Dullness', 'Weakened strands', 'Scalp irritation'],
    recommendations: {
      skincare: ['Antioxidant serums', 'Double cleansing', 'Pollution shields', 'Detox masks'],
      haircare: ['Chelating shampoos', 'Scalp detox treatments', 'Protective leave-ins', 'Weekly clarifying'],
    },
  },
};

// City to climate mapping (demo data)
const cityClimateMap: Record<string, ClimateType> = {
  // India - Hot & Humid
  'mumbai': 'hot-humid',
  'chennai': 'hot-humid',
  'kolkata': 'hot-humid',
  'goa': 'hot-humid',
  'kochi': 'hot-humid',
  'mangalore': 'hot-humid',
  
  // India - Dry & Hot
  'jaipur': 'dry-hot',
  'jodhpur': 'dry-hot',
  'udaipur': 'dry-hot',
  'ahmedabad': 'dry-hot',
  'hyderabad': 'dry-hot',
  'nagpur': 'dry-hot',
  
  // India - High Pollution
  'delhi': 'high-pollution',
  'new delhi': 'high-pollution',
  'noida': 'high-pollution',
  'gurgaon': 'high-pollution',
  'gurugram': 'high-pollution',
  'lucknow': 'high-pollution',
  'kanpur': 'high-pollution',
  
  // India - Cold & Dry
  'shimla': 'cold-dry',
  'manali': 'cold-dry',
  'srinagar': 'cold-dry',
  'leh': 'cold-dry',
  'darjeeling': 'cold-dry',
  'mussoorie': 'cold-dry',
  
  // India - Moderate
  'bangalore': 'moderate',
  'bengaluru': 'moderate',
  'pune': 'moderate',
  'mysore': 'moderate',
  'coorg': 'moderate',
  
  // International
  'dubai': 'dry-hot',
  'singapore': 'hot-humid',
  'london': 'cold-dry',
  'new york': 'moderate',
  'los angeles': 'dry-hot',
  'tokyo': 'moderate',
  'beijing': 'high-pollution',
  'sydney': 'moderate',
};

export const getClimateForLocation = (location: string): ClimateInfo => {
  const normalizedLocation = location.toLowerCase().trim();
  
  // Check for exact or partial match
  for (const [city, climateType] of Object.entries(cityClimateMap)) {
    if (normalizedLocation.includes(city) || city.includes(normalizedLocation)) {
      return climateMapping[climateType];
    }
  }
  
  // Default to moderate if no match
  return climateMapping['moderate'];
};

// Mock nearby support data based on location
export const getNearbySupport = (location: string): NearbySupport[] => {
  const normalizedLocation = location.toLowerCase().trim();
  
  // Generate mock data based on location
  const baseData: NearbySupport[] = [
    {
      id: '1',
      name: 'Dr. Sharma Skin Clinic',
      type: 'clinic',
      area: `${location} Central`,
      contact: '+91 98XXX XXXXX',
      specialization: 'Dermatology & Cosmetology',
    },
    {
      id: '2',
      name: 'Advanced Derma Care',
      type: 'clinic',
      area: `${location} East`,
      contact: '+91 99XXX XXXXX',
      specialization: 'Hair & Scalp Treatment',
    },
    {
      id: '3',
      name: 'MediPlus Pharmacy',
      type: 'pharmacy',
      area: `${location} Main Road`,
      contact: '+91 97XXX XXXXX',
    },
    {
      id: '4',
      name: 'HealthFirst Skincare Store',
      type: 'pharmacy',
      area: `${location} Market`,
      contact: '+91 96XXX XXXXX',
    },
  ];
  
  return baseData;
};

// Get location-specific recommendation adjustments
export const getLocationAdjustments = (climate: ClimateInfo) => {
  return {
    skincare: {
      morning: climate.type === 'dry-hot' || climate.type === 'high-pollution' 
        ? 'Start with antioxidant-rich products to combat environmental stress'
        : climate.type === 'hot-humid'
        ? 'Use lightweight, non-comedogenic products to prevent pore clogging'
        : 'Focus on hydration and barrier maintenance',
      evening: climate.type === 'high-pollution'
        ? 'Double cleanse to remove pollutants and daily buildup'
        : climate.type === 'dry-hot'
        ? 'Apply rich overnight masks for deep hydration'
        : 'Gentle cleansing followed by repair treatments',
      weekly: climate.recommendations.skincare.join(', '),
    },
    haircare: {
      wash: climate.type === 'hot-humid'
        ? 'Wash more frequently (every 2 days) to prevent oil buildup'
        : climate.type === 'cold-dry'
        ? 'Reduce wash frequency to preserve natural oils'
        : 'Wash 2-3 times weekly based on activity level',
      treatment: climate.recommendations.haircare.join(', '),
    },
  };
};
