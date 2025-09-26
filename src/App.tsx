import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Clock, User, ChevronRight, Star, TrendingUp, CheckCircle, Award, Calendar, Brain, Zap } from 'lucide-react';
import OnboardingSection from './components/OnboardingSection';
import Dashboard from './components/Dashboard';
import TaskGuide from './components/TaskGuide';
import ProgressTracker from './components/ProgressTracker';
import QuickReference from './components/QuickReference';
import MockTest from './components/MockTest';
import StudyPlanner from './components/StudyPlanner';
import VocabularyBuilder from './components/VocabularyBuilder';
import NotificationSystem from './components/NotificationSystem';

export interface StudentProfile {
  targetScore: number;
  dailyHours: number;
  currentLevel: string;
  startDate: string;
  completed: boolean;
}

export interface TaskData {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  section: 'speaking' | 'writing' | 'reading' | 'listening';
  dailyTarget: number;
  completed: number;
  description: string;
  scoringCriteria: string[];
  commonMistakes: string[];
  tips: string[];
}

function App() {
  const [currentSection, setCurrentSection] = useState<string>('onboarding');
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);

  useEffect(() => {
    // Load saved profile
    const saved = localStorage.getItem('pteProfile');
    if (saved) {
      const profile = JSON.parse(saved);
      setStudentProfile(profile);
      if (profile.completed) {
        setCurrentSection('dashboard');
      }
    }
  }, []);

  const completeOnboarding = (profile: StudentProfile) => {
    const completedProfile = { ...profile, completed: true };
    setStudentProfile(completedProfile);
    localStorage.setItem('pteProfile', JSON.stringify(completedProfile));
    setCurrentSection('dashboard');
    initializeTasks(profile);
  };

  const resetProgress = () => {
    localStorage.removeItem('pteProfile');
    setStudentProfile(null);
    setCurrentSection('onboarding');
    setTasks([]);
  };

  const initializeTasks = (profile: StudentProfile) => {
    const baseMultiplier = profile.targetScore >= 70 ? 1.5 : 1;
    const hourMultiplier = profile.dailyHours >= 3 ? 1.2 : profile.dailyHours >= 2 ? 1 : 0.8;
    
    const taskList: TaskData[] = [
      // Speaking Tasks (High Priority)
      {
        id: 'repeat-sentence',
        name: 'Repeat Sentence',
        priority: 'high',
        section: 'speaking',
        dailyTarget: Math.round(15 * baseMultiplier * hourMultiplier),
        completed: 0,
        description: 'Listen to a sentence and repeat it exactly as heard',
        scoringCriteria: ['Content (3 points)', 'Oral Fluency (5 points)', 'Pronunciation (5 points)'],
        commonMistakes: ['Missing words', 'Adding extra words', 'Wrong pronunciation', 'Hesitation'],
        tips: ['Practice shadowing technique', 'Focus on rhythm and stress', 'Record yourself daily']
      },
      {
        id: 'describe-image',
        name: 'Describe Image',
        priority: 'high',
        section: 'speaking',
        dailyTarget: Math.round(8 * baseMultiplier * hourMultiplier),
        completed: 0,
        description: 'Describe an image in detail within 40 seconds',
        scoringCriteria: ['Content (5 points)', 'Oral Fluency (5 points)', 'Pronunciation (5 points)'],
        commonMistakes: ['Going off-topic', 'Long pauses', 'Repetitive language', 'Poor structure'],
        tips: ['Use template structure', 'Practice describing daily objects', 'Time management crucial']
      },
      {
        id: 'read-aloud',
        name: 'Read Aloud',
        priority: 'high',
        section: 'speaking',
        dailyTarget: Math.round(12 * baseMultiplier * hourMultiplier),
        completed: 0,
        description: 'Read a text passage aloud with proper pronunciation and fluency',
        scoringCriteria: ['Content (5 points)', 'Oral Fluency (5 points)', 'Pronunciation (5 points)'],
        commonMistakes: ['Mispronunciation', 'Wrong stress patterns', 'Poor chunking', 'Monotone delivery'],
        tips: ['Practice chunking phrases', 'Mark stress patterns', 'Record and compare']
      },
      // Writing Tasks (High Priority)
      {
        id: 'summarize-written-text',
        name: 'Summarize Written Text',
        priority: 'high',
        section: 'writing',
        dailyTarget: Math.round(3 * baseMultiplier),
        completed: 0,
        description: 'Summarize a passage in one sentence (5-75 words)',
        scoringCriteria: ['Content (2 points)', 'Form (1 point)', 'Grammar (2 points)', 'Vocabulary (2 points)'],
        commonMistakes: ['Exceeding word limit', 'Multiple sentences', 'Missing key points', 'Grammar errors'],
        tips: ['Identify main idea first', 'Use connecting words', 'Check word count']
      },
      {
        id: 'write-essay',
        name: 'Write Essay',
        priority: 'medium',
        section: 'writing',
        dailyTarget: Math.round(2 * baseMultiplier),
        completed: 0,
        description: 'Write a 200-300 word essay on given topic',
        scoringCriteria: ['Content (3 points)', 'Form (2 points)', 'Development (2 points)', 'Structure (2 points)', 'Vocabulary (2 points)', 'Language Use (2 points)', 'Grammar (2 points)'],
        commonMistakes: ['Poor structure', 'Off-topic content', 'Grammar mistakes', 'Word count issues'],
        tips: ['Use essay template', 'Plan before writing', 'Check grammar']
      },
      // Reading Tasks
      {
        id: 'reading-writing-blanks',
        name: 'Reading & Writing: Fill Blanks',
        priority: 'high',
        section: 'reading',
        dailyTarget: Math.round(5 * baseMultiplier),
        completed: 0,
        description: 'Fill in missing words in a text passage',
        scoringCriteria: ['Reading (1 point per blank)', 'Writing (1 point per blank)'],
        commonMistakes: ['Not reading context', 'Grammar mismatches', 'Spelling errors'],
        tips: ['Read full text first', 'Check grammar fit', 'Build vocabulary']
      },
      // Listening Tasks (High Priority)
      {
        id: 'summarize-spoken-text',
        name: 'Summarize Spoken Text',
        priority: 'high',
        section: 'listening',
        dailyTarget: Math.round(3 * baseMultiplier),
        completed: 0,
        description: 'Listen to audio and write 50-70 word summary',
        scoringCriteria: ['Content (2 points)', 'Form (2 points)', 'Grammar (2 points)', 'Vocabulary (2 points)', 'Spelling (2 points)'],
        commonMistakes: ['Missing key points', 'Word count issues', 'Poor note-taking', 'Spelling errors'],
        tips: ['Practice shorthand notes', 'Focus on main ideas', 'Use template phrases']
      },
      {
        id: 'write-from-dictation',
        name: 'Write From Dictation',
        priority: 'high',
        section: 'listening',
        dailyTarget: Math.round(10 * baseMultiplier * hourMultiplier),
        completed: 0,
        description: 'Type exactly what you hear',
        scoringCriteria: ['Listening (1 point per word)', 'Writing (1 point per word)'],
        commonMistakes: ['Missing words', 'Spelling errors', 'Wrong word forms'],
        tips: ['Practice spelling', 'Listen for function words', 'Type as you hear']
      }
    ];

    setTasks(taskList);
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'tasks', label: 'Task Guide', icon: BookOpen },
    { id: 'planner', label: 'Study Plan', icon: Calendar },
    { id: 'vocabulary', label: 'Vocabulary', icon: Brain },
    { id: 'progress', label: 'Progress', icon: Target },
    { id: 'reference', label: 'Quick Ref', icon: Brain },
    { id: 'mock', label: 'Mock Test', icon: Award }
  ];

  if (!studentProfile || !studentProfile.completed) {
    return <OnboardingSection onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PTE Academic AI Tutor</h1>
                <p className="text-sm text-gray-500">2025 Updated • Premium Guide</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Target: {studentProfile.targetScore}+</div>
                <div className="text-xs text-gray-500">{studentProfile.dailyHours}h daily</div>
              </div>
              <NotificationSystem studentProfile={studentProfile} tasks={tasks} />
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Day {Math.ceil((Date.now() - new Date(studentProfile.startDate).getTime()) / (1000 * 60 * 60 * 24))} of 30
              </div>
              <button
                onClick={resetProgress}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-full">
        {/* Sidebar */}
        <nav className="bg-white shadow-sm w-64 min-h-screen border-r border-gray-200">
          <div className="p-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentSection === item.id
                        ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Progress Summary */}
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-gray-900 mb-3">Today's Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tasks Complete</span>
                  <span className="font-medium text-indigo-600">
                    {tasks.filter(t => t.completed >= t.dailyTarget).length}/{tasks.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${tasks.length > 0 ? (tasks.filter(t => t.completed >= t.dailyTarget).length / tasks.length) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentSection === 'dashboard' && <Dashboard studentProfile={studentProfile} tasks={tasks} />}
            {currentSection === 'tasks' && <TaskGuide tasks={tasks} setTasks={setTasks} />}
            {currentSection === 'planner' && <StudyPlanner dailyHours={studentProfile.dailyHours} targetScore={studentProfile.targetScore} />}
            {currentSection === 'vocabulary' && <VocabularyBuilder />}
            {currentSection === 'progress' && <ProgressTracker studentProfile={studentProfile} tasks={tasks} />}
            {currentSection === 'reference' && <QuickReference />}
            {currentSection === 'mock' && <MockTest studentProfile={studentProfile} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;