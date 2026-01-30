import { UserProfile, Recommendation } from '@/types/user';

const skincareImages = [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80',
];

const haircareImages = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&q=80',
  'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&q=80',
];

const workoutImages = [
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=400&q=80',
];

const dietImages = [
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80',
];

export const generateSkincareRecommendations = (profile: UserProfile): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const goals = profile.skinGoals.toLowerCase();
  const skinType = profile.skinType.toLowerCase();
  const allergies = profile.allergies.toLowerCase();

  // Acne/Pimple related
  if (goals.includes('acne') || goals.includes('pimple') || goals.includes('breakout')) {
    recommendations.push({
      id: 'skin-1',
      title: 'Acne Control & Prevention',
      description: `Based on your ${skinType} skin type and concern about acne, here's a comprehensive approach tailored for you.`,
      whyItFits: `Your ${skinType} skin combined with acne concerns requires a balanced approach. ${profile.activityLevel === 'high' ? 'Your active lifestyle means more sweat, which can clog pores.' : ''} We've considered your budget of ${profile.budget} and preference for ${profile.solutionPreference} solutions.`,
      ingredients: {
        prefer: ['Niacinamide (Vitamin B3)', 'Salicylic Acid (BHA)', 'Tea Tree Oil', 'Green Tea Extract', 'Zinc', 'Benzoyl Peroxide (2.5-5%)'],
        avoid: allergies ? allergies.split(',').map(a => a.trim()) : ['Heavy mineral oils', 'Coconut oil on face', 'Sodium Lauryl Sulfate'],
      },
      naturalSolution: {
        title: 'Herbal & Ayurvedic Approach',
        description: 'Use neem face wash twice daily, apply turmeric and honey mask weekly, drink spearmint tea (helps hormonal acne). Apply aloe vera gel as moisturizer. Use rose water as toner.',
        timeline: '6-10 weeks for visible improvement',
        cost: '₹200-500/month',
      },
      chemicalSolution: {
        title: 'Dermatological Actives',
        description: 'Morning: Salicylic acid cleanser + Niacinamide serum (10%) + Oil-free moisturizer + SPF 50. Night: Gentle cleanser + Benzoyl peroxide (2.5%) spot treatment + Retinol (start 0.25%).',
        timeline: '4-6 weeks for noticeable results',
        cost: '₹800-2000/month',
      },
      budgetNote: profile.budget.includes('500') ? 'Start with pharmacy brands like Minimalist, Dermaco for affordable actives.' : 'You can explore premium brands like Paula\'s Choice, The Ordinary for clinical-grade formulations.',
      timeline: 'Initial improvements in 4-6 weeks, significant clearing in 8-12 weeks with consistent use',
      image: skincareImages[0],
    });
  }

  // Pigmentation/Dark spots
  if (goals.includes('pigment') || goals.includes('dark spot') || goals.includes('uneven') || goals.includes('glow') || goals.includes('bright')) {
    recommendations.push({
      id: 'skin-2',
      title: 'Brightening & Pigmentation Control',
      description: `Targeting your concern for even-toned, radiant skin with solutions suited for your ${skinType} skin type.`,
      whyItFits: `Indian skin tones are prone to post-inflammatory hyperpigmentation. Your ${profile.activityLevel} activity level affects sun exposure. These recommendations work within your ${profile.budget} budget.`,
      ingredients: {
        prefer: ['Vitamin C (L-Ascorbic Acid 10-20%)', 'Alpha Arbutin', 'Kojic Acid', 'Licorice Extract', 'Tranexamic Acid', 'Azelaic Acid'],
        avoid: [...(allergies ? allergies.split(',').map(a => a.trim()) : []), 'Hydroquinone without prescription', 'Harsh physical scrubs'],
      },
      naturalSolution: {
        title: 'Traditional Brightening',
        description: 'Apply potato juice or cucumber juice daily for 15 mins. Use gram flour (besan) + turmeric + milk mask twice weekly. Massage with kumkumadi oil at night. Drink amla juice daily for Vitamin C.',
        timeline: '8-12 weeks for visible lightening',
        cost: '₹150-400/month',
      },
      chemicalSolution: {
        title: 'Clinical Brightening Protocol',
        description: 'Morning: Vitamin C serum (15-20%) + Sunscreen SPF 50 PA++++. Night: Alpha Arbutin serum + Niacinamide. Weekly: AHA (Glycolic/Lactic acid) exfoliation. Consider Tranexamic acid for stubborn spots.',
        timeline: '6-8 weeks for noticeable brightening',
        cost: '₹1200-3000/month',
      },
      budgetNote: profile.budget.includes('500') ? 'Minimalist, Dot & Key offer affordable Vitamin C and Alpha Arbutin serums.' : 'Paula\'s Choice, Skinceuticals offer research-backed premium options.',
      timeline: 'First improvements visible in 4-6 weeks, significant results in 10-16 weeks',
      image: skincareImages[1],
    });
  }

  // Dryness/Hydration
  if (goals.includes('dry') || goals.includes('hydrat') || goals.includes('moisture') || skinType.includes('dry')) {
    recommendations.push({
      id: 'skin-3',
      title: 'Deep Hydration & Barrier Repair',
      description: `Addressing your dry skin concerns with intensive hydration strategies perfect for your skin type and climate.`,
      whyItFits: `Dry skin needs consistent hydration and barrier support. Your ${profile.activityLevel} activity level and ${profile.gender} hormonal factors influence skin's moisture retention.`,
      ingredients: {
        prefer: ['Hyaluronic Acid', 'Ceramides', 'Squalane', 'Glycerin', 'Shea Butter', 'Niacinamide'],
        avoid: [...(allergies ? allergies.split(',').map(a => a.trim()) : []), 'Alcohol-based toners', 'Harsh sulfate cleansers', 'Over-exfoliation'],
      },
      naturalSolution: {
        title: 'Ayurvedic Hydration',
        description: 'Apply raw honey + milk mask for 20 mins thrice weekly. Massage with sesame or almond oil before bath. Use rose water mist throughout day. Drink warm water with ghee on empty stomach.',
        timeline: '2-4 weeks for improved hydration',
        cost: '₹200-500/month',
      },
      chemicalSolution: {
        title: 'Scientific Hydration Stack',
        description: 'Cream cleanser + Hyaluronic acid serum (apply on damp skin) + Ceramide-rich moisturizer + Facial oil (squalane/rosehip). Weekly: Hydrating sheet masks. Use humidifier at night.',
        timeline: '1-3 weeks for plumper, hydrated skin',
        cost: '₹800-1800/month',
      },
      budgetNote: 'Hydration doesn\'t have to be expensive - glycerin and petroleum jelly are dermatologist-approved affordable options.',
      timeline: 'Immediate relief within days, lasting improvement in 3-4 weeks',
      image: skincareImages[2],
    });
  }

  // Default recommendation if no specific goals
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'skin-default',
      title: 'Complete Skincare Routine',
      description: `A balanced skincare routine customized for your ${skinType} skin type.`,
      whyItFits: `Based on your ${profile.gender} skin characteristics, ${profile.ageRange} age range, and ${profile.activityLevel} lifestyle, this routine covers all basics.`,
      ingredients: {
        prefer: ['Gentle cleanser', 'Niacinamide', 'Hyaluronic Acid', 'SPF 50', 'Moisturizer with ceramides'],
        avoid: allergies ? allergies.split(',').map(a => a.trim()) : ['Fragrance', 'Harsh sulfates'],
      },
      naturalSolution: {
        title: 'Minimal Natural Routine',
        description: 'Cleanse with gram flour paste, tone with rose water, moisturize with aloe vera gel mixed with few drops of jojoba oil. Use multani mitti mask weekly.',
        timeline: '4-6 weeks for healthier skin',
        cost: '₹150-350/month',
      },
      chemicalSolution: {
        title: 'Essential Actives Routine',
        description: 'AM: Gentle cleanser + Niacinamide + Moisturizer + Sunscreen. PM: Double cleanse + Hyaluronic acid + Night cream. Weekly: Gentle AHA exfoliation.',
        timeline: '3-5 weeks for visible improvement',
        cost: '₹600-1500/month',
      },
      budgetNote: 'Start with basics - a good sunscreen is the most important anti-aging investment.',
      timeline: 'Consistent improvement over 4-8 weeks',
      image: skincareImages[0],
    });
  }

  return recommendations;
};

