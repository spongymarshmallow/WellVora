import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Leaf, FlaskConical, Clock, IndianRupee, Check, X, MapPin } from 'lucide-react';
import { Recommendation, LocationData } from '@/types/user';

interface RecommendationCardProps {
  recommendation: Recommendation;
  category: 'skincare' | 'haircare' | 'workout' | 'diet';
  preferredSolution?: 'natural' | 'chemical' | 'mixed';
  locationData?: LocationData | null;
}

const categoryStyles = {
  skincare: {
    border: 'glow-border-skincare',
    accent: 'text-skincare',
    bg: 'bg-skincare/10',
  },
  haircare: {
    border: 'glow-border-haircare',
    accent: 'text-haircare',
    bg: 'bg-haircare/10',
  },
  workout: {
    border: 'glow-border-workout',
    accent: 'text-workout',
    bg: 'bg-workout/10',
  },
  diet: {
    border: 'glow-border-diet',
    accent: 'text-diet',
    bg: 'bg-diet/10',
  },
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  category, 
  preferredSolution = 'mixed',
  locationData 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const styles = categoryStyles[category];
  
  const isNaturalPreferred = preferredSolution === 'natural';
  const isChemicalPreferred = preferredSolution === 'chemical';

  // Generate location-specific advice based on climate
  const getLocationAdvice = () => {
    if (!locationData) return null;
    
    const adviceMap: Record<string, Record<string, string>> = {
      skincare: {
        'hot-humid': 'In humid conditions, focus on oil control and lightweight hydration. Use gel-based products and blotting papers.',
        'dry-hot': 'Combat dehydration with hyaluronic acid and rich SPF protection. Avoid alcohol-based toners.',
        'cold-dry': 'Prioritize barrier repair with ceramides and occlusives. Layer hydrating products.',
        'moderate': 'Maintain balance with gentle, pH-neutral products. Adapt seasonally.',
        'high-pollution': 'Double cleanse daily and use antioxidants like Vitamin C to combat free radicals.',
      },
      haircare: {
        'hot-humid': 'Control frizz with anti-humidity serums and clarify weekly to remove buildup.',
        'dry-hot': 'Deep condition regularly and use UV protection sprays. Minimize heat styling.',
        'cold-dry': 'Combat static with leave-in conditioners. Use gentle, moisturizing shampoos.',
        'moderate': 'Balance your routine based on seasonal changes. Trim regularly.',
        'high-pollution': 'Wash more frequently and use protective leave-ins to shield from particulates.',
      },
      workout: {
        'hot-humid': 'Work out during cooler hours. Stay extra hydrated and choose moisture-wicking fabrics.',
        'dry-hot': 'Exercise early morning or evening. Increase water intake by 20-30%.',
        'cold-dry': 'Warm up thoroughly to prevent injury. Keep skin covered to prevent moisture loss.',
        'moderate': 'Ideal conditions for outdoor activities. Maintain consistent routine.',
        'high-pollution': 'Consider indoor workouts on high pollution days. Use air purifiers at home.',
      },
      diet: {
        'hot-humid': 'Include cooling foods like cucumber and watermelon. Increase electrolyte intake.',
        'dry-hot': 'Focus on hydrating fruits and vegetables. Add healthy fats for moisture.',
        'cold-dry': 'Include warming spices and soups. Up your Omega-3 intake for skin health.',
        'moderate': 'Balanced seasonal eating. Include local, fresh produce.',
        'high-pollution': 'Boost antioxidant-rich foods. Include turmeric and green tea.',
      },
    };
    
    return adviceMap[category]?.[locationData.climateType] || null;
  };

  const locationAdvice = getLocationAdvice();

  return (
    <div
      className={`glass-card ${styles.border} card-hover overflow-hidden`}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {/* Card Header with Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recommendation.image}
          alt={recommendation.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        
        {/* Hover Preview */}
        {showPreview && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 p-4 animate-fade-in">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-foreground/90">Expected: {recommendation.timeline.split(',')[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className={`text-xl font-semibold mb-2 ${styles.accent}`}>
          {recommendation.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          {recommendation.description}
        </p>

        {/* Why It Fits */}
        <div className={`p-3 rounded-lg ${styles.bg} mb-4`}>
          <p className="text-sm font-medium mb-1">Why this fits you:</p>
          <p className="text-sm text-muted-foreground">{recommendation.whyItFits}</p>
        </div>

        {/* Location-Aware Section */}
        {locationAdvice && (
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 mb-4 animate-fade-in">
            <p className="text-sm font-medium mb-1 flex items-center gap-2 text-primary">
              <MapPin className="w-4 h-4" />
              Why this works for your location:
            </p>
            <p className="text-sm text-muted-foreground">{locationAdvice}</p>
          </div>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>View Full Details</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-6 animate-fade-in">
            {/* Ingredients */}
            <div>
              <h4 className="font-medium mb-3">Ingredients & Habits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-natural flex items-center gap-1">
                    <Check className="w-3 h-3" /> Prefer
                  </p>
                  <ul className="space-y-1">
                    {recommendation.ingredients.prefer.map((item, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-natural mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive flex items-center gap-1">
                    <X className="w-3 h-3" /> Avoid
                  </p>
                  <ul className="space-y-1">
                    {recommendation.ingredients.avoid.map((item, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                        <span className="text-destructive mt-0.5">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Natural vs Chemical - HIGHLIGHTED based on preference */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${preferredSolution !== 'mixed' ? 'relative' : ''}`}>
              {/* Natural Solution */}
              <div className={`p-4 rounded-xl relative overflow-hidden transition-all duration-300 ${
                isNaturalPreferred 
                  ? 'border-2 border-natural bg-natural/15 shadow-lg shadow-natural/30 scale-[1.02] ring-2 ring-natural/30' 
                  : isChemicalPreferred
                  ? 'border border-natural/30 bg-natural/5 opacity-75'
                  : 'border-2 border-natural/50 bg-natural/5'
              }`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-natural/10 rounded-full blur-2xl" />
                {isNaturalPreferred && (
                  <div className="absolute -top-1 -right-1 bg-natural text-background text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    RECOMMENDED
                  </div>
                )}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="natural-badge">
                      <Leaf className="w-4 h-4 mr-1" />
                      Natural
                    </div>
                  </div>
                  <h5 className="font-semibold text-natural mb-2">{recommendation.naturalSolution.title}</h5>
                  <p className="text-sm text-muted-foreground mb-3">{recommendation.naturalSolution.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {recommendation.naturalSolution.timeline}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <IndianRupee className="w-3 h-3" />
                      {recommendation.naturalSolution.cost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chemical Solution */}
              <div className={`p-4 rounded-xl relative overflow-hidden transition-all duration-300 ${
                isChemicalPreferred 
                  ? 'border-2 border-chemical bg-chemical/15 shadow-lg shadow-chemical/30 scale-[1.02] ring-2 ring-chemical/30' 
                  : isNaturalPreferred
                  ? 'border border-chemical/30 bg-chemical/5 opacity-75'
                  : 'border-2 border-chemical/50 bg-chemical/5'
              }`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-chemical/10 rounded-full blur-2xl" />
                {isChemicalPreferred && (
                  <div className="absolute -top-1 -right-1 bg-chemical text-background text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
                    RECOMMENDED
                  </div>
                )}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="chemical-badge">
                      <FlaskConical className="w-4 h-4 mr-1" />
                      Clinical
                    </div>
                  </div>
                  <h5 className="font-semibold text-chemical mb-2">{recommendation.chemicalSolution.title}</h5>
                  <p className="text-sm text-muted-foreground mb-3">{recommendation.chemicalSolution.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {recommendation.chemicalSolution.timeline}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <IndianRupee className="w-3 h-3" />
                      {recommendation.chemicalSolution.cost}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Note & Timeline */}
            <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  Budget Note
                </p>
                <p className="text-sm text-muted-foreground mt-1">{recommendation.budgetNote}</p>
              </div>
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Expected Timeline
                </p>
                <p className="text-sm text-muted-foreground mt-1">{recommendation.timeline}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
