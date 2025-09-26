import React, { useState } from 'react';
import { TrendingUp, Calendar, Target, Award, BarChart3, CheckCircle, Clock, Star, Zap } from 'lucide-react';
import { StudentProfile, TaskData } from '../App';
import ScoreCalculator from './ScoreCalculator';

interface ProgressTrackerProps {
  studentProfile: StudentProfile;
  tasks: TaskData[];
}

export default function ProgressTracker({ studentProfile, tasks }: ProgressTrackerProps) {
  const [viewMode, setViewMode] = useState<'weekly' | 'daily' | 'task'>('weekly');
  
  const startDate = new Date(studentProfile.startDate);
  const currentDay = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalProgress = tasks.length > 0 ? (tasks.reduce((sum, task) => sum + task.completed, 0) / tasks.reduce((sum, task) => sum + task.dailyTarget, 0)) * 100 : 0;
  
  const getWeeklyProgress = () => {
    const weeks = [
      { week: 1, phase: 'Foundation', target: 75, current: currentDay > 7 ? 85 : Math.min(85, currentDay * 12) },
      { week: 2, phase: 'Accuracy', target: 80, current: currentDay > 14 ? 78 : currentDay > 7 ? Math.min(78, (currentDay - 7) * 11) : 0 },
      { week: 3, phase: 'Timing', target: 85, current: currentDay > 21 ? 82 : currentDay > 14 ? Math.min(82, (currentDay - 14) * 12) : 0 },
      { week: 4, phase: 'Polishing', target: 90, current: currentDay > 28 ? 88 : currentDay > 21 ? Math.min(88, (currentDay - 21) * 13) : 0 }
    ];
    return weeks;
  };

  const getEstimatedScore = () => {
    const base = studentProfile.currentLevel === 'advanced' ? 55 : 
                 studentProfile.currentLevel === 'intermediate' ? 45 : 35;
    const progressBonus = (totalProgress / 100) * 25;
    const dayBonus = Math.min(15, currentDay * 0.5);
    return Math.round(base + progressBonus + dayBonus);
  };

  const getSectionProgress = () => {
    const sections = ['speaking', 'writing', 'reading', 'listening'] as const;
    return sections.map(section => {
      const sectionTasks = tasks.filter(task => task.section === section);
      const completed = sectionTasks.reduce((sum, task) => sum + task.completed, 0);
      const target = sectionTasks.reduce((sum, task) => sum + task.dailyTarget, 0);
      return {
        section,
        progress: target > 0 ? (completed / target) * 100 : 0,
        completed,
        target
      };
    });
  };

  const weeklyProgress = getWeeklyProgress();
  const estimatedScore = getEstimatedScore();
  const sectionProgress = getSectionProgress();

  const getScoreColor = (score: number) => {
    if (score >= studentProfile.targetScore) return 'text-green-600 bg-green-100';
    if (score >= studentProfile.targetScore - 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              <TrendingUp className="h-7 w-7 text-indigo-600 mr-3" />
              Progress Tracker
            </h1>
            <p className="text-gray-600">Track your journey to PTE success with detailed analytics and insights.</p>
          </div>
          
          <div className="flex space-x-2">
            {[
              { mode: 'weekly', label: 'Weekly' },
              { mode: 'daily', label: 'Daily' },
              { mode: 'task', label: 'By Task' }
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Score Estimation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="mb-3">
            <div className={`inline-flex px-4 py-2 rounded-full text-2xl font-bold ${getScoreColor(estimatedScore)}`}>
              {estimatedScore}
            </div>
          </div>
          <div className="text-sm text-gray-600">Estimated Score</div>
          <div className="text-xs text-gray-500 mt-1">
            Target: {studentProfile.targetScore}+
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-2">{Math.round(totalProgress)}%</div>
          <div className="text-sm text-gray-600">Overall Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${Math.min(100, totalProgress)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{currentDay}</div>
          <div className="text-sm text-gray-600">Study Days</div>
          <div className="text-xs text-gray-500 mt-1">
            {30 - currentDay} days remaining
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {tasks.filter(t => t.completed >= t.dailyTarget).length}
          </div>
          <div className="text-sm text-gray-600">Tasks Completed Today</div>
          <div className="text-xs text-gray-500 mt-1">
            of {tasks.length} total tasks
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
                Weekly Progress Overview
              </h2>
              
              <div className="space-y-6">
                {weeklyProgress.map((week, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Week {week.week}: {week.phase}</h3>
                        <p className="text-sm text-gray-600">
                          {index === 0 && 'Learn format & templates'}
                          {index === 1 && 'Grammar, fluency & vocabulary'}
                          {index === 2 && 'Exam simulation & speed'}
                          {index === 3 && 'Mock tests & fine-tuning'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{Math.round(week.current)}%</div>
                        <div className="text-xs text-gray-500">Target: {week.target}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all ${
                              week.current >= week.target ? 'bg-green-500' : 
                              week.current >= week.target * 0.8 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, (week.current / week.target) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        {week.current >= week.target ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : currentDay > week.week * 7 ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Target className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Progress */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                Section Performance
              </h2>
              
              <div className="space-y-4">
                {sectionProgress.map((section) => (
                  <div key={section.section} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-900 capitalize">{section.section}</h3>
                      <span className="text-sm font-medium text-gray-600">
                        {section.completed}/{section.target}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          section.section === 'speaking' ? 'bg-blue-500' :
                          section.section === 'writing' ? 'bg-purple-500' :
                          section.section === 'reading' ? 'bg-green-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(100, section.progress)}%` }}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(section.progress)}% complete
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'task' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="h-6 w-6 text-indigo-600 mr-2" />
            Task-wise Progress
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900 text-sm">{task.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority.toUpperCase()}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{task.completed}/{task.dailyTarget}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (task.completed / task.dailyTarget) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{task.section}</span>
                  {task.completed >= task.dailyTarget && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Complete</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'daily' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-6 w-6 text-green-600 mr-2" />
            Daily Activity Log
          </h2>
          
          <div className="grid grid-cols-7 gap-4 mb-6">
            {Array.from({ length: Math.min(currentDay, 30) }, (_, i) => {
              const day = i + 1;
              const isToday = day === currentDay;
              const progress = Math.random() * 100; // Simulated progress
              
              return (
                <div key={day} className={`p-3 rounded-lg border text-center ${
                  isToday ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'
                }`}>
                  <div className="text-sm font-medium text-gray-900">Day {day}</div>
                  <div className={`text-xs mt-1 ${
                    progress >= 80 ? 'text-green-600' :
                    progress >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {Math.round(progress)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className={`h-1 rounded-full ${
                        progress >= 80 ? 'bg-green-500' :
                        progress >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Excellent (80%+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Good (60-79%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Needs Work (&lt;60%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Motivation Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-900">Keep Up the Great Work!</h3>
              <p className="text-purple-700 text-sm">
                You're {Math.round(totalProgress)}% towards your daily goal. 
                {totalProgress >= 80 ? ' Outstanding progress!' : 
                 totalProgress >= 60 ? ' You\'re doing well!' : 
                 ' Keep pushing forward!'}
              </p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Zap className="h-8 w-8 text-amber-500" />
          </div>
        </div>
      </div>
      
      {/* Score Calculator */}
      <ScoreCalculator targetScore={studentProfile.targetScore} />
    </div>
  );
}