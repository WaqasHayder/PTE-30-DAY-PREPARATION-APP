import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Target, CheckCircle, Plus, CreditCard as Edit3, Trash2, Bell } from 'lucide-react';

interface StudySession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  tasks: string[];
  completed: boolean;
  notes: string;
}

interface StudyPlannerProps {
  dailyHours: number;
  targetScore: number;
}

export default function StudyPlanner({ dailyHours, targetScore }: StudyPlannerProps) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showAddSession, setShowAddSession] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // Load saved sessions
    const saved = localStorage.getItem('studySessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    } else {
      generateWeeklyPlan();
    }
  }, []);

  useEffect(() => {
    // Save sessions whenever they change
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  }, [sessions]);

  const generateWeeklyPlan = () => {
    const newSessions: StudySession[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Morning session
      if (dailyHours >= 2) {
        newSessions.push({
          id: `morning-${dateStr}`,
          date: dateStr,
          startTime: '08:00',
          endTime: dailyHours >= 3 ? '10:00' : '09:30',
          tasks: ['Read Aloud', 'Repeat Sentence', 'Describe Image'],
          completed: false,
          notes: ''
        });
      }
      
      // Evening session
      newSessions.push({
        id: `evening-${dateStr}`,
        date: dateStr,
        startTime: dailyHours >= 3 ? '19:00' : '20:00',
        endTime: dailyHours >= 3 ? '21:00' : '21:30',
        tasks: ['Summarize Written Text', 'Write Essay', 'Mock Test Practice'],
        completed: false,
        notes: ''
      });
    }
    
    setSessions(newSessions);
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: `${session.date}-${session.startTime}-${Date.now()}`
    };
    setSessions([...sessions, newSession]);
    setShowAddSession(false);
  };

  const updateSession = (updatedSession: StudySession) => {
    setSessions(sessions.map(s => s.id === updatedSession.id ? updatedSession : s));
    setEditingSession(null);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const toggleSessionComplete = (sessionId: string) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, completed: !s.completed } : s
    ));
  };

  const getSessionsForDate = (date: string) => {
    return sessions.filter(s => s.date === date).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const todaySessions = getSessionsForDate(new Date().toISOString().split('T')[0]);
  const completedToday = todaySessions.filter(s => s.completed).length;
  const totalToday = todaySessions.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
            Study Planner
          </h2>
          <button
            onClick={() => setShowAddSession(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Session</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{completedToday}/{totalToday}</div>
            <div className="text-sm text-blue-800">Today's Sessions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{dailyHours}h</div>
            <div className="text-sm text-green-800">Daily Target</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{targetScore}+</div>
            <div className="text-sm text-purple-800">Target Score</div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const daySessions = getSessionsForDate(dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const completedSessions = daySessions.filter(s => s.completed).length;
            
            return (
              <div
                key={dateStr}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  isToday ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedDate(dateStr)}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-bold mb-2 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {daySessions.map((session, idx) => (
                      <div
                        key={session.id}
                        className={`text-xs px-2 py-1 rounded ${
                          session.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {session.startTime}
                      </div>
                    ))}
                  </div>
                  {daySessions.length > 0 && (
                    <div className="text-xs text-gray-500 mt-2">
                      {completedSessions}/{daySessions.length}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Sessions for {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        <div className="space-y-4">
          {getSessionsForDate(selectedDate).map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border transition-colors ${
                session.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      onClick={() => toggleSessionComplete(session.id)}
                      className={`p-1 rounded-full ${
                        session.completed 
                          ? 'text-green-600 hover:text-green-700' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-2">
                      {session.tasks.map((task, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                        >
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {session.notes && (
                    <p className="text-sm text-gray-600">{session.notes}</p>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingSession(session)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {getSessionsForDate(selectedDate).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No study sessions planned for this date.</p>
              <button
                onClick={() => setShowAddSession(true)}
                className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Add a session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Session Modal */}
      {(showAddSession || editingSession) && (
        <SessionModal
          session={editingSession}
          selectedDate={selectedDate}
          onSave={editingSession ? updateSession : addSession}
          onClose={() => {
            setShowAddSession(false);
            setEditingSession(null);
          }}
        />
      )}
    </div>
  );
}

interface SessionModalProps {
  session?: StudySession | null;
  selectedDate: string;
  onSave: (session: StudySession | Omit<StudySession, 'id'>) => void;
  onClose: () => void;
}

function SessionModal({ session, selectedDate, onSave, onClose }: SessionModalProps) {
  const [formData, setFormData] = useState({
    date: session?.date || selectedDate,
    startTime: session?.startTime || '09:00',
    endTime: session?.endTime || '10:00',
    tasks: session?.tasks || [],
    notes: session?.notes || ''
  });

  const availableTasks = [
    'Read Aloud', 'Repeat Sentence', 'Describe Image', 'Re-tell Lecture',
    'Answer Short Question', 'Summarize Written Text', 'Write Essay',
    'Multiple Choice Reading', 'Fill in Blanks', 'Summarize Spoken Text',
    'Write from Dictation', 'Mock Test Practice', 'Vocabulary Review',
    'Grammar Practice', 'Pronunciation Training'
  ];

  const handleTaskToggle = (task: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.includes(task)
        ? prev.tasks.filter(t => t !== task)
        : [...prev.tasks, task]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session) {
      onSave({ ...session, ...formData });
    } else {
      onSave({ ...formData, completed: false });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {session ? 'Edit Study Session' : 'Add Study Session'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasks</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {availableTasks.map((task) => (
                <label key={task} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.tasks.includes(task)}
                    onChange={() => handleTaskToggle(task)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">{task}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any notes or specific goals for this session..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {session ? 'Update Session' : 'Add Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}