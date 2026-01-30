import React, { useState, useMemo } from 'react';
import { 
  Plus, Calendar, Star, TrendingUp, Sparkles, Scissors, Dumbbell, Utensils, 
  Droplets, Flame, Clock, Bell, BellOff, Quote, Target, CheckCircle2, AlertCircle, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useUser } from '@/context/UserContext';
import { ProgressEntry, Reminder } from '@/types/user';
import { calculateDailyNeeds } from '@/utils/recommendations';
import { getQuoteByProgress, getRandomQuote } from '@/utils/motivationalQuotes';

const categoryIcons = {
  skincare: Sparkles,
  haircare: Scissors,
  workout: Dumbbell,
  diet: Utensils,
  hydration: Droplets,
};

const categoryColors = {
  skincare: 'skincare',
  haircare: 'haircare',
  workout: 'workout',
  diet: 'diet',
  hydration: 'skincare',
};

const ProgressTracker: React.FC = () => {
  const { user, progress, calorieLogs, reminders, addProgress, addCalorieLog, addReminder, toggleReminder, deleteReminder } = useUser();
  const [activeTab, setActiveTab] = useState<'log' | 'calories' | 'reminders'>('calories');
  const [showForm, setShowForm] = useState(false);
  const [showCalorieForm, setShowCalorieForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    category: 'skincare',
    notes: '',
    rating: 3,
    improvements: [],
  });
  const [improvementInput, setImprovementInput] = useState('');
  
  const [calorieInput, setCalorieInput] = useState('');
  const [waterInput, setWaterInput] = useState('');
  
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    time: '09:00',
    category: 'hydration',
    isActive: true,
  });

  const dailyNeeds = useMemo(() => {
    if (!user) return { calories: 2000, hydration: 2500, protein: 100 };
    return calculateDailyNeeds(user);
  }, [user]);

  // Calculate today's totals
  const todaysTotals = useMemo(() => {
    const today = new Date().toDateString();
    const todaysLogs = calorieLogs.filter(log => new Date(log.date).toDateString() === today);
    
    return {
      calories: todaysLogs.reduce((sum, log) => sum + log.caloriesConsumed, 0),
      water: todaysLogs.reduce((sum, log) => sum + log.waterIntake, 0),
    };
  }, [calorieLogs]);

  const calorieProgress = (todaysTotals.calories / dailyNeeds.calories) * 100;
  const waterProgress = (todaysTotals.water / dailyNeeds.hydration) * 100;

  const motivationalQuote = useMemo(() => {
    if (todaysTotals.calories > 0 || todaysTotals.water > 0) {
      return getQuoteByProgress(todaysTotals.calories, dailyNeeds.calories, todaysTotals.water, dailyNeeds.hydration);
    }
    return getRandomQuote('onTrack');
  }, [todaysTotals, dailyNeeds]);

  const handleAddImprovement = () => {
    if (improvementInput.trim()) {
      setNewEntry(prev => ({
        ...prev,
        improvements: [...(prev.improvements || []), improvementInput.trim()],
      }));
      setImprovementInput('');
    }
  };

  const handleSubmitProgress = () => {
    if (newEntry.notes) {
      addProgress({
        date: new Date().toISOString(),
        category: newEntry.category as ProgressEntry['category'],
        notes: newEntry.notes,
        rating: newEntry.rating || 3,
        improvements: newEntry.improvements || [],
      });
      setNewEntry({ category: 'skincare', notes: '', rating: 3, improvements: [] });
      setShowForm(false);
    }
  };

  const handleSubmitCalories = () => {
    const calories = parseInt(calorieInput) || 0;
    const water = parseInt(waterInput) || 0;
    
    if (calories > 0 || water > 0) {
      const now = new Date();
      addCalorieLog({
        date: now.toISOString(),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        caloriesConsumed: calories,
        waterIntake: water,
        targetCalories: dailyNeeds.calories,
        targetWater: dailyNeeds.hydration,
      });
      setCalorieInput('');
      setWaterInput('');
      setShowCalorieForm(false);
    }
  };

  const handleSubmitReminder = () => {
    if (newReminder.title && newReminder.time) {
      addReminder({
        title: newReminder.title,
        time: newReminder.time,
        category: newReminder.category as Reminder['category'],
        isActive: true,
      });
      setNewReminder({ title: '', time: '09:00', category: 'hydration', isActive: true });
      setShowReminderForm(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProgressStatus = () => {
    if (calorieProgress >= 80 && calorieProgress <= 120 && waterProgress >= 80) {
      return { status: 'excellent', color: 'text-natural', icon: CheckCircle2, label: 'On Track! 🎉' };
    } else if (calorieProgress >= 50 || waterProgress >= 50) {
      return { status: 'good', color: 'text-primary', icon: Target, label: 'Keep Going! 💪' };
    } else {
      return { status: 'needs-work', color: 'text-haircare', icon: AlertCircle, label: 'Let\'s Get Started! 🌟' };
    }
  };

  const progressStatus = getProgressStatus();
  const StatusIcon = progressStatus.icon;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground">Track your daily intake and self-care journey</p>
        </div>
      </div>

      {/* Motivational Quote Card */}
      <div className="glass-card p-6 mb-6 bg-gradient-to-r from-primary/10 to-diet/10 border-primary/30 animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Quote className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground leading-relaxed">{motivationalQuote}</p>
            <div className="flex items-center gap-2 mt-3">
              <StatusIcon className={`w-5 h-5 ${progressStatus.color}`} />
              <span className={`font-medium ${progressStatus.color}`}>{progressStatus.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Calories Card */}
        <div className="glass-card p-6 glow-border-diet">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-diet/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-diet" />
              </div>
              <div>
                <h3 className="font-semibold">Calories Today</h3>
                <p className="text-sm text-muted-foreground">Daily Target: {dailyNeeds.calories} kcal</p>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-end justify-between mb-1">
              <span className="text-3xl font-bold text-diet">{todaysTotals.calories}</span>
              <span className="text-muted-foreground">/ {dailyNeeds.calories} kcal</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  calorieProgress > 120 ? 'bg-destructive' : calorieProgress >= 80 ? 'bg-natural' : 'bg-diet'
                }`}
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {calorieProgress > 120 
              ? `Over by ${todaysTotals.calories - dailyNeeds.calories} kcal` 
              : `${Math.round(100 - calorieProgress)}% remaining`}
          </p>
        </div>

        {/* Hydration Card */}
        <div className="glass-card p-6 glow-border-skincare">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-skincare/10 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-skincare" />
              </div>
              <div>
                <h3 className="font-semibold">Hydration Today</h3>
                <p className="text-sm text-muted-foreground">Daily Target: {dailyNeeds.hydration} ml</p>
              </div>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-end justify-between mb-1">
              <span className="text-3xl font-bold text-skincare">{todaysTotals.water}</span>
              <span className="text-muted-foreground">/ {dailyNeeds.hydration} ml</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  waterProgress >= 100 ? 'bg-natural' : 'bg-skincare'
                }`}
                style={{ width: `${Math.min(waterProgress, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {waterProgress >= 100 
              ? '✓ Daily goal achieved!' 
              : `${Math.round(dailyNeeds.hydration - todaysTotals.water)} ml remaining`}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('calories')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'calories'
              ? 'bg-diet/10 text-diet border border-diet/30'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Flame className="w-4 h-4" />
          Daily Intake
        </button>
        <button
          onClick={() => setActiveTab('log')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'log'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Progress Log
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            activeTab === 'reminders'
              ? 'bg-workout/10 text-workout border border-workout/30'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Bell className="w-4 h-4" />
          Reminders
        </button>
      </div>

      {/* Calories Tab */}
      {activeTab === 'calories' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Daily Intake Log</h2>
            <Button onClick={() => setShowCalorieForm(!showCalorieForm)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Log Intake
            </Button>
          </div>

          {showCalorieForm && (
            <div className="glass-card p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Log Your Intake</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Calories Consumed (kcal)
                  </label>
                  <Input
                    type="number"
                    value={calorieInput}
                    onChange={(e) => setCalorieInput(e.target.value)}
                    placeholder="e.g., 500"
                    className="input-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Water Intake (ml)
                  </label>
                  <Input
                    type="number"
                    value={waterInput}
                    onChange={(e) => setWaterInput(e.target.value)}
                    placeholder="e.g., 250"
                    className="input-dark"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowCalorieForm(false)} variant="ghost">
                  Cancel
                </Button>
                <Button onClick={handleSubmitCalories} className="btn-primary">
                  Save Log
                </Button>
              </div>
            </div>
          )}

          {/* Calorie Logs History */}
          <div className="space-y-3">
            {calorieLogs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No intake logged yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your daily calories and hydration!
                </p>
                <Button onClick={() => setShowCalorieForm(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Your First Intake
                </Button>
              </div>
            ) : (
              calorieLogs.map((log) => (
                <div key={log.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-diet/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-diet" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDateTime(log.date)}</p>
                      <p className="text-sm text-muted-foreground">{log.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold text-diet">{log.caloriesConsumed} kcal</p>
                      <p className="text-xs text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-skincare">{log.waterIntake} ml</p>
                      <p className="text-xs text-muted-foreground">Water</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Progress Log Tab */}
      {activeTab === 'log' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Progress Entries</h2>
            <Button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Log Progress
            </Button>
          </div>

          {showForm && (
            <div className="glass-card p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Log Today's Progress</h3>
              
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['skincare', 'haircare', 'workout', 'diet'] as const).map((cat) => {
                      const Icon = categoryIcons[cat];
                      const color = categoryColors[cat];
                      return (
                        <button
                          key={cat}
                          onClick={() => setNewEntry(prev => ({ ...prev, category: cat }))}
                          className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition-all capitalize ${
                            newEntry.category === cat
                              ? `border-${color} bg-${color}/10 text-${color}`
                              : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    How do you feel about today's progress?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewEntry(prev => ({ ...prev, rating: star }))}
                        className="p-2 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (newEntry.rating || 0)
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    What did you do today? How are you feeling?
                  </label>
                  <Textarea
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Describe your routine, any changes you noticed, challenges faced..."
                    className="input-dark min-h-[100px]"
                  />
                </div>

                {/* Improvements */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Any improvements noticed? (Add each one)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      type="text"
                      value={improvementInput}
                      onChange={(e) => setImprovementInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddImprovement()}
                      placeholder="e.g., Less acne, More energy..."
                      className="flex-1 input-dark text-sm"
                    />
                    <Button onClick={handleAddImprovement} variant="secondary" size="sm">
                      Add
                    </Button>
                  </div>
                  {newEntry.improvements && newEntry.improvements.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newEntry.improvements.map((imp, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full text-xs bg-natural/10 text-natural border border-natural/30"
                        >
                          {imp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={() => setShowForm(false)} variant="ghost">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitProgress} className="btn-primary">
                    Save Progress
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Progress History */}
          <div className="space-y-4">
            {progress.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No progress logged yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your journey by logging your first progress entry!
                </p>
                <Button onClick={() => setShowForm(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Your First Entry
                </Button>
              </div>
            ) : (
              progress.map((entry) => {
                const Icon = categoryIcons[entry.category];
                const color = categoryColors[entry.category];
                return (
                  <div key={entry.id} className={`glass-card glow-border-${entry.category} p-5`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold capitalize">{entry.category}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateTime(entry.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= entry.rating
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{entry.notes}</p>
                    
                    {entry.improvements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.improvements.map((imp, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 rounded-full text-xs bg-natural/10 text-natural border border-natural/30"
                          >
                            ✓ {imp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Reminders</h2>
            <Button onClick={() => setShowReminderForm(!showReminderForm)} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          </div>

          {showReminderForm && (
            <div className="glass-card p-6 animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Add New Reminder</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Reminder Title
                  </label>
                  <Input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Drink water, Apply moisturizer..."
                    className="input-dark"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={newReminder.category}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, category: e.target.value as Reminder['category'] }))}
                      className="w-full px-4 py-2 rounded-lg input-dark"
                    >
                      <option value="hydration">Hydration</option>
                      <option value="skincare">Skincare</option>
                      <option value="haircare">Haircare</option>
                      <option value="workout">Workout</option>
                      <option value="diet">Diet</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setShowReminderForm(false)} variant="ghost">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitReminder} className="btn-primary">
                    Add Reminder
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Reminders List */}
          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No reminders set</h3>
                <p className="text-muted-foreground mb-4">
                  Set up reminders to stay on track with your wellness goals!
                </p>
                <Button onClick={() => setShowReminderForm(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Reminder
                </Button>
              </div>
            ) : (
              reminders.map((reminder) => {
                const Icon = categoryIcons[reminder.category];
                const color = categoryColors[reminder.category];
                return (
                  <div 
                    key={reminder.id} 
                    className={`glass-card p-4 flex items-center justify-between transition-opacity ${
                      !reminder.isActive ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${color}`} />
                      </div>
                      <div>
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {reminder.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {reminder.isActive ? (
                          <Bell className="w-4 h-4 text-natural" />
                        ) : (
                          <BellOff className="w-4 h-4 text-muted-foreground" />
                        )}
                        <Switch
                          checked={reminder.isActive}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
