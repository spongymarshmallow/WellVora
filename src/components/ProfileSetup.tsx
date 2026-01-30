import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, User, Sparkles, Heart, Dumbbell, Utensils, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/UserContext';
import { UserProfile } from '@/types/user';

interface ProfileSetupProps {
  onComplete: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const { user, setUserProfile } = useUser();
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | undefined>(user?.photo);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: user?.name || '',
    gender: user?.gender || 'male',
    ageRange: user?.ageRange || '',
    height: user?.height || 170,
    weight: user?.weight || 70,
    budget: user?.budget || '',
    allergies: user?.allergies || '',
    skinType: user?.skinType || '',
    hairType: user?.hairType || '',
    activityLevel: user?.activityLevel || '',
    solutionPreference: user?.solutionPreference || 'mixed',
    skinGoals: user?.skinGoals || '',
    hairGoals: user?.hairGoals || '',
    bodyGoals: user?.bodyGoals || '',
  });

  const totalSteps = 4;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateForm = (field: keyof UserProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    const completeProfile: UserProfile = {
      email: user?.email || '',
      name: formData.name || '',
      photo,
      gender: formData.gender as 'male' | 'female' | 'other',
      ageRange: formData.ageRange || '',
      height: formData.height || 170,
      weight: formData.weight || 70,
      budget: formData.budget || '',
      allergies: formData.allergies || '',
      skinType: formData.skinType || '',
      hairType: formData.hairType || '',
      activityLevel: formData.activityLevel || '',
      solutionPreference: formData.solutionPreference as 'natural' | 'chemical' | 'mixed',
      skinGoals: formData.skinGoals || '',
      hairGoals: formData.hairGoals || '',
      bodyGoals: formData.bodyGoals || '',
    };
    setUserProfile(completeProfile);
    onComplete();
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.gender && formData.ageRange;
      case 2:
        return formData.height && formData.weight && formData.budget;
      case 3:
        return formData.skinType && formData.hairType && formData.activityLevel;
      case 4:
        return formData.skinGoals || formData.hairGoals || formData.bodyGoals;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-display font-bold">Basic Information</h2>
              <p className="text-muted-foreground mt-1">Let's start with the basics</p>
            </div>

            {/* Photo Upload */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border-2 border-primary/30">
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
                  <Upload className="w-4 h-4 text-primary-foreground" />
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Your Name</label>
              <Input
                value={formData.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Enter your name"
                className="input-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateForm('gender', option.value)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.gender === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Age Range</label>
              <div className="grid grid-cols-3 gap-3">
                {['18-25', '26-35', '36-45', '46-55', '56-65', '65+'].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => updateForm('ageRange', range)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.ageRange === range
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-haircare mx-auto mb-3" />
              <h2 className="text-2xl font-display font-bold">Body & Budget</h2>
              <p className="text-muted-foreground mt-1">Help us personalize your recommendations</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Height (cm)</label>
                <Input
                  type="number"
                  value={formData.height}
                  onChange={(e) => updateForm('height', parseInt(e.target.value) || 0)}
                  placeholder="170"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Weight (kg)</label>
                <Input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => updateForm('weight', parseInt(e.target.value) || 0)}
                  placeholder="70"
                  className="input-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Monthly Budget for Self-Care (₹)</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '0-500', label: '₹0 - ₹500' },
                  { value: '500-1000', label: '₹500 - ₹1,000' },
                  { value: '1000-2500', label: '₹1,000 - ₹2,500' },
                  { value: '2500-5000', label: '₹2,500 - ₹5,000' },
                  { value: '5000-10000', label: '₹5,000 - ₹10,000' },
                  { value: '10000+', label: '₹10,000+' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateForm('budget', option.value)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.budget === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Allergies & Sensitivities (type any allergies, comma-separated)
              </label>
              <Input
                value={formData.allergies}
                onChange={(e) => updateForm('allergies', e.target.value)}
                placeholder="e.g., nuts, fragrance, nickel, sulfa drugs..."
                className="input-dark"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty if none</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 text-skincare mx-auto mb-3" />
              <h2 className="text-2xl font-display font-bold">Your Profile</h2>
              <p className="text-muted-foreground mt-1">Tell us about your skin, hair & lifestyle</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Skin Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive', 'Acne-prone'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateForm('skinType', type.toLowerCase())}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.skinType === type.toLowerCase()
                        ? 'border-skincare bg-skincare/10 text-skincare'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-skincare/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Hair Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['Straight', 'Wavy', 'Curly', 'Coily', 'Oily Scalp', 'Dry/Frizzy'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateForm('hairType', type.toLowerCase())}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.hairType === type.toLowerCase()
                        ? 'border-haircare bg-haircare/10 text-haircare'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-haircare/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Activity Level</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'sedentary', label: 'Sedentary' },
                  { value: 'light', label: 'Light Activity' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'high', label: 'Very Active' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateForm('activityLevel', option.value)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.activityLevel === option.value
                        ? 'border-workout bg-workout/10 text-workout'
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-workout/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Solution Preference</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'natural', label: '🌿 Natural', color: 'natural' },
                  { value: 'chemical', label: '🔬 Chemical', color: 'chemical' },
                  { value: 'mixed', label: '⚖️ Mixed', color: 'primary' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateForm('solutionPreference', option.value)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.solutionPreference === option.value
                        ? `border-${option.color} bg-${option.color}/10 text-${option.color}`
                        : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Dumbbell className="w-12 h-12 text-workout mx-auto mb-3" />
              <h2 className="text-2xl font-display font-bold">Your Goals</h2>
              <p className="text-muted-foreground mt-1">What do you want to achieve? Be specific!</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <span className="text-skincare">🌟 Skin Goals</span> - What skin concerns or improvements?
              </label>
              <Textarea
                value={formData.skinGoals}
                onChange={(e) => updateForm('skinGoals', e.target.value)}
                placeholder="e.g., Clear acne, reduce dark spots, get glowing skin, manage oily T-zone, anti-aging..."
                className="input-dark min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <span className="text-haircare">💇 Hair Goals</span> - What hair concerns or improvements?
              </label>
              <Textarea
                value={formData.hairGoals}
                onChange={(e) => updateForm('hairGoals', e.target.value)}
                placeholder="e.g., Reduce hair fall, control dandruff, get silky smooth hair, promote growth..."
                className="input-dark min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                <span className="text-workout">💪 Body & Fitness Goals</span> - What fitness or body goals?
              </label>
              <Textarea
                value={formData.bodyGoals}
                onChange={(e) => updateForm('bodyGoals', e.target.value)}
                placeholder="e.g., Lose belly fat, build muscle, improve flexibility, increase energy, better posture..."
                className="input-dark min-h-[80px]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full mx-1 transition-colors ${
                  i < step ? 'bg-primary' : i === step - 1 ? 'bg-primary' : 'bg-secondary'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Form card */}
        <div className="glass-card p-6">
          {renderStep()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step < totalSteps ? (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleComplete}
                disabled={!canProceed()}
                className="btn-primary flex items-center gap-2"
              >
                Complete Setup
                <Sparkles className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
