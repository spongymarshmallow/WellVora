export const motivationalQuotes = {
  onTrack: [
    "You're crushing it! Every healthy choice compounds into amazing results. 💪",
    "Consistency is your superpower. Keep going, you're on the right path! 🌟",
    "Your future self is thanking you for the effort you're putting in today. 🙌",
    "Small steps lead to big transformations. You're doing amazing! ✨",
    "Success is the sum of small efforts repeated day in and day out. Keep it up! 🔥",
    "You're not just building habits, you're building a better version of yourself! 💫",
    "Progress, not perfection. And you're making great progress! 🎯",
    "Your dedication is inspiring! Stay focused, stay strong! 💚",
    "Champions are made when no one is watching. You're a champion! 🏆",
    "Every day you're one step closer to your goals. Amazing work! 🌈",
  ],
  needsImprovement: [
    "Every day is a new opportunity to make better choices. You've got this! 🌅",
    "It's not about being perfect, it's about making progress. Start fresh today! 💪",
    "Remember why you started. Your goals are still within reach! 🎯",
    "Challenges are what make life interesting. Overcoming them is what makes life meaningful. 💫",
    "One meal, one workout, one choice at a time. You can do this! ✨",
    "The only bad workout is the one that didn't happen. Tomorrow is your day! 🌟",
    "Self-care isn't selfish, it's necessary. Let's get back on track! 💚",
    "Your potential is endless. Today is a fresh start! 🔥",
    "Progress is progress, no matter how small. Keep pushing forward! 🙌",
    "Believe in yourself. You're stronger than you think! 💪",
  ],
  hydration: [
    "Water is life! Stay hydrated, stay energized! 💧",
    "Your skin, hair, and body will thank you for drinking enough water! 🌊",
    "Hydration is the secret ingredient to glowing health! ✨",
  ],
  diet: [
    "Fuel your body with goodness! Every nutritious meal is an investment in your health. 🥗",
    "Eating well is a form of self-respect. You're doing great! 🍎",
    "Balanced nutrition = balanced life. Keep making healthy choices! 🥑",
  ],
  workout: [
    "Your body can do anything, it's your mind you need to convince! 💪",
    "Sweat is just fat crying. Keep moving! 🏃",
    "The only workout you'll regret is the one you didn't do! 🔥",
  ],
  skincare: [
    "Glow from within, shine on the outside! Your skincare routine is working! ✨",
    "Consistency is the key to great skin. Keep it up! 🌟",
    "Self-care Sunday, Monday, Tuesday... every day! 💆",
  ],
  haircare: [
    "Great hair doesn't happen by chance, it happens by appointment with your routine! 💇",
    "Your hair is your crown, never let it fall! 👑",
    "Healthy hair is happy hair! Keep nurturing those locks! ✨",
  ],
};

export const getRandomQuote = (category: keyof typeof motivationalQuotes): string => {
  const quotes = motivationalQuotes[category];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const getQuoteByProgress = (caloriesConsumed: number, targetCalories: number, waterIntake: number, targetWater: number): string => {
  const caloriePercentage = (caloriesConsumed / targetCalories) * 100;
  const waterPercentage = (waterIntake / targetWater) * 100;
  const averageProgress = (caloriePercentage + waterPercentage) / 2;
  
  if (averageProgress >= 80 && averageProgress <= 120) {
    return getRandomQuote('onTrack');
  } else {
    return getRandomQuote('needsImprovement');
  }
};
