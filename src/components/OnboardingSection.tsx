import React, { useState } from 'react';
import { Target, Clock, User, ChevronRight, Star, BookOpen, Award } from 'lucide-react';
import { StudentProfile } from '../App';

interface OnboardingSectionProps {
  onComplete: (profile: StudentProfile) => void;
}

export default function OnboardingSection({ onComplete }: OnboardingSectionProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState({
    targetScore: 65,
    dailyHours: 2,
    currentLevel: 'intermediate'
  });

  const handleComplete = () => {
    const studentProfile: StudentProfile = {
      ...profile,
      startDate: new Date().toISOString(),
      completed: false
    };
    onComplete(studentProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <BookOpen className="h-12 w-12 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Premium PTE Academic AI Tutor
            </h1>
            <p className="text-xl text-indigo-100 mb-4">
              Achieve 65-75+ Score in 30 Days • 2025 Updated Format
            </p>
            <div className="flex justify-center space-x-8 text-indigo-100">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Personalized Study Plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>AI-Powered Guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Proven Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Progress Indicator */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600">Step {currentStep} of 3</span>
            </div>
          </div>

          <div className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Target className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">What's your target PTE score?</h2>
                  <p className="text-gray-600 mt-2">We'll customize your study plan based on your goal</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { score: 65, label: 'Good Score', desc: 'Most universities accept this' },
                    { score: 70, label: 'High Score', desc: 'Competitive for top universities' },
                    { score: 75, label: 'Excellent', desc: 'Elite universities & immigration' }
                  ].map((option) => (
                    <button
                      key={option.score}
                      onClick={() => setProfile({...profile, targetScore: option.score})}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        profile.targetScore === option.score
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-3xl font-bold text-indigo-600 mb-2">{option.score}+</div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">How many hours can you study daily?</h2>
                  <p className="text-gray-600 mt-2">Be realistic - consistency matters more than intensity</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { hours: 1, label: '1 Hour', desc: 'Quick daily practice' },
                    { hours: 2, label: '2 Hours', desc: 'Balanced approach' },
                    { hours: 3, label: '3 Hours', desc: 'Intensive preparation' },
                    { hours: 4, label: '4+ Hours', desc: 'Maximum intensity' }
                  ].map((option) => (
                    <button
                      key={option.hours}
                      onClick={() => setProfile({...profile, dailyHours: option.hours})}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        profile.dailyHours === option.hours
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-2xl font-bold text-indigo-600 mb-2">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <User className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">What's your current English level?</h2>
                  <p className="text-gray-600 mt-2">This helps us adjust task difficulty and pace</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { level: 'beginner', label: 'Beginner', desc: 'Basic English skills', score: '40-55 PTE' },
                    { level: 'intermediate', label: 'Intermediate', desc: 'Good foundation', score: '56-70 PTE' },
                    { level: 'advanced', label: 'Advanced', desc: 'Strong English skills', score: '71+ PTE' }
                  ].map((option) => (
                    <button
                      key={option.level}
                      onClick={() => setProfile({...profile, currentLevel: option.level})}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        profile.currentLevel === option.level
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="font-bold text-indigo-600 mb-2">{option.label}</div>
                      <div className="text-sm text-gray-900 mb-1">{option.desc}</div>
                      <div className="text-xs text-gray-600">{option.score}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-colors flex items-center space-x-2"
                >
                  <span>Start Your Journey</span>
                  <Star className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}