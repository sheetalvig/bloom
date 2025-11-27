"use client"
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Calendar, TrendingUp, Sprout, User, Award, Heart, Wind, Brain, Sparkles, Star, Flame, Check } from 'lucide-react';



const MOODS = {
  joyful: { emoji: '😊', color: 'bg-yellow-100 border-yellow-300', label: 'Joyful' },
  calm: { emoji: '😌', color: 'bg-blue-100 border-blue-300', label: 'Calm' },
  neutral: { emoji: '😐', color: 'bg-gray-100 border-gray-300', label: 'Neutral' },
  anxious: { emoji: '😰', color: 'bg-purple-100 border-purple-300', label: 'Anxious' },
  sad: { emoji: '😢', color: 'bg-blue-200 border-blue-400', label: 'Sad' },
  angry: { emoji: '😠', color: 'bg-red-100 border-red-300', label: 'Angry' },
  tired: { emoji: '😴', color: 'bg-indigo-100 border-indigo-300', label: 'Tired' },
  energized: { emoji: '⚡', color: 'bg-orange-100 border-orange-300', label: 'Energized' }
};

const EXERCISES = {
  breathing: {
    id: 'breathing',
    title: 'Box Breathing',
    icon: Wind,
    duration: 60,
    description: 'Calm your nervous system with rhythmic breathing',
    steps: ['Breathe in for 4 seconds', 'Hold for 4 seconds', 'Breathe out for 4 seconds', 'Hold for 4 seconds']
  },
  grounding: {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    icon: Brain,
    duration: 90,
    description: 'Connect with your senses to anchor yourself',
    steps: ['Name 5 things you see', 'Name 4 things you can touch', 'Name 3 things you hear', 'Name 2 things you smell', 'Name 1 thing you taste']
  },
  gratitude: {
    id: 'gratitude',
    title: 'Gratitude Reflection',
    icon: Heart,
    duration: 45,
    description: 'Shift focus to positive experiences',
    steps: ['Think of someone who helped you', 'Recall a small joy from today', 'Appreciate something about yourself']
  },
  reframing: {
    id: 'reframing',
    title: 'Thought Reframing',
    icon: Sparkles,
    duration: 60,
    description: 'Challenge unhelpful thought patterns',
    steps: ['Identify the negative thought', 'Find evidence against it', 'Create a balanced perspective']
  }
};

// =============================================
// STORAGE CONTEXT & HOOKS
// =============================================

const DataContext = createContext();

const useStorage = () => {
  const [data, setData] = useState({
    moods: [],
    gratitudes: [],
    exercises: [],
    profile: {
      name: '',
      streakCount: 0,
      lastCheckIn: null,
      preferences: { reminderTime: '20:00', notificationsEnabled: false },
      achievements: []
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('bloomData');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem('bloomData', JSON.stringify(newData));
  };

  const addMood = (mood, reflection) => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mood,
      reflection
    };
    const newData = { ...data, moods: [entry, ...data.moods] };
    updateStreak(newData);
    saveData(newData);
  };

  const addGratitude = (items) => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      items
    };
    saveData({ ...data, gratitudes: [entry, ...data.gratitudes] });
  };

  const completeExercise = (exerciseType, helpfulness) => {
    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      exerciseType,
      helpfulness
    };
    const newData = { ...data, exercises: [entry, ...data.exercises] };
    checkAchievements(newData);
    saveData(newData);
  };

  const updateStreak = (newData) => {
    const today = new Date().toDateString();
    const lastCheckIn = newData.profile.lastCheckIn ? new Date(newData.profile.lastCheckIn).toDateString() : null;
    
    if (lastCheckIn === today) return;
    
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastCheckIn === yesterday || lastCheckIn === null) {
      newData.profile.streakCount += 1;
    } else {
      newData.profile.streakCount = 1;
    }
    newData.profile.lastCheckIn = new Date().toISOString();
  };

  const checkAchievements = (newData) => {
    const achievements = newData.profile.achievements;
    if (newData.profile.streakCount >= 7 && !achievements.includes('week')) {
      achievements.push('week');
    }
    if (newData.moods.length >= 30 && !achievements.includes('month')) {
      achievements.push('month');
    }
  };

  return { data, addMood, addGratitude, completeExercise, saveData };
};

// =============================================
// COMPONENTS
// =============================================

const WelcomeScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');

  const steps = [
    {
      title: 'Welcome to Bloom',
      subtitle: 'Your daily companion for mental wellness',
      content: 'Build tiny habits that help you flourish. Just 60 seconds a day.'
    },
    {
      title: 'Track Your Moods',
      subtitle: 'Understand your emotional patterns',
      content: 'Quick check-ins help you notice trends and triggers.'
    },
    {
      title: 'Practice Gratitude',
      subtitle: 'Rewire your brain for positivity',
      content: 'Three tiny wins each day shift your perspective.'
    },
    {
      title: 'Personalized Exercises',
      subtitle: 'Micro-interventions when you need them',
      content: 'Breathing, grounding, and reframing techniques tailored to you.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
        {step < steps.length ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                <Sprout className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{steps[step].title}</h1>
              <p className="text-lg text-green-600 font-medium">{steps[step].subtitle}</p>
            </div>
            <p className="text-gray-600 text-center mb-8 leading-relaxed">{steps[step].content}</p>
            <div className="flex gap-2 justify-center mb-6">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-green-500' : 'w-2 bg-gray-300'}`} />
              ))}
            </div>
            <button
              onClick={() => setStep(step + 1)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              {step === steps.length - 1 ? 'Get Started' : 'Continue'}
            </button>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">What should we call you?</h2>
              <p className="text-gray-600">Optional, but makes things personal</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:outline-none focus:border-green-500 transition-colors"
            />
            <button
              onClick={() => onComplete(name)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Start Blooming 🌱
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const MoodPicker = ({ onSelect }) => {
  const [selected, setSelected] = useState(null);
  const [reflection, setReflection] = useState('');
  const [showReflection, setShowReflection] = useState(false);

  const handleMoodClick = (mood) => {
    setSelected(mood);
    setShowReflection(true);
  };

  const handleSubmit = () => {
    onSelect(selected, reflection);
  };

  return (
    <div className="animate-fadeIn">
      {!showReflection ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">How are you feeling?</h2>
          <p className="text-gray-600 mb-6">Tap an emoji that matches your mood</p>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(MOODS).map(([key, { emoji, color, label }]) => (
              <button
                key={key}
                onClick={() => handleMoodClick(key)}
                className={`${color} border-2 rounded-2xl p-4 hover:scale-110 transition-all transform active:scale-95`}
              >
                <div className="text-4xl mb-2">{emoji}</div>
                <div className="text-xs font-medium text-gray-700">{label}</div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <div className="text-6xl mb-3 animate-bounce">{MOODS[selected].emoji}</div>
            <h3 className="text-xl font-semibold text-gray-800">Feeling {MOODS[selected].label}</h3>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Want to add a note? (Optional)
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors resize-none"
              rows="3"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowReflection(false)}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Continue
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const GratitudeJournal = ({ onComplete }) => {
  const [items, setItems] = useState(['', '', '']);

  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-2">
        <Heart className="w-6 h-6 text-pink-500" />
        <h2 className="text-2xl font-bold text-gray-800">Three Tiny Wins</h2>
      </div>
      <p className="text-gray-600 mb-6">What went well today, no matter how small?</p>
      
      {items.map((item, i) => (
        <div key={i} className="mb-4">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={`Win #${i + 1}`}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-400 transition-colors"
          />
        </div>
      ))}

      <button
        onClick={() => onComplete(items.filter(i => i.trim()))}
        disabled={items.filter(i => i.trim()).length === 0}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Save Gratitudes
      </button>
    </div>
  );
};

const ExerciseView = ({ exercise, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const Icon = exercise.icon;

  const handleNext = () => {
    if (currentStep < exercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRate = (rating) => {
    onComplete(exercise.id, rating);
  };

  if (isComplete) {
    return (
      <div className="text-center animate-fadeIn">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Well Done!</h3>
        <p className="text-gray-600 mb-6">How helpful was this exercise?</p>
        <div className="flex gap-2 justify-center mb-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRate(rating)}
              className="w-12 h-12 rounded-full border-2 border-yellow-400 hover:bg-yellow-100 transition-all transform hover:scale-110"
            >
              <Star className="w-6 h-6 text-yellow-500 mx-auto" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800">{exercise.title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{exercise.description}</p>
      
      <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
        <div className="text-sm text-purple-600 font-medium mb-2">Step {currentStep + 1} of {exercise.steps.length}</div>
        <p className="text-lg text-gray-800 font-medium">{exercise.steps[currentStep]}</p>
      </div>

      <div className="flex gap-2 mb-4">
        {exercise.steps.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= currentStep ? 'bg-purple-500' : 'bg-gray-200'}`} />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105"
      >
        {currentStep < exercise.steps.length - 1 ? 'Next Step' : 'Complete Exercise'}
      </button>
    </div>
  );
};

const HomeView = ({ data, onStartCheckIn }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const hasCheckedInToday = () => {
    if (!data.moods.length) return false;
    const lastMood = new Date(data.moods[0].timestamp);
    const today = new Date();
    return lastMood.toDateString() === today.toDateString();
  };

  const recommendExercise = () => {
    if (!data.moods.length) return EXERCISES.breathing;
    const recentMood = data.moods[0].mood;
    if (recentMood === 'anxious') return EXERCISES.breathing;
    if (recentMood === 'sad') return EXERCISES.gratitude;
    if (recentMood === 'angry') return EXERCISES.grounding;
    return EXERCISES.reframing;
  };

  const suggested = recommendExercise();
  const Icon = suggested.icon;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}{data.profile.name && `, ${data.profile.name}`}
            </h1>
            <p className="text-green-50">Let's check in with yourself</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Flame className="w-5 h-5" />
            <span className="text-xl font-bold">{data.profile.streakCount}</span>
          </div>
        </div>
      </div>

      {!hasCheckedInToday() && (
        <button
          onClick={onStartCheckIn}
          className="w-full bg-white border-2 border-green-500 hover:bg-green-50 rounded-2xl p-6 transition-all transform hover:scale-105 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Today's Check-in</h3>
              <p className="text-gray-600">How are you feeling right now?</p>
            </div>
            <div className="text-4xl">✨</div>
          </div>
        </button>
      )}

      <div className="bg-white rounded-2xl border-2 border-purple-200 p-6">
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-800">Suggested for You</h3>
        </div>
        <p className="text-gray-600 mb-4">{suggested.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{suggested.duration} seconds</span>
          <button className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all">
            Start
          </button>
        </div>
      </div>

      {data.gratitudes.length > 0 && (
        <div className="bg-pink-50 rounded-2xl border-2 border-pink-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Recent Gratitude
          </h3>
          <p className="text-gray-700 italic">"{data.gratitudes[0].items[0]}"</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(data.gratitudes[0].timestamp).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

const InsightsView = ({ data }) => {
  const getMoodCounts = () => {
    const counts = {};
    data.moods.forEach(m => {
      counts[m.mood] = (counts[m.mood] || 0) + 1;
    });
    return counts;
  };

  const getTopMood = () => {
    const counts = getMoodCounts();
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ['neutral', 0];
  };

  const [topMood, topCount] = getTopMood();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-800">Your Insights</h1>

      <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl p-6 text-white">
        <TrendingUp className="w-8 h-8 mb-3" />
        <h3 className="text-xl font-semibold mb-2">Mood Patterns</h3>
        <p className="text-blue-50">
          You've checked in {data.moods.length} times. 
          {topMood && ` Most common mood: ${MOODS[topMood].label} ${MOODS[topMood].emoji}`}
        </p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Mood Distribution</h3>
        {Object.entries(getMoodCounts()).map(([mood, count]) => (
          <div key={mood} className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-2">
                <span className="text-2xl">{MOODS[mood].emoji}</span>
                <span className="text-sm font-medium text-gray-700">{MOODS[mood].label}</span>
              </span>
              <span className="text-sm text-gray-500">{count}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(count / data.moods.length) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-pink-50 rounded-2xl border-2 border-pink-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Gratitude Journal
        </h3>
        <p className="text-gray-600 mb-4">{data.gratitudes.length} entries recorded</p>
        {data.gratitudes.slice(0, 3).map((g, i) => (
          <div key={g.id} className="mb-3 pb-3 border-b border-pink-100 last:border-0">
            <p className="text-sm text-gray-500 mb-1">
              {new Date(g.timestamp).toLocaleDateString()}
            </p>
            {g.items.map((item, j) => (
              <p key={j} className="text-gray-700">• {item}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const GardenView = ({ data }) => {
  const achievements = [
    { id: 'first', title: 'First Bloom', desc: 'Complete your first check-in', icon: '🌱', unlocked: data.moods.length >= 1 },
    { id: 'week', title: 'Week Warrior', desc: '7 day streak', icon: '🌿', unlocked: data.profile.streakCount >= 7 },
    { id: 'grateful', title: 'Grateful Heart', desc: '10 gratitude entries', icon: '💚', unlocked: data.gratitudes.length >= 10 },
    { id: 'month', title: 'Monthly Master', desc: '30 check-ins', icon: '🌳', unlocked: data.moods.length >= 30 },
    { id: 'zen', title: 'Zen Master', desc: 'Complete 20 exercises', icon: '🧘', unlocked: data.exercises.length >= 20 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Garden</h1>
        <p className="text-gray-600">Watch your garden grow with consistency</p>
      </div>

      <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-3xl p-8 min-h-64 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-green-800/20" />
        {data.profile.streakCount >= 1 && (
          <div className="absolute bottom-8 left-8 text-6xl animate-bounce">🌱</div>
        )}
        {data.profile.streakCount >= 3 && (
          <div className="absolute bottom-8 left-24 text-6xl animate-bounce" style={{animationDelay: '0.2s'}}>🌷</div>
        )}
        {data.profile.streakCount >= 7 && (
          <div className="absolute bottom-8 right-24 text-7xl animate-bounce" style={{animationDelay: '0.4s'}}>🌳</div>
        )}
        {data.profile.streakCount >= 14 && (
          <div className="absolute bottom-8 right-8 text-6xl animate-bounce" style={{animationDelay: '0.6s'}}>🌺</div>
        )}
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements
        </h3>
        <div className="space-y-3">
          {achievements.map((ach) => (
            <div key={ach.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              ach.unlocked ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-200 opacity-50'
            }`}>
              <div className="text-4xl">{ach.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{ach.title}</h4>
                <p className="text-sm text-gray-600">{ach.desc}</p>
              </div>
              {ach.unlocked && <Check className="w-6 h-6 text-green-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================
// MAIN APP
// =============================================

const App = () => {
  const storage = useStorage();
  const [view, setView] = useState('home');
  const [checkInFlow, setCheckInFlow] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (storage.data.moods.length > 0 || storage.data.profile.name) {
      setShowWelcome(false);
    }
  }, [storage.data]);

  const handleWelcomeComplete = (name) => {
    const newData = { ...storage.data };
    newData.profile.name = name;
    storage.saveData(newData);
    setShowWelcome(false);
  };

  const startCheckIn = () => {
    setCheckInFlow('mood');
  };

  const handleMoodComplete = (mood, reflection) => {
    storage.addMood(mood, reflection);
    setCheckInFlow('gratitude');
  };

  const handleGratitudeComplete = (items) => {
    if (items.length > 0) {
      storage.addGratitude(items);
    }
    setCheckInFlow('exercise');
  };

  const handleExerciseComplete = (exerciseType, helpfulness) => {
    storage.completeExercise(exerciseType, helpfulness);
    setCheckInFlow('celebration');
  };

  const handleCelebrationComplete = () => {
    setCheckInFlow(null);
    setView('home');
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  const recommendExercise = () => {
    if (!storage.data.moods.length) return EXERCISES.breathing;
    const recentMood = storage.data.moods[0].mood;
    if (recentMood === 'anxious') return EXERCISES.breathing;
    if (recentMood === 'sad') return EXERCISES.gratitude;
    if (recentMood === 'angry') return EXERCISES.grounding;
    return EXERCISES.reframing;
  };

  return (
    <DataContext.Provider value={storage}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-md mx-auto min-h-screen flex flex-col">
          {/* Main Content */}
          <div className="flex-1 p-6 pb-24">
            {checkInFlow === 'mood' && (
              <MoodPicker onSelect={handleMoodComplete} />
            )}
            {checkInFlow === 'gratitude' && (
              <GratitudeJournal onComplete={handleGratitudeComplete} />
            )}
            {checkInFlow === 'exercise' && (
              <ExerciseView exercise={recommendExercise()} onComplete={handleExerciseComplete} />
            )}
            {checkInFlow === 'celebration' && (
              <div className="text-center animate-fadeIn">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full mb-6 animate-bounce">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Amazing! 🎉</h2>
                <p className="text-lg text-gray-600 mb-2">You completed today's check-in!</p>
                <p className="text-gray-500 mb-8">
                  Streak: {storage.data.profile.streakCount} {storage.data.profile.streakCount === 1 ? 'day' : 'days'}
                </p>
                <button
                  onClick={handleCelebrationComplete}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  View My Garden
                </button>
              </div>
            )}
            {!checkInFlow && view === 'home' && (
              <HomeView data={storage.data} onStartCheckIn={startCheckIn} />
            )}
            {!checkInFlow && view === 'insights' && (
              <InsightsView data={storage.data} />
            )}
            {!checkInFlow && view === 'garden' && (
              <GardenView data={storage.data} />
            )}
          </div>

          {/* Bottom Navigation */}
          {!checkInFlow && (
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-6 py-4 max-w-md mx-auto">
              <div className="flex justify-around items-center">
                <button
                  onClick={() => setView('home')}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    view === 'home' ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <Calendar className="w-6 h-6" />
                  <span className="text-xs font-medium">Today</span>
                </button>
                <button
                  onClick={() => setView('insights')}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    view === 'insights' ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-xs font-medium">Insights</span>
                </button>
                <button
                  onClick={() => setView('garden')}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    view === 'garden' ? 'text-purple-600' : 'text-gray-400'
                  }`}
                >
                  <Sprout className="w-6 h-6" />
                  <span className="text-xs font-medium">Garden</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </DataContext.Provider>
  );
};

export default App;