export const generateHaircareRecommendations = (profile: UserProfile): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const goals = profile.hairGoals.toLowerCase();
  const hairType = profile.hairType.toLowerCase();
  const allergies = profile.allergies.toLowerCase();

  // Hair fall/Loss
  if (goals.includes('fall') || goals.includes('loss') || goals.includes('thin') || goals.includes('bald')) {
    recommendations.push({
      id: 'hair-1',
      title: 'Hair Fall Control & Strengthening',
      description: `Comprehensive approach to reduce hair fall and strengthen your ${hairType} hair from roots to tips.`,
      whyItFits: `${profile.gender === 'female' ? 'Female pattern hair loss often responds well to topical treatments and nutrition.' : 'Male pattern hair loss benefits from DHT blockers and minoxidil.'} Your ${profile.activityLevel} activity level affects scalp health. Budget: ${profile.budget}`,
      ingredients: {
        prefer: ['Biotin', 'Saw Palmetto', 'Caffeine', 'Redensyl', 'Procapil', 'Onion extract', 'Bhringraj'],
        avoid: [...(allergies ? allergies.split(',').map(a => a.trim()) : []), 'Sulfates', 'Parabens', 'Silicones that cause buildup'],
      },
      naturalSolution: {
        title: 'Ayurvedic Hair Therapy',
        description: 'Weekly hot oil massage with bhringraj + coconut oil. Apply onion juice to scalp 1 hour before wash. Use shikakai + reetha for cleansing. Take ashwagandha supplement for stress-related fall. Curry leaves in coconut oil for grey prevention.',
        timeline: '8-16 weeks for reduced fall, 6 months for regrowth',
        cost: '₹300-700/month',
      },
      chemicalSolution: {
        title: 'Clinical Hair Fall Treatment',
        description: 'Minoxidil 2-5% solution twice daily (consult dermatologist). Ketoconazole shampoo twice weekly. Biotin 10,000mcg supplement. Consider Procapil/Redensyl serums. For severe cases, PRP therapy.',
        timeline: '3-4 months for reduced fall, 6-12 months for regrowth',
        cost: '₹1500-5000/month',
      },
      budgetNote: profile.budget.includes('500') ? 'Start with onion oil and biotin supplements - most cost-effective proven options.' : 'Invest in Minoxidil and professional-grade serums for faster results.',
      timeline: 'Reduced fall in 6-8 weeks, new growth visible in 3-6 months',
      image: haircareImages[0],
    });
  }

  // Dandruff/Scalp issues
  if (goals.includes('dandruff') || goals.includes('itch') || goals.includes('flak') || goals.includes('scalp')) {
    recommendations.push({
      id: 'hair-2',
      title: 'Dandruff & Scalp Health',
      description: `Targeting scalp issues to create the perfect environment for healthy ${hairType} hair growth.`,
      whyItFits: `Dandruff is often caused by Malassezia fungus. Your ${hairType} hair type affects product buildup. These solutions match your ${profile.budget} budget.`,
      ingredients: {
        prefer: ['Ketoconazole', 'Zinc Pyrithione', 'Salicylic Acid', 'Tea Tree Oil', 'Neem', 'Apple Cider Vinegar'],
        avoid: [...(allergies ? allergies.split(',').map(a => a.trim()) : []), 'Heavy oils', 'Thick conditioners on scalp'],
      },
      naturalSolution: {
        title: 'Herbal Scalp Treatment',
        description: 'Apply neem oil + tea tree oil (mixed with carrier oil) to scalp for 30 mins before wash. Rinse with diluted apple cider vinegar after shampoo. Use aloe vera gel on scalp twice weekly. Avoid sugar and dairy temporarily.',
        timeline: '2-4 weeks for significant reduction',
        cost: '₹200-450/month',
      },
      chemicalSolution: {
        title: 'Anti-Fungal Protocol',
        description: 'Ketoconazole 2% shampoo (Nizoral/Sebamed) twice weekly. Zinc pyrithione shampoo on alternate days. Salicylic acid scalp serum for buildup. If severe, consult dermatologist for oral antifungals.',
        timeline: '1-3 weeks for visible improvement',
        cost: '₹400-1200/month',
      },
      budgetNote: 'Ketoconazole shampoos are available at pharmacies for ₹200-400 and are highly effective.',
      timeline: 'Relief within 1-2 weeks, complete control in 4-6 weeks',
      image: haircareImages[1],
    });
  }

  // Frizz/Dryness
  if (goals.includes('frizz') || goals.includes('dry') || goals.includes('damage') || goals.includes('smooth') || goals.includes('shine')) {
    recommendations.push({
      id: 'hair-3',
      title: 'Frizz Control & Deep Conditioning',
      description: `Transform your ${hairType} hair with intensive moisture and smoothing treatments.`,
      whyItFits: `Frizzy hair indicates cuticle damage or porosity issues. Indian climate increases humidity exposure. Your ${profile.activityLevel} lifestyle affects hair exposure to elements.`,
      ingredients: {
        prefer: ['Argan Oil', 'Keratin', 'Shea Butter', 'Silk Proteins', 'Hyaluronic Acid', 'Coconut Oil'],
        avoid: [...(allergies ? allergies.split(',').map(a => a.trim()) : []), 'Alcohol-based products', 'Heat styling without protection', 'Sulfate shampoos'],
      },
      naturalSolution: {
        title: 'Deep Conditioning Ritual',
        description: 'Weekly: Banana + honey + coconut oil hair mask for 45 mins. Use cold water final rinse. Apply rice water rinse fortnightly. Sleep on silk/satin pillowcase. Avoid brushing when dry.',
        timeline: '3-5 weeks for noticeably smoother hair',
        cost: '₹200-500/month',
      },
      chemicalSolution: {
        title: 'Professional Smoothing',
        description: 'Use keratin-infused sulfate-free shampoo. Apply leave-in conditioner with silicones (dimethicone). Use heat protectant always. Monthly deep conditioning treatment. Consider salon keratin treatment for 3-6 month smoothness.',
        timeline: '2-4 weeks for daily smoothness, instant with salon treatment',
        cost: '₹800-2500/month (₹3000-8000 for salon keratin)',
      },
      budgetNote: profile.budget.includes('500') ? 'Homemade hair masks and cold water rinses are very effective for frizz control.' : 'Invest in a quality leave-in conditioner and heat protectant.',
      timeline: 'Immediate improvement with proper technique, lasting results in 4-6 weeks',
      image: haircareImages[2],
    });
  }

  // Default
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'hair-default',
      title: 'Complete Hair Care Routine',
      description: `A balanced routine for maintaining healthy ${hairType} hair.`,
      whyItFits: `Based on your ${hairType} hair type and ${profile.gender} hormonal profile, this routine ensures overall hair health.`,
      ingredients: {
        prefer: ['Gentle sulfate-free shampoo', 'Conditioner', 'Weekly oil treatment', 'Heat protectant'],
        avoid: allergies ? allergies.split(',').map(a => a.trim()) : ['Over-washing', 'Excessive heat'],
      },
      naturalSolution: {
        title: 'Basic Natural Care',
        description: 'Oil massage with coconut/sesame oil twice weekly. Use mild shampoo, condition ends only. Air dry when possible. Trim every 6-8 weeks.',
        timeline: 'Healthier hair in 4-6 weeks',
        cost: '₹150-400/month',
      },
      chemicalSolution: {
        title: 'Essential Hair Products',
        description: 'Sulfate-free shampoo + Silicone conditioner + Heat protectant + Serum for ends. Deep condition weekly.',
        timeline: 'Improved texture in 2-4 weeks',
        cost: '₹500-1500/month',
      },
      budgetNote: 'Quality basics are more important than expensive treatments.',
      timeline: 'Consistent improvement over 4-8 weeks',
      image: haircareImages[0],
    });
  }

  return recommendations;
};

