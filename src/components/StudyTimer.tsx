import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, Target, CheckCircle } from 'lucide-react';

interface StudyTimerProps {
  targetMinutes: number;
  onSessionComplete: () => void;
}

export default function StudyTimer({ targetMinutes, onSessionComplete }: StudyTimerProps) {
  const [timeLeft, setTimeLeft] = useState(targetMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onSessionComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onSessionComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(targetMinutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const progress = ((targetMinutes * 60 - timeLeft) / (targetMinutes * 60)) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="mb-6">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className={`transition-all duration-1000 ${
                  isCompleted ? 'text-green-500' : 'text-indigo-600'
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {isCompleted ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <Clock className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-gray-600">
            {isCompleted ? 'Session Complete!' : `${targetMinutes} minute study session`}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            disabled={isCompleted}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isCompleted
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isRunning
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start</span>
              </>
            )}
          </button>
          
          <button
            onClick={resetTimer}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>

        {isCompleted && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-green-800 font-medium">Great job!</div>
            <div className="text-green-600 text-sm">You've completed your study session.</div>
          </div>
        )}
      </div>
    </div>
  );
}