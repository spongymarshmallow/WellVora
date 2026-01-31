import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Shield, AlertTriangle, CheckCircle, XCircle, ArrowLeft, Scan, Eye, Droplets, Sun, Wind, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/context/UserContext';

interface ScreeningFinding {
  id: string;
  type: 'skin' | 'hair';
  pattern: string;
  description: string;
  severity: 'low' | 'moderate' | 'high';
  guidance: string[];
}

interface ScreeningResult {
  findings: ScreeningFinding[];
  overallRisk: 'low' | 'moderate' | 'high';
  generalGuidance: string[];
}

// Mock AI analysis function - simulates visual pattern detection
const performMockAnalysis = (imageType: 'face' | 'scalp' | 'both', ageRange?: string, gender?: string): ScreeningResult => {
  // Generate pseudo-random but consistent findings based on image type
  const skinPatterns: ScreeningFinding[] = [
    {
      id: 'skin-1',
      type: 'skin',
      pattern: 'Uneven surface texture',
      description: 'Areas with visible texture variation detected. This is commonly associated with natural skin characteristics that may benefit from gentle exfoliation.',
      severity: 'low',
      guidance: ['Consider gentle cleansing twice daily', 'Hydrating moisturizers may help smooth appearance'],
    },
    {
      id: 'skin-2',
      type: 'skin',
      pattern: 'Visible redness areas',
      description: 'Some areas show increased redness. This pattern is often related to sensitivity or environmental exposure.',
      severity: 'moderate',
      guidance: ['Avoid harsh products with alcohol or fragrance', 'Consider soothing ingredients like aloe vera', 'Sun protection is recommended'],
    },
    {
      id: 'skin-3',
      type: 'skin',
      pattern: 'Tone variation',
      description: 'Areas of uneven skin tone observed. This is commonly seen and can be influenced by sun exposure and lifestyle factors.',
      severity: 'low',
      guidance: ['Daily sunscreen use is beneficial', 'Vitamin C serums may help with brightness', 'Consistent skincare routine recommended'],
    },
  ];

  const hairPatterns: ScreeningFinding[] = [
    {
      id: 'hair-1',
      type: 'hair',
      pattern: 'Scalp dryness indicators',
      description: 'Visual signs suggest the scalp may be experiencing dryness. This is common in certain climates and can be addressed with proper care.',
      severity: 'low',
      guidance: ['Hydrating shampoos may help', 'Avoid very hot water when washing', 'Consider scalp oils or serums'],
    },
    {
      id: 'hair-2',
      type: 'hair',
      pattern: 'Hair density variation',
      description: 'Some variation in visible hair density observed. This can be influenced by many factors including stress, nutrition, and care habits.',
      severity: 'moderate',
      guidance: ['Gentle hair handling recommended', 'Consider biotin-rich foods', 'Scalp massage may promote circulation'],
    },
  ];

  // Select findings based on image type
  let findings: ScreeningFinding[] = [];
  
  if (imageType === 'face' || imageType === 'both') {
    // Randomly select 1-2 skin findings
    const numSkinFindings = Math.floor(Math.random() * 2) + 1;
    findings = [...skinPatterns.slice(0, numSkinFindings)];
  }
  
  if (imageType === 'scalp' || imageType === 'both') {
    // Randomly select 1 hair finding
    findings = [...findings, hairPatterns[Math.floor(Math.random() * hairPatterns.length)]];
  }

  // Calculate overall risk
  const severities = findings.map(f => f.severity);
  let overallRisk: 'low' | 'moderate' | 'high' = 'low';
  if (severities.includes('high')) overallRisk = 'high';
  else if (severities.includes('moderate')) overallRisk = 'moderate';

  // Adapt guidance silently based on age/gender if available
  let generalGuidance = [
    'Maintain consistent daily care routines',
    'Stay hydrated and maintain a balanced diet',
    'Protect from excessive sun exposure',
    'Consider consulting a dermatologist for persistent concerns',
  ];

  // Silent age-based adaptations (not mentioned to user)
  if (ageRange === 'child') {
    generalGuidance = [
      'Gentle, fragrance-free products are recommended',
      'Sun protection is especially important',
      'Mild cleansing is usually sufficient',
      'Consult a pediatric dermatologist for any concerns',
    ];
  } else if (ageRange === 'teen') {
    generalGuidance = [
      'Oil-balancing care may be beneficial',
      'Avoid over-cleansing which can worsen oiliness',
      'Non-comedogenic products are recommended',
      'Consistent routine is key during this stage',
    ];
  } else if (ageRange === 'adult-40' || ageRange === '50+') {
    generalGuidance = [
      'Hydration becomes increasingly important',
      'Gentle, nourishing products are beneficial',
      'Sun protection helps maintain skin health',
      'Consider products supporting elasticity',
    ];
  }

  return {
    findings,
    overallRisk,
    generalGuidance,
  };
};

