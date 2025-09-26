import React from 'react';
import { Calendar, Target, Clock, TrendingUp, CheckCircle, AlertCircle, BookOpen, Award, Zap, Star, Bell, Users } from 'lucide-react';
import { StudentProfile, TaskData } from '../App';
import StudyTimer from './StudyTimer';

interface DashboardProps {
  studentProfile: StudentProfile;
  tasks: TaskData[];
}

export default function Dashboard({ studentProfile, tasks }: DashboardProps) {
  const startDate = new Date(studentProfile.startDate);
  const currentDay = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.max(0, 30 - currentDay + 1);
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'high');
  const completedHighPriority = highPriorityTasks.filter(t => t.completed >= t.dailyTarget);
  const todayProgress = tasks.length > 0 ? (tasks.filter(t => t.completed >= t.dailyTarget).length / tasks.length) * 100 : 0;

  const handleStudySessionComplete = () => {
    // You could track study sessions here
    console.log('Study session completed!');
  };

  const getWeekPhase = (day: number) => {
    if (day <= 7) return { phase: 'Foundation', color: 'blue', description: 'Learning format & templates' };
    if (day <= 14) return { phase: 'Accuracy', color: 'green', description: 'Grammar, fluency & vocabulary' };
    if (day <= 21) return { phase: 'Timing', color: 'yellow', description: 'Exam simulation & speed' };
    return { phase: 'Polishing', color: 'purple', description: 'Mock tests & fine-tuning' };
  };

  const currentPhase = getWeekPhase(currentDay);

  const getDailySchedule = () => {
    const schedule = [
      { time: '0-30 min', task: 'Warm-up: Read Aloud practice', priority: 'high' },
      { time: '30-60 min', task: 'Repeat Sentence intensive', priority: 'high' },
      { time: '60-90 min', task: 'Writing: Summarize Written Text', priority: 'high' },
      { time: '90-120 min', task: 'Listening: Write from Dictation', priority: 'high' },
      { time: '120+ min', task: 'Review & Additional practice', priority: 'medium' }
    ];
    return schedule.slice(0, Math.max(2, studentProfile.dailyHours * 2));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 🚀</h1>
            <p className="text-indigo-100 text-lg mb-4">
              Day {currentDay} of your PTE journey • {remainingDays} days to go
            </p>
            <div className="flex items-center space-x-6">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <div className="text-sm text-indigo-100">Current Phase</div>
                <div className="font-bold text-lg">{currentPhase.phase} Week</div>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <div className="text-sm text-indigo-100">Target Score</div>
                <div className="font-bold text-lg">{studentProfile.targetScore}+</div>
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <div className="text-sm text-indigo-100">Daily Hours</div>
                <div className="font-bold text-lg">{studentProfile.dailyHours}h</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-4xl font-bold">{Math.round(todayProgress)}%</div>
              <div className="text-sm text-indigo-100">Today's Progress</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Focus */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="h-6 w-6 text-indigo-600 mr-2" />
              Today's Focus - {currentPhase.phase} Phase
            </h2>
            <p className="text-gray-600 mb-6">{currentPhase.description}</p>
            
            <div className="space-y-4">
              {getDailySchedule().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                      {item.time}
                    </div>
                    <span className="font-medium text-gray-900">{item.task}</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    item.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.priority.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Priority Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Zap className="h-5 w-5 text-red-500 mr-2" />
              High Priority Tasks (Daily Targets)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highPriorityTasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    {task.completed >= task.dailyTarget ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress: {task.completed}/{task.dailyTarget}</span>
                    <span className="capitalize">{task.section}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (task.completed / task.dailyTarget) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Study Timer */}
          <StudyTimer 
            targetMinutes={studentProfile.dailyHours * 30} 
            onSessionComplete={handleStudySessionComplete}
          />
          
          {/* Weekly Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              Weekly Milestones
            </h3>
            <div className="space-y-4">
              {[
                { week: 1, phase: 'Foundation', target: 'Learn all task formats', achieved: currentDay > 7 },
                { week: 2, phase: 'Accuracy', target: 'Achieve 60+ in speaking', achieved: currentDay > 14 },
                { week: 3, phase: 'Timing', target: 'Complete full mock test', achieved: currentDay > 21 },
                { week: 4, phase: 'Polishing', target: 'Consistent 65+ scores', achieved: currentDay > 28 }
              ].map((milestone) => (
                <div key={milestone.week} className={`p-3 rounded-lg ${
                  milestone.achieved ? 'bg-green-50 border border-green-200' : 
                  currentDay > (milestone.week - 1) * 7 && currentDay <= milestone.week * 7 ? 'bg-blue-50 border border-blue-200' :
                  'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Week {milestone.week}: {milestone.phase}</span>
                    {milestone.achieved && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{milestone.target}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 text-purple-500 mr-2" />
              Your Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-bold text-indigo-600">{Math.round(todayProgress)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">High Priority Complete</span>
                <span className="font-bold text-green-600">{completedHighPriority.length}/{highPriorityTasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Study Streak</span>
                <span className="font-bold text-purple-600">{Math.min(currentDay, 7)} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Est. Current Score</span>
                <span className="font-bold text-blue-600">{45 + Math.round(todayProgress * 0.25 * currentDay)}+</span>
              </div>
            </div>
          </div>
          
          {/* Study Reminders */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Today's Reminders
            </h3>
            <div className="space-y-2 text-amber-700 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Complete morning speaking practice (8:00 AM)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Review vocabulary cards (2:00 PM)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Evening writing practice (7:00 PM)</span>
              </div>
            </div>
          </div>
          
          {/* Community Features */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Study Community
            </h3>
            <div className="space-y-3 text-purple-700 text-sm">
              <div className="flex justify-between items-center">
                <span>Active learners today</span>
                <span className="font-bold">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Your study rank</span>
                <span className="font-bold">#156</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Study streak</span>
                <span className="font-bold">{Math.min(currentDay, 7)} days</span>
              </div>
            </div>
          </div>

          {/* Motivation */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
            <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Daily Motivation
            </h3>
            <p className="text-amber-700 text-sm mb-3">
              "Success in PTE comes from consistent daily practice. Every task you complete brings you closer to your target!"
            </p>
            <div className="text-xs text-amber-600 font-medium">
              💪 You've got this! Keep up the momentum!
            </div>
          </div>
        </div>
      </div>

      {/* PTE 2025 Updates Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          PTE Academic 2025 Updates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">New Task Types:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Summarize Group Discussion (Speaking)</li>
              <li>• Respond to a Situation (Speaking)</li>
              <li>• Enhanced AI scoring for pronunciation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Timing Changes:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Speaking: 54-67 minutes (updated)</li>
              <li>• Writing: 29-30 minutes (optimized)</li>
              <li>• Reading: 29-30 minutes (streamlined)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}