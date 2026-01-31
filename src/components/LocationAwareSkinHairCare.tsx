import React, { useState } from 'react';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  ChevronDown, 
  ChevronUp,
  Building2,
  Store,
  Phone,
  MapPinned,
  Sparkles,
  Scissors,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  getClimateForLocation, 
  getNearbySupport, 
  getLocationAdjustments,
  ClimateInfo,
  NearbySupport 
} from '@/utils/locationData';

interface LocationAwareSkinHairCareProps {
  onLocationSet?: (location: string, climate: ClimateInfo) => void;
  currentLocation?: string;
  currentClimate?: ClimateInfo | null;
}

const LocationAwareSkinHairCare: React.FC<LocationAwareSkinHairCareProps> = ({
  onLocationSet,
  currentLocation = '',
  currentClimate = null,
}) => {
  const [locationInput, setLocationInput] = useState(currentLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [showClimate, setShowClimate] = useState(!!currentClimate);
  const [climate, setClimate] = useState<ClimateInfo | null>(currentClimate);
  const [location, setLocation] = useState(currentLocation);
  const [nearbySupport, setNearbySupport] = useState<NearbySupport[]>([]);
  const [isNearbySupportOpen, setIsNearbySupportOpen] = useState(false);

  const handleLocationSubmit = () => {
    if (!locationInput.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API delay for realistic feel
    setTimeout(() => {
      const detectedClimate = getClimateForLocation(locationInput);
      const support = getNearbySupport(locationInput);
      
      setClimate(detectedClimate);
      setLocation(locationInput);
      setNearbySupport(support);
      setShowClimate(true);
      setIsLoading(false);
      
      if (onLocationSet) {
        onLocationSet(locationInput, detectedClimate);
      }
    }, 800);
  };

  const adjustments = climate ? getLocationAdjustments(climate) : null;

  const getPollutionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-workout';
      case 'Moderate': return 'text-haircare';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getClimateIcon = () => {
    switch (climate?.type) {
      case 'hot-humid': return '🌴';
      case 'dry-hot': return '🏜️';
      case 'cold-dry': return '❄️';
      case 'high-pollution': return '🏭';
      default: return '🌤️';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-skincare/10 border border-skincare/30">
          <MapPin className="w-6 h-6 text-skincare" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold">Location-Aware Care</h2>
          <p className="text-muted-foreground text-sm">Personalized recommendations based on your environment</p>
        </div>
      </div>

      {/* Location Input Step */}
      <div className="glass-card p-6 glow-border-skincare card-hover">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Enter your location</label>
            <Input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="City, Area, or Pincode (e.g., Jaipur, Mumbai, Delhi)"
              className="input-dark"
              onKeyDown={(e) => e.key === 'Enter' && handleLocationSubmit()}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleLocationSubmit}
              disabled={!locationInput.trim() || isLoading}
              className="btn-primary w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <MapPinned className="w-4 h-4 mr-2" />
                  Set Location
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Location Badge & Climate Display */}
      {showClimate && climate && (
        <div className="space-y-6 animate-fade-in">
          {/* Persistent Location Badge */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Care optimized for: {location}</span>
              <span className="text-lg">{getClimateIcon()}</span>
            </div>
          </div>

          {/* Climate Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Climate Type */}
            <div className="glass-card p-4 card-hover border border-skincare/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-skincare/10">
                  <Thermometer className="w-5 h-5 text-skincare" />
                </div>
                <span className="text-sm text-muted-foreground">Climate</span>
              </div>
              <p className="text-lg font-semibold text-skincare">{climate.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{climate.temperature}</p>
            </div>

            {/* Humidity */}
            <div className="glass-card p-4 card-hover border border-haircare/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-haircare/10">
                  <Droplets className="w-5 h-5 text-haircare" />
                </div>
                <span className="text-sm text-muted-foreground">Humidity</span>
              </div>
              <p className="text-lg font-semibold text-haircare">{climate.humidity}</p>
              <p className="text-xs text-muted-foreground mt-1">Relative humidity</p>
            </div>

            {/* Pollution */}
            <div className="glass-card p-4 card-hover border border-diet/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-diet/10">
                  <Wind className="w-5 h-5 text-diet" />
                </div>
                <span className="text-sm text-muted-foreground">Pollution</span>
              </div>
              <p className={`text-lg font-semibold ${getPollutionColor(climate.pollution)}`}>
                {climate.pollution}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Air quality index</p>
            </div>

            {/* Environmental Impact */}
            <div className="glass-card p-4 card-hover border border-workout/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-workout/10">
                  <AlertCircle className="w-5 h-5 text-workout" />
                </div>
                <span className="text-sm text-muted-foreground">Impact</span>
              </div>
              <p className="text-lg font-semibold text-workout">
                {climate.skinStressors.length + climate.hairStressors.length} Stressors
              </p>
              <p className="text-xs text-muted-foreground mt-1">Identified concerns</p>
            </div>
          </div>

          {/* Skincare Recommendations */}
          <div className="glass-card p-6 glow-border-skincare card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-skincare/10">
                <Sparkles className="w-5 h-5 text-skincare" />
              </div>
              <h3 className="text-lg font-display font-semibold text-skincare">
                Skincare Adjustments for {location}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Stressors */}
              <div className="p-4 rounded-lg bg-secondary/50 border border-skincare/10">
                <p className="text-sm font-medium mb-2 text-skincare">Environmental Stressors:</p>
                <div className="flex flex-wrap gap-2">
                  {climate.skinStressors.map((stressor, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-skincare/10 text-skincare border border-skincare/30"
                    >
                      {stressor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why This Works */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-skincare/5 to-transparent border border-skincare/20">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-skincare" />
                  <span className="text-skincare">Why this works for your location:</span>
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="text-foreground font-medium">Morning:</span> {adjustments?.skincare.morning}</p>
                  <p><span className="text-foreground font-medium">Evening:</span> {adjustments?.skincare.evening}</p>
                </div>
              </div>

              {/* Recommended Products */}
              <div>
                <p className="text-sm font-medium mb-2">Recommended for {climate.label} climate:</p>
                <div className="flex flex-wrap gap-2">
                  {climate.recommendations.skincare.map((rec, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 text-sm rounded-lg bg-skincare/10 text-foreground border border-skincare/30 
                        hover:bg-skincare/20 hover:shadow-lg hover:shadow-skincare/10 transition-all cursor-default"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Haircare Recommendations */}
          <div className="glass-card p-6 glow-border-haircare card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-haircare/10">
                <Scissors className="w-5 h-5 text-haircare" />
              </div>
              <h3 className="text-lg font-display font-semibold text-haircare">
                Haircare Adjustments for {location}
              </h3>
            </div>

            <div className="space-y-4">
              {/* Stressors */}
              <div className="p-4 rounded-lg bg-secondary/50 border border-haircare/10">
                <p className="text-sm font-medium mb-2 text-haircare">Environmental Stressors:</p>
                <div className="flex flex-wrap gap-2">
                  {climate.hairStressors.map((stressor, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-haircare/10 text-haircare border border-haircare/30"
                    >
                      {stressor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why This Works */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-haircare/5 to-transparent border border-haircare/20">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-haircare" />
                  <span className="text-haircare">Why this works for your location:</span>
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="text-foreground font-medium">Wash Routine:</span> {adjustments?.haircare.wash}</p>
                  <p><span className="text-foreground font-medium">Treatments:</span> {adjustments?.haircare.treatment}</p>
                </div>
              </div>

              {/* Recommended Products */}
              <div>
                <p className="text-sm font-medium mb-2">Recommended for {climate.label} climate:</p>
                <div className="flex flex-wrap gap-2">
                  {climate.recommendations.haircare.map((rec, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 text-sm rounded-lg bg-haircare/10 text-foreground border border-haircare/30 
                        hover:bg-haircare/20 hover:shadow-lg hover:shadow-haircare/10 transition-all cursor-default"
                    >
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Support - Collapsible */}
          <Collapsible open={isNearbySupportOpen} onOpenChange={setIsNearbySupportOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full glass-card p-4 flex items-center justify-between hover:bg-secondary/30 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Nearby Skin & Hair Care Support</h3>
                    <p className="text-sm text-muted-foreground">Clinics & pharmacies in {location}</p>
                  </div>
                </div>
                {isNearbySupportOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="animate-accordion-down">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {nearbySupport.map((support) => (
                  <div 
                    key={support.id}
                    className="glass-card p-4 card-hover border border-border/50 hover:border-primary/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        support.type === 'clinic' ? 'bg-skincare/10' : 'bg-workout/10'
                      }`}>
                        {support.type === 'clinic' ? (
                          <Building2 className="w-5 h-5 text-skincare" />
                        ) : (
                          <Store className="w-5 h-5 text-workout" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{support.name}</h4>
                        {support.specialization && (
                          <p className="text-xs text-primary mt-0.5">{support.specialization}</p>
                        )}
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            {support.area}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {support.contact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Demo Disclaimer */}
              <p className="text-xs text-muted-foreground mt-4 text-center italic">
                * This is demo data for illustration purposes only. Actual listings are not verified.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export default LocationAwareSkinHairCare;