const riskColors = {
  low: 'bg-[hsl(var(--workout))]/20 text-[hsl(var(--workout))] border-[hsl(var(--workout))]/50',
  moderate: 'bg-[hsl(var(--haircare))]/20 text-[hsl(var(--haircare))] border-[hsl(var(--haircare))]/50',
  high: 'bg-destructive/20 text-destructive border-destructive/50',
};

const severityIcons = {
  low: CheckCircle,
  moderate: AlertTriangle,
  high: XCircle,
};

interface AIScreeningProps {
  onBack: () => void;
}

const AIScreening: React.FC<AIScreeningProps> = ({ onBack }) => {
  const { user } = useUser();
  const [hasConsent, setHasConsent] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageType, setImageType] = useState<'face' | 'scalp' | 'both'>('face');
  const [results, setResults] = useState<ScreeningResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Map user age range to internal format
  const getAgeCategory = (): string | undefined => {
    if (!user?.ageRange) return undefined;
    if (user.ageRange.includes('under') || user.ageRange.includes('child')) return 'child';
    if (user.ageRange.includes('13') || user.ageRange.includes('teen')) return 'teen';
    if (user.ageRange.includes('40') || user.ageRange.includes('50')) return 'adult-40';
    if (user.ageRange.includes('50+') || user.ageRange.includes('60')) return '50+';
    return 'adult';
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setResults(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const captureFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setUploadedImage(imageData);
        stopCamera();
        setResults(null);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const runAnalysis = () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    // Simulate AI processing time
    setTimeout(() => {
      const analysisResults = performMockAnalysis(imageType, getAgeCategory(), user?.gender);
      setResults(analysisResults);
      setIsAnalyzing(false);
    }, 2500);
  };

  const resetScreening = () => {
    setUploadedImage(null);
    setResults(null);
    stopCamera();
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <Scan className="w-7 h-7 text-primary" />
              AI Skin & Hair Health Screening
            </h1>
            <p className="text-muted-foreground mt-1">Visual screening for external appearance patterns</p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <Card className="glass-card border-primary/30 mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Important:</span> This AI tool provides visual health screening for informational purposes only and does not provide medical diagnosis or treatment. Please consult a qualified healthcare professional for medical advice.
            </p>
          </CardContent>
        </Card>

        {/* Consent Section */}
        {!hasConsent && (
          <Card className="glass-card glow-border-skincare mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-[hsl(var(--skincare))]" />
                Privacy & Consent
              </CardTitle>
              <CardDescription>Please review and accept before proceeding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I understand that this AI tool provides visual screening for informational purposes only. 
                  It does not provide medical diagnosis or treatment. Images and live camera data are 
                  processed only for analysis and <span className="text-foreground font-medium">are not stored</span>.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox 
                  id="consent" 
                  checked={hasConsent} 
                  onCheckedChange={(checked) => setHasConsent(checked === true)}
                />
                <Label htmlFor="consent" className="text-sm cursor-pointer">
                  I have read and accept the above terms
                </Label>
              </div>
              <Button 
                onClick={() => setHasConsent(true)} 
                disabled={!hasConsent}
                className="w-full btn-primary"
              >
                Continue to Screening
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Screening Interface */}
        {hasConsent && !results && (
          <div className="space-y-6 animate-fade-in">
            {/* Image Type Selection */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">What would you like to screen?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'face', label: 'Face / Skin', icon: Eye },
                    { value: 'scalp', label: 'Scalp / Hair', icon: Wind },
                    { value: 'both', label: 'Both', icon: Scan },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setImageType(option.value as 'face' | 'scalp' | 'both')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                          imageType === option.value
                            ? 'bg-primary/20 text-primary border border-primary/50'
                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary border border-transparent'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Upload / Camera Options */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Photo Upload */}
              <Card className="glass-card glow-border-workout card-hover">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--workout))]">
                    <Upload className="w-5 h-5" />
                    Upload Photo (Optional)
                  </CardTitle>
                  <CardDescription>Upload a clear, well-lit image</CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full h-32 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload</span>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              {/* Live Camera */}
              <Card className="glass-card glow-border-skincare card-hover">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--skincare))]">
                    <Camera className="w-5 h-5" />
                    Live Camera (Optional)
                  </CardTitle>
                  <CardDescription>Use device camera for capture</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={cameraActive ? captureFromCamera : startCamera}
                    variant="outline"
                    className="w-full h-32 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="text-center">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {cameraActive ? 'Tap to capture' : 'Start camera'}
                      </span>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Camera Preview */}
            {cameraActive && (
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-4 border-primary/30 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-full opacity-50" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button onClick={captureFromCamera} className="flex-1 btn-primary">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                    <Button onClick={stopCamera} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Uploaded Image Preview */}
            {uploadedImage && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Image Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-secondary/30 rounded-lg overflow-hidden mb-4">
                    <img 
                      src={uploadedImage} 
                      alt="Preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={runAnalysis} 
                      disabled={isAnalyzing}
                      className="flex-1 btn-primary"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Scan className="w-4 h-4 mr-2" />
                          Run AI Analysis
                        </>
                      )}
                    </Button>
                    <Button onClick={resetScreening} variant="outline">
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Analyzing Image</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      AI is examining visible patterns...
                    </p>
                    <Progress value={66} className="h-2 max-w-xs mx-auto" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guidance Tips */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="w-5 h-5 text-[hsl(var(--haircare))]" />
                  Tips for Better Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-[hsl(var(--skincare))] mt-0.5 flex-shrink-0" />
                    Clean face without makeup for skin screening
                  </li>
                  <li className="flex items-start gap-2">
                    <Sun className="w-4 h-4 text-[hsl(var(--haircare))] mt-0.5 flex-shrink-0" />
                    Use natural, even lighting
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="w-4 h-4 text-[hsl(var(--workout))] mt-0.5 flex-shrink-0" />
                    Face the camera directly
                  </li>
                  <li className="flex items-start gap-2">
                    <Camera className="w-4 h-4 text-[hsl(var(--diet))] mt-0.5 flex-shrink-0" />
                    Ensure image is clear and not blurry
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-fade-in">
            {/* Overall Risk */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-xl font-display font-bold text-foreground mb-2">
                      Detected External Appearance Patterns
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Based on visual analysis, certain external patterns have been observed. 
                      This is a screening assessment and not a medical diagnosis.
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">Overall Visibility Risk:</span>
                      <Badge className={`${riskColors[results.overallRisk]} text-sm px-4 py-1.5`}>
                        {results.overallRisk.charAt(0).toUpperCase() + results.overallRisk.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Findings */}
            <div className="grid gap-4">
              {results.findings.map((finding) => {
                const SeverityIcon = severityIcons[finding.severity];
                return (
                  <Card key={finding.id} className={`glass-card ${finding.type === 'skin' ? 'glow-border-skincare' : 'glow-border-haircare'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {finding.type === 'skin' ? (
                            <Eye className="w-5 h-5 text-[hsl(var(--skincare))]" />
                          ) : (
                            <Wind className="w-5 h-5 text-[hsl(var(--haircare))]" />
                          )}
                          {finding.pattern}
                        </CardTitle>
                        <Badge className={`${riskColors[finding.severity]} text-xs`}>
                          <SeverityIcon className="w-3 h-3 mr-1" />
                          {finding.severity}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{finding.description}</p>
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-foreground mb-2">General Guidance:</h4>
                        <ul className="space-y-1">
                          {finding.guidance.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* General Guidance */}
            <Card className="glass-card glow-border-workout">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-[hsl(var(--workout))]">
                  <CheckCircle className="w-5 h-5" />
                  Improvement & General Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.generalGuidance.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-[hsl(var(--workout))] mt-0.5">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Final Disclaimer */}
            <Card className="glass-card border-primary/30">
              <CardContent className="p-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Disclaimer:</span> This AI tool provides visual health screening for informational purposes only and does not provide medical diagnosis or treatment. Please consult a qualified healthcare professional for medical advice.
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={resetScreening} variant="outline" className="gap-2">
                New Screening
              </Button>
              <Button onClick={onBack} className="btn-primary gap-2">
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIScreening;
