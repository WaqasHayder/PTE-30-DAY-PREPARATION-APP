import React, { useState } from 'react';
import { Award, Clock, Target, TrendingUp, CheckCircle, AlertCircle, Calendar, BookOpen, Star, Play } from 'lucide-react';
import { StudentProfile } from '../App';
import MockTestInterface from './MockTestInterface';

interface MockTestProps {
  studentProfile: StudentProfile;
}

export default function MockTest({ studentProfile }: MockTestProps) {
  const [selectedMock, setSelectedMock] = useState<number | null>(null);
  const [showMockInterface, setShowMockInterface] = useState(false);
  const [testHistory, setTestHistory] = useState([
    { date: '2025-01-15', score: 58, speaking: 62, writing: 55, reading: 60, listening: 54 },
    { date: '2025-01-22', score: 63, speaking: 65, writing: 61, reading: 64, listening: 62 }
  ]);

  const handleMockTestComplete = (results: any) => {
    setTestHistory([...testHistory, results]);
    setShowMockInterface(false);
    setSelectedMock(null);
  };

  const startDate = new Date(studentProfile.startDate);
  const currentDay = Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const mockTests = [
    {
      id: 1,
      name: 'Diagnostic Mock Test',
      day: 1,
      description: 'Assess your starting level across all skills',
      duration: '3 hours',
      available: true,
      recommended: currentDay <= 3
    },
    {
      id: 2,
      name: 'Progress Check 1',
      day: 15,
      description: 'Mid-journey assessment focusing on accuracy',
      duration: '3 hours',
      available: currentDay >= 14,
      recommended: currentDay >= 14 && currentDay <= 17
    },
    {
      id: 3,
      name: 'Progress Check 2',
      day: 22,
      description: 'Test timing and exam simulation under pressure',
      duration: '3 hours',
      available: currentDay >= 21,
      recommended: currentDay >= 21 && currentDay <= 24
    },
    {
      id: 4,
      name: 'Final Practice Test',
      day: 27,
      description: 'Final confidence builder before your real exam',
      duration: '3 hours',
      available: currentDay >= 26,
      recommended: currentDay >= 26
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= studentProfile.targetScore) return 'text-green-600 bg-green-100';
    if (score >= studentProfile.targetScore - 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreImprovement = () => {
    if (testHistory.length < 2) return null;
    const latest = testHistory[testHistory.length - 1];
    const previous = testHistory[testHistory.length - 2];
    return latest.score - previous.score;
  };

  const improvement = getScoreImprovement();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Award className="h-7 w-7 text-indigo-600 mr-3" />
          Mock Tests & Performance Analysis
        </h1>
        <p className="text-gray-600">
          Track your progress with strategically timed mock tests and detailed performance analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mock Test Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
              Mock Test Schedule
            </h2>
            
            <div className="space-y-4">
              {mockTests.map((test) => (
                <div key={test.id} className={`border rounded-lg p-6 transition-all ${
                  test.recommended ? 'border-indigo-300 bg-indigo-50' :
                  test.available ? 'border-green-300 bg-green-50' :
                  'border-gray-200 bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                        {test.recommended && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                            RECOMMENDED
                          </span>
                        )}
                        {!test.available && (
                          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                            LOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{test.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{test.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>Day {test.day} recommended</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setSelectedMock(test.id)}
                      disabled={!test.available}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        test.available
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {test.available ? 'Start Test' : `Day ${test.day}`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Results Analysis */}
          {testHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                Performance History
              </h2>
              
              <div className="space-y-4">
                {testHistory.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-semibold text-gray-900">Mock Test {index + 1}</div>
                        <div className="text-sm text-gray-600">{result.date}</div>
                      </div>
                      <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${getScoreColor(result.score)}`}>
                        {result.score}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { skill: 'Speaking', score: result.speaking, color: 'blue' },
                        { skill: 'Writing', score: result.writing, color: 'purple' },
                        { skill: 'Reading', score: result.reading, color: 'green' },
                        { skill: 'Listening', score: result.listening, color: 'orange' }
                      ].map((skill) => (
                        <div key={skill.skill} className="text-center">
                          <div className="text-sm text-gray-600 mb-1">{skill.skill}</div>
                          <div className={`text-lg font-bold text-${skill.color}-600`}>
                            {skill.score}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              Your Progress
            </h3>
            
            {testHistory.length > 0 ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {testHistory[testHistory.length - 1].score}
                  </div>
                  <div className="text-sm text-gray-600">Latest Score</div>
                  {improvement !== null && (
                    <div className={`text-sm font-medium ${
                      improvement > 0 ? 'text-green-600' : improvement < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {improvement > 0 ? '+' : ''}{improvement} from last test
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target Score</span>
                    <span className="font-medium">{studentProfile.targetScore}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gap to Target</span>
                    <span className={`font-medium ${
                      testHistory[testHistory.length - 1].score >= studentProfile.targetScore
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {studentProfile.targetScore - testHistory[testHistory.length - 1].score} points
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tests Completed</span>
                    <span className="font-medium">{testHistory.length}/4</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Award className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <div className="text-sm">No tests completed yet</div>
                <div className="text-xs">Take your first mock test to track progress</div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Next Steps
            </h3>
            
            <div className="space-y-3 text-blue-800 text-sm">
              {currentDay <= 3 && (
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Take your diagnostic test to establish baseline</span>
                </div>
              )}
              
              {currentDay >= 14 && currentDay <= 17 && (
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Time for Progress Check 1 - assess your accuracy improvements</span>
                </div>
              )}
              
              {currentDay >= 21 && currentDay <= 24 && (
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Take Progress Check 2 to test your timing skills</span>
                </div>
              )}
              
              {currentDay >= 26 && (
                <div className="flex items-start space-x-2">
                  <Star className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Final practice test - build confidence for exam day!</span>
                </div>
              )}
              
              <div className="border-t border-blue-200 pt-3 mt-3">
                <div className="font-medium mb-2">Mock Test Strategy:</div>
                <div className="space-y-1 text-xs">
                  <div>• Simulate real exam conditions</div>
                  <div>• No breaks during sections</div>
                  <div>• Review immediately after</div>
                  <div>• Focus on weak areas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Prep Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Before Your Mock Test
            </h3>
            
            <div className="space-y-2 text-amber-800 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Ensure stable internet connection</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Use good quality headphones</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Find a quiet environment</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Keep water and snacks ready</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Review templates before starting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Test Modal (Placeholder) */}
      {selectedMock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Play className="h-6 w-6 text-indigo-600 mr-2" />
              Ready to Start Mock Test?
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-2">Test Instructions:</div>
                  <div className="space-y-1 text-xs">
                    <div>• Complete all sections without breaks</div>
                    <div>• Follow time limits strictly</div>
                    <div>• Simulate real exam conditions</div>
                    <div>• Take notes as needed</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-600">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <div className="font-medium">Total Duration: 3 hours</div>
                <div className="text-sm">Make sure you have enough time</div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedMock(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMockInterface(true);
                  setSelectedMock(null);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showMockInterface && (
        <MockTestInterface
          onComplete={handleMockTestComplete}
          onClose={() => setShowMockInterface(false)}
        />
      )}
    </div>
  );
}