export const generateWorkoutRecommendations = (profile: UserProfile): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const goals = profile.bodyGoals.toLowerCase();
  const bmi = profile.weight / Math.pow(profile.height / 100, 2);

  // Weight loss
  if (goals.includes('weight') || goals.includes('fat') || goals.includes('slim') || goals.includes('lean') || bmi > 25) {
    recommendations.push({
      id: 'workout-1',
      title: 'Fat Loss & Body Recomposition',
      description: `Designed for your ${profile.activityLevel} activity level with focus on sustainable fat loss and muscle preservation.`,
      whyItFits: `Your BMI of ${bmi.toFixed(1)} and goal of fat loss requires a combination of cardio and strength training. ${profile.gender === 'female' ? 'Women benefit greatly from strength training for metabolism.' : 'Men typically respond well to HIIT and progressive overload.'}`,
      ingredients: {
        prefer: ['HIIT workouts', 'Strength training', 'Walking 10,000 steps', 'Compound movements', 'Progressive overload'],
        avoid: ['Crash dieting', 'Only cardio approach', 'Skipping rest days', 'Overtraining'],
      },
      naturalSolution: {
        title: 'Home-Based Fat Loss',
        description: 'Morning: 30-min brisk walk or yoga. Evening: Bodyweight circuit (squats, lunges, push-ups, planks) - 3 rounds. Weekend: Swimming or cycling. Rest 1-2 days per week. Focus on NEAT (daily movement).',
        timeline: '4-8 weeks for visible changes, 12-16 weeks for significant transformation',
        cost: '₹0-500/month (yoga mat, resistance bands)',
      },
      chemicalSolution: {
        title: 'Gym-Based Program',
        description: 'PPL split (Push-Pull-Legs) 5-6 days. Include HIIT 2-3x/week. Track progressive overload. Consider fat burner supplements (consult doctor). Use fitness tracker for accountability.',
        timeline: '3-6 weeks for initial results, 10-14 weeks for major changes',
        cost: '₹1500-5000/month (gym membership + supplements)',
      },
      budgetNote: profile.budget.includes('500') ? 'YouTube workouts and walking are free and highly effective for fat loss.' : 'Gym membership with trainer guidance accelerates results safely.',
      timeline: '0.5-1kg fat loss per week is healthy and sustainable',
      image: workoutImages[0],
    });
  }

  // Muscle building/Strength
  if (goals.includes('muscle') || goals.includes('strength') || goals.includes('bulk') || goals.includes('tone') || goals.includes('fit')) {
    recommendations.push({
      id: 'workout-2',
      title: 'Muscle Building & Strength',
      description: `Build lean muscle mass suited for your ${profile.gender} physiology and ${profile.activityLevel} current fitness level.`,
      whyItFits: `${profile.gender === 'male' ? 'Higher testosterone supports muscle growth - focus on compound lifts.' : 'Women build lean muscle that improves metabolism without bulking.'} Your height (${profile.height}cm) and weight (${profile.weight}kg) determine your protein needs.`,
      ingredients: {
        prefer: ['Progressive overload', 'Compound movements', 'Adequate protein (1.6-2.2g/kg)', 'Rest days', 'Sleep 7-9 hours'],
        avoid: ['Ego lifting', 'Neglecting legs', 'Insufficient protein', 'Overtraining'],
      },
      naturalSolution: {
        title: 'Calisthenics & Bodyweight',
        description: 'Follow a structured program: Pull-ups, dips, push-up variations, pistol squats, muscle-ups progressions. Train 4-5 days. Add resistance bands for progressive overload. Focus on time under tension.',
        timeline: '6-10 weeks for strength gains, 12-20 weeks for visible muscle',
        cost: '₹500-1500/month (pull-up bar, bands, rings)',
      },
      chemicalSolution: {
        title: 'Weight Training Program',
        description: 'PPL or Upper-Lower split 4-6 days. Focus: Squat, Deadlift, Bench, OHP, Rows. Progressive overload weekly. Whey protein post-workout. Creatine 5g daily. Track all lifts.',
        timeline: '4-8 weeks for strength, 8-16 weeks for visible muscle',
        cost: '₹2500-6000/month (gym + supplements)',
      },
      budgetNote: profile.budget.includes('500') ? 'Calisthenics builds impressive physiques for free - see YouTube progressions.' : 'Gym with proper equipment accelerates muscle building significantly.',
      timeline: `Expect 0.5-1kg muscle gain per month naturally. Protein needed: ${Math.round(profile.weight * 1.8)}g/day`,
      image: workoutImages[1],
    });
  }

  // Flexibility/Posture/Energy
  if (goals.includes('flex') || goals.includes('posture') || goals.includes('energy') || goals.includes('stress') || goals.includes('yoga') || goals.includes('back')) {
    recommendations.push({
      id: 'workout-3',
      title: 'Flexibility, Posture & Energy',
      description: `Improve mobility and energy levels with routines suited for your ${profile.activityLevel} lifestyle.`,
      whyItFits: `Modern sedentary work causes posture issues. Your ${profile.ageRange} age group benefits significantly from mobility work. These practices reduce stress and improve sleep.`,
      ingredients: {
        prefer: ['Daily stretching', 'Yoga', 'Foam rolling', 'Breathing exercises', 'Walking', 'Ergonomic setup'],
        avoid: ['Prolonged sitting', 'Skipping warm-ups', 'Ignoring pain signals'],
      },
      naturalSolution: {
        title: 'Yoga & Movement Practice',
        description: 'Morning: 20-min yoga (Surya Namaskar + hip openers). Throughout day: 5-min stretch breaks. Evening: Restorative yoga or meditation. Weekly: Nature walk or swimming. Practice pranayama daily.',
        timeline: '2-4 weeks for energy improvement, 6-12 weeks for flexibility gains',
        cost: '₹0-500/month (yoga mat, blocks)',
      },
      chemicalSolution: {
        title: 'Structured Mobility Program',
        description: 'Follow mobility programs (GOWOD, ROMWOD). Use foam roller and massage gun. Consider physiotherapy for specific issues. Ergonomic workspace setup. Standing desk if possible.',
        timeline: '1-3 weeks for pain relief, 4-8 weeks for lasting improvement',
        cost: '₹1000-4000/month (equipment + classes)',
      },
      budgetNote: 'YouTube has excellent free yoga and mobility content. Start with Yoga With Adriene.',
      timeline: 'Energy improvements within 1-2 weeks, posture changes in 4-8 weeks',
      image: workoutImages[2],
    });
  }

  // Default
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'workout-default',
      title: 'Balanced Fitness Routine',
      description: `A well-rounded program for your ${profile.activityLevel} activity level.`,
      whyItFits: `General fitness improves all aspects of health. Your ${profile.gender} physiology and ${profile.ageRange} age will benefit from this balanced approach.`,
      ingredients: {
        prefer: ['3-4 workout days', 'Mix of cardio and strength', 'Daily walking', 'Adequate sleep'],
        avoid: ['Overtraining', 'Skipping rest', 'Ignoring nutrition'],
      },
      naturalSolution: {
        title: 'Home Fitness',
        description: 'Alternate: Bodyweight strength days and cardio/walking days. Include weekly yoga session. Focus on consistency over intensity.',
        timeline: 'Improved fitness in 4-6 weeks',
        cost: '₹0-500/month',
      },
      chemicalSolution: {
        title: 'Gym Routine',
        description: 'Full body workouts 3x/week with cardio 2x/week. Track progress. Consider basic supplements (multivitamin, omega-3).',
        timeline: 'Visible changes in 4-8 weeks',
        cost: '₹1500-3000/month',
      },
      budgetNote: 'Consistency matters more than fancy equipment.',
      timeline: 'Steady improvement over 8-12 weeks',
      image: workoutImages[0],
    });
  }

  return recommendations;
};

export const generateDietRecommendations = (profile: UserProfile): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const goals = profile.bodyGoals.toLowerCase();
  const skinGoals = profile.skinGoals.toLowerCase();
  const hairGoals = profile.hairGoals.toLowerCase();
  const allergies = profile.allergies.toLowerCase();
  
  // Calculate BMR and calorie needs
  let bmr: number;
  if (profile.gender === 'female') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * 30 - 161; // Assuming average age
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * 30 + 5;
  }
  
  const activityMultiplier = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'high': 1.725,
    'very-high': 1.9,
  };
  
  const multiplier = activityMultiplier[profile.activityLevel as keyof typeof activityMultiplier] || 1.55;
  const tdee = Math.round(bmr * multiplier);
  const hydration = Math.round(profile.weight * 35); // ml per day

  recommendations.push({
    id: 'diet-1',
    title: 'Personalized Nutrition Plan',
    description: `Tailored nutrition for your ${profile.gender} body, ${profile.weight}kg weight, and ${profile.activityLevel} activity level.`,
    whyItFits: `Based on your metrics, you need approximately ${tdee} calories daily for maintenance. For ${goals.includes('weight') || goals.includes('fat') ? 'fat loss, aim for ' + (tdee - 400) + '-' + (tdee - 500) + ' calories' : goals.includes('muscle') || goals.includes('bulk') ? 'muscle gain, aim for ' + (tdee + 200) + '-' + (tdee + 400) + ' calories' : 'maintenance, stick to ' + tdee + ' calories'}.`,
    ingredients: {
      prefer: ['Whole grains', 'Lean proteins', 'Vegetables', 'Healthy fats', 'Fruits', 'Legumes'],
      avoid: allergies ? allergies.split(',').map(a => a.trim()) : ['Processed foods', 'Excess sugar', 'Trans fats'],
    },
    naturalSolution: {
      title: 'Traditional Indian Diet',
      description: `Start day with warm water + lemon. Breakfast: Poha/Upma/Idli with sambar. Lunch: Roti + sabzi + dal + salad + curd. Snacks: Fruits, nuts, makhana. Dinner: Light - khichdi or soup with roti. Minimum ${hydration}ml water daily.`,
      timeline: 'Energy improvements in 1-2 weeks, body composition changes in 6-8 weeks',
      cost: '₹3000-6000/month groceries',
    },
    chemicalSolution: {
      title: 'Optimized Macro Nutrition',
      description: `Protein: ${Math.round(profile.weight * 1.8)}g (eggs, chicken, whey). Carbs: ${Math.round((tdee * 0.4) / 4)}g (oats, rice, sweet potato). Fats: ${Math.round((tdee * 0.25) / 9)}g (nuts, olive oil, ghee). Track with MyFitnessPal. Consider: Omega-3, Vitamin D, Multivitamin.`,
      timeline: 'Rapid changes when combined with exercise, 4-8 weeks for visible results',
      cost: '₹5000-12000/month (quality food + supplements)',
    },
    budgetNote: profile.budget.includes('500') ? 'Dal, eggs, seasonal vegetables, and milk provide complete nutrition affordably.' : 'Invest in quality protein sources and fresh produce for optimal results.',
    timeline: `Daily needs: ${tdee} kcal (maintenance) | ${hydration}ml water | ${Math.round(profile.weight * 1.6)}g protein minimum`,
    image: dietImages[0],
  });

  // Skin-focused nutrition
  if (skinGoals.includes('acne') || skinGoals.includes('glow') || skinGoals.includes('clear')) {
    recommendations.push({
      id: 'diet-2',
      title: 'Skin-Boosting Nutrition',
      description: 'Foods that promote clear, glowing skin from within.',
      whyItFits: `Skin health is 80% internal. Your ${skinGoals} goals are directly influenced by diet. Gut health = skin health.`,
      ingredients: {
        prefer: ['Omega-3 rich fish/seeds', 'Colorful vegetables', 'Berries', 'Green tea', 'Probiotics', 'Vitamin C foods'],
        avoid: [...(allergies ? allergies.split(',').map(a => a.trim()) : []), 'Dairy (if acne-prone)', 'High-glycemic foods', 'Processed sugar'],
      },
      naturalSolution: {
        title: 'Ayurvedic Skin Diet',
        description: 'Daily: Warm water with turmeric, amla juice, green vegetables, soaked almonds. Weekly: Aloe vera juice, neem water. Avoid: Fried foods, excess dairy, white sugar. Include probiotic foods like homemade curd, kanji.',
        timeline: '4-6 weeks for clearer skin',
        cost: '₹500-1000/month additional',
      },
      chemicalSolution: {
        title: 'Targeted Skin Supplements',
        description: 'Omega-3 (1000mg), Zinc (30mg), Vitamin C (500mg), Probiotics, Vitamin E. Consider collagen peptides. Drink spearmint tea for hormonal acne.',
        timeline: '3-6 weeks for noticeable improvement',
        cost: '₹1500-3000/month supplements',
      },
      budgetNote: 'Seasonal fruits, vegetables, and homemade curd are the most affordable skin foods.',
      timeline: 'Internal changes show on skin in 4-8 weeks consistently',
      image: dietImages[1],
    });
  }

  // Hair-focused nutrition
  if (hairGoals.includes('fall') || hairGoals.includes('growth') || hairGoals.includes('thick')) {
    recommendations.push({
      id: 'diet-3',
      title: 'Hair Growth Nutrition',
      description: 'Essential nutrients for strong, healthy hair growth.',
      whyItFits: `Hair is made of protein and requires specific nutrients. Your ${hairGoals} goals need nutritional support alongside topical treatments.`,
      ingredients: {
        prefer: ['Protein-rich foods', 'Iron sources', 'Biotin foods', 'Zinc', 'Omega-3', 'Vitamin D'],
        avoid: [...(allergies ? allergies.split(',').map(a => a.trim()) : []), 'Crash diets', 'Low protein intake', 'Excess vitamin A'],
      },
      naturalSolution: {
        title: 'Traditional Hair Foods',
        description: 'Daily: Soaked almonds, walnuts, flaxseeds, eggs, spinach, curry leaves. Weekly: Liver (if non-veg), amla, black sesame seeds. Drink warm water. Include coconut in diet.',
        timeline: '8-12 weeks for reduced fall, 4-6 months for growth',
        cost: '₹800-1500/month additional',
      },
      chemicalSolution: {
        title: 'Hair Supplement Stack',
        description: 'Biotin (10,000mcg), Iron (if deficient - get tested), Zinc (30mg), Omega-3, Vitamin D (2000IU if low). Consider collagen and DHT blockers.',
        timeline: '6-10 weeks for reduced fall, 3-6 months for regrowth',
        cost: '₹1500-4000/month supplements',
      },
      budgetNote: 'Eggs, leafy greens, and locally available nuts provide essential hair nutrients affordably.',
      timeline: 'Hair cycle is 3-6 months - be patient with nutritional changes',
      image: dietImages[2],
    });
  }

  return recommendations;
};

export const calculateDailyNeeds = (profile: UserProfile) => {
  let bmr: number;
  if (profile.gender === 'female') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * 30 - 161;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * 30 + 5;
  }
  
  const activityMultiplier = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'high': 1.725,
    'very-high': 1.9,
  };
  
  const multiplier = activityMultiplier[profile.activityLevel as keyof typeof activityMultiplier] || 1.55;
  const calories = Math.round(bmr * multiplier);
  const hydration = Math.round(profile.weight * 35);
  const protein = Math.round(profile.weight * 1.6);

  return { calories, hydration, protein };
};
