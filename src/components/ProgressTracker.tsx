import React, { useState } from 'react';
import { Plus, Calendar, Star, TrendingUp, Sparkles, Scissors, Dumbbell, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/context/UserContext';
import { ProgressEntry } from '@/types/user';

const categoryIcons = {
  skincare: Sparkles,
  haircare: Scissors,
  workout: Dumbbell,
  diet: Utensils,
};

const categoryColors = {
  skincare: 'skincare',
  haircare: 'haircare',
  workout: 'workout',
  diet: 'diet',
};

const ProgressTracker: React.FC = () => {
  const { progress, addProgress } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    category: 'skincare',
    notes: '',
    rating: 3,
    improvements: [],
  });
  const [improvementInput, setImprovementInput] = useState('');

  const handleAddImprovement = () => {
    if (improvementInput.trim()) {
      setNewEntry(prev => ({
        ...prev,
        improvements: [...(prev.improvements || []), improvementInput.trim()],
      }));
      setImprovementInput('');
    }
  };

  const handleSubmit = () => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground">Log your self-care journey and track improvements</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Log Progress
        </Button>
      </div>

      {/* Add Progress Form */}
      {showForm && (
        <div className="glass-card p-6 mb-6 animate-fade-in">
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
                <input
                  type="text"
                  value={improvementInput}
                  onChange={(e) => setImprovementInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddImprovement()}
                  placeholder="e.g., Less acne, More energy..."
                  className="flex-1 px-4 py-2 rounded-lg input-dark text-sm"
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
              <Button onClick={handleSubmit} className="btn-primary">
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
                        {formatDate(entry.date)}
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
  );
};

export default ProgressTracker;
