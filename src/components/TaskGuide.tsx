import React, { useState } from 'react';
import { BookOpen, Target, AlertTriangle, Lightbulb, CheckCircle, Plus, Minus, Play, Clock, Star } from 'lucide-react';
import { TaskData } from '../App';
import PracticeSession from './PracticeSession';

interface TaskGuideProps {
  tasks: TaskData[];
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>;
}

export default function TaskGuide({ tasks, setTasks }: TaskGuideProps) {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(tasks[0] || null);
  const [filter, setFilter] = useState<string>('all');
  const [showPractice, setShowPractice] = useState(false);

  const updateTaskProgress = (taskId: string, increment: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: Math.max(0, task.completed + (increment ? 1 : -1)) }
          : task
      )
    );
    
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, completed: Math.max(0, prev.completed + (increment ? 1 : -1)) } : null);
    }
  };

  const handlePracticeComplete = (score: number) => {
    if (selectedTask) {
      updateTaskProgress(selectedTask.id, true);
      setShowPractice(false);
      // You could also store the score for analytics
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.priority === filter || t.section === filter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'speaking': return 'text-blue-600';
      case 'writing': return 'text-purple-600';
      case 'reading': return 'text-green-600';
      case 'listening': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-7 w-7 text-indigo-600 mr-3" />
          Task Guide & Practice Tracker
        </h1>
        <p className="text-gray-600">
          Master all PTE tasks with detailed guidance, practice tracking, and expert tips for 2025 format.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">All Tasks</h2>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1"
              >
                <option value="all">All Tasks</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
                <option value="speaking">Speaking</option>
                <option value="writing">Writing</option>
                <option value="reading">Reading</option>
                <option value="listening">Listening</option>
              </select>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedTask?.id === task.id 
                      ? 'border-indigo-300 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{task.name}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-medium capitalize ${getSectionColor(task.section)}`}>
                      {task.section}
                    </span>
                    <div className="flex items-center space-x-2">
                      {task.completed >= task.dailyTarget && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-xs text-gray-600">
                        {task.completed}/{task.dailyTarget}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-indigo-600 h-1 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (task.completed / task.dailyTarget) * 100)}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="lg:col-span-2">
          {selectedTask ? (
            <div className="space-y-6">
              {/* Task Header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTask.name}</h2>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className={`text-sm font-medium capitalize ${getSectionColor(selectedTask.section)}`}>
                        {selectedTask.section} Section
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{selectedTask.completed}/{selectedTask.dailyTarget}</div>
                    <div className="text-xs text-indigo-700 font-medium">Today's Progress</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{selectedTask.description}</p>

                {/* Practice Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => updateTaskProgress(selectedTask.id, false)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={selectedTask.completed === 0}
                  >
                    <Minus className="h-4 w-4" />
                    <span>Remove One</span>
                  </button>
                  
                  <button
                    onClick={() => updateTaskProgress(selectedTask.id, true)}
                    className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Mark Complete</span>
                  </button>
                  
                  <button
                    onClick={() => setShowPractice(true)}
                    className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    <span>Start Practice</span>
                  </button>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>~5 min per practice</span>
                  </div>
                </div>
              </div>

              {/* Scoring Criteria */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  Scoring Criteria (2025 Updated)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTask.scoringCriteria.map((criteria, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-green-800 font-medium">{criteria}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  Common Mistakes to Avoid
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTask.commonMistakes.map((mistake, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <span className="text-sm text-red-800">{mistake}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expert Tips */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="h-5 w-5 text-amber-600 mr-2" />
                  Expert Tips for Fast Improvement
                </h3>
                <div className="space-y-3">
                  {selectedTask.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <Star className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-amber-800 leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Drills */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                  <Play className="h-5 w-5 text-blue-600 mr-2" />
                  Daily Practice Drill Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="font-semibold text-blue-800 mb-2">Morning (10 min)</div>
                    <div className="text-blue-700">
                      Complete {Math.ceil(selectedTask.dailyTarget * 0.4)} practices<br/>
                      Focus on accuracy
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="font-semibold text-blue-800 mb-2">Afternoon (10 min)</div>
                    <div className="text-blue-700">
                      Complete {Math.ceil(selectedTask.dailyTarget * 0.4)} practices<br/>
                      Focus on speed
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="font-semibold text-blue-800 mb-2">Evening (5 min)</div>
                    <div className="text-blue-700">
                      Complete {Math.floor(selectedTask.dailyTarget * 0.2)} practices<br/>
                      Review mistakes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Task</h3>
              <p className="text-gray-600">Choose a task from the list to view detailed guidance and start practicing.</p>
            </div>
          )}
        </div>
      </div>
      
      {showPractice && selectedTask && (
        <PracticeSession
          taskType={selectedTask.id}
          onComplete={handlePracticeComplete}
          onClose={() => setShowPractice(false)}
        />
      )}
    </div>
  );
}