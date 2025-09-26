import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Clock, Mic, Volume2, FileText, Headphones, X } from 'lucide-react';

interface PracticeSessionProps {
  taskType: string;
  onComplete: (score: number) => void;
  onClose: () => void;
}

export default function PracticeSession({ taskType, onComplete, onClose }: PracticeSessionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userResponse, setUserResponse] = useState('');
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'recording' | 'completed'>('preparation');
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setTimeLeft(getPreparationTime());
  }, [taskType]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0 && (currentPhase === 'preparation' || currentPhase === 'recording')) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            if (currentPhase === 'preparation') {
              setCurrentPhase('recording');
              return getRecordingTime();
            } else {
              handleAutoComplete();
              return 0;
            }
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft, currentPhase]);

  const getRecordingTime = () => {
    switch (taskType) {
      case 'read-aloud': return 40;
      case 'repeat-sentence': return 15;
      case 'describe-image': return 40;
      case 'retell-lecture': return 40;
      case 'answer-short-question': return 10;
      case 'summarize-written-text': return 600; // 10 minutes
      case 'write-essay': return 1200; // 20 minutes
      case 'summarize-spoken-text': return 600; // 10 minutes
      case 'write-from-dictation': return 30;
      default: return 40;
    }
  };

  const getPreparationTime = () => {
    switch (taskType) {
      case 'read-aloud': return 30;
      case 'repeat-sentence': return 3;
      case 'describe-image': return 25;
      case 'retell-lecture': return 10;
      case 'answer-short-question': return 3;
      case 'summarize-written-text': return 0;
      case 'write-essay': return 0;
      case 'summarize-spoken-text': return 0;
      case 'write-from-dictation': return 7;
      default: return 30;
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setCurrentPhase('recording');
    setTimeLeft(getRecordingTime());
  };

  const handleAutoComplete = () => {
    setIsRecording(false);
    setCurrentPhase('completed');
    calculateScore();
  };

  const stopRecording = () => {
    setIsRecording(false);
    setCurrentPhase('completed');
    calculateScore();
  };

  const calculateScore = () => {
    // Simulate AI scoring based on task type and response
    let baseScore = 60;
    
    // Adjust based on task type difficulty
    const taskMultipliers = {
      'read-aloud': 1.1,
      'repeat-sentence': 1.2,
      'describe-image': 0.9,
      'retell-lecture': 0.8,
      'answer-short-question': 1.3,
      'summarize-written-text': 0.9,
      'write-essay': 0.8,
      'summarize-spoken-text': 0.85,
      'write-from-dictation': 1.15
    };

    // Adjust based on response quality (simulated)
    const responseQuality = userResponse.length > 0 ? 
      Math.min(1.2, userResponse.length / 100) : 
      Math.random() * 0.8 + 0.6;

    const finalScore = Math.round(baseScore * (taskMultipliers[taskType as keyof typeof taskMultipliers] || 1) * responseQuality);
    const clampedScore = Math.max(30, Math.min(90, finalScore));
    
    setScore(clampedScore);
    setTimeout(() => onComplete(clampedScore), 2000);
  };

  const resetSession = () => {
    setCurrentPhase('preparation');
    setTimeLeft(getPreparationTime());
    setIsRecording(false);
    setUserResponse('');
    setAudioPlayed(false);
    setScore(null);
  };

  const playAudio = () => {
    setIsPlaying(true);
    setAudioPlayed(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const getSampleContent = () => {
    const contents = {
      'read-aloud': "Climate change represents one of the most significant challenges facing humanity in the twenty-first century. Rising global temperatures, caused primarily by increased greenhouse gas emissions, are leading to more frequent extreme weather events, rising sea levels, and disruptions to ecosystems worldwide.",
      'repeat-sentence': "The university library will be closed for renovations during the summer break.",
      'describe-image': "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
      'retell-lecture': "Today we'll discuss the impact of artificial intelligence on modern education systems. AI has revolutionized how students learn and how teachers deliver content.",
      'answer-short-question': "What do you call the person who cuts hair professionally?",
      'summarize-written-text': "Artificial intelligence has become increasingly prevalent in modern society, transforming industries from healthcare to finance. Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy. However, this technological advancement also raises important questions about privacy, employment, and the ethical implications of automated decision-making. As AI continues to evolve, it is crucial that we develop appropriate frameworks to ensure its benefits are maximized while minimizing potential risks.",
      'write-essay': "Some people believe that social media has a positive impact on society, while others argue it has negative effects. Discuss both views and give your opinion.",
      'summarize-spoken-text': "In today's lecture, we explored the fascinating world of renewable energy sources. Solar power has emerged as one of the most promising alternatives to fossil fuels, with technological advances making it increasingly cost-effective. Wind energy is another rapidly growing sector, particularly in coastal regions where wind patterns are consistent. The transition to renewable energy is not just an environmental imperative but also an economic opportunity, creating millions of jobs worldwide.",
      'write-from-dictation': "The research findings were published in the latest scientific journal."
    };
    return contents[taskType as keyof typeof contents] || "Sample content for practice session.";
  };

  const getTaskIcon = () => {
    const icons = {
      'read-aloud': FileText,
      'repeat-sentence': Volume2,
      'describe-image': Mic,
      'retell-lecture': Headphones,
      'answer-short-question': Mic,
      'summarize-written-text': FileText,
      'write-essay': FileText,
      'summarize-spoken-text': Headphones,
      'write-from-dictation': Headphones
    };
    const Icon = icons[taskType as keyof typeof icons] || Mic;
    return <Icon className="h-6 w-6" />;
  };

  const isWritingTask = ['summarize-written-text', 'write-essay', 'summarize-spoken-text', 'write-from-dictation'].includes(taskType);
  const isListeningTask = ['repeat-sentence', 'retell-lecture', 'summarize-spoken-text', 'write-from-dictation', 'answer-short-question'].includes(taskType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {getTaskIcon()}
              <div>
                <h2 className="text-2xl font-bold capitalize">{taskType.replace('-', ' ')}</h2>
                <p className="text-indigo-100">Practice Session</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold">{timeLeft}s</div>
                <div className="text-sm text-indigo-100 capitalize">{currentPhase}</div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentPhase === 'preparation' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Preparation Phase</h3>
                <p className="text-blue-800 mb-4">
                  {getPreparationTime() > 0 
                    ? "Use this time to read and understand the content. Recording will start automatically."
                    : "Get ready! Recording will start immediately."
                  }
                </p>
                
                {taskType === 'describe-image' ? (
                  <div className="bg-white p-4 rounded-lg border">
                    <img 
                      src={getSampleContent()} 
                      alt="Practice image" 
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                  </div>
                ) : isListeningTask ? (
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <button
                      onClick={playAudio}
                      disabled={isPlaying}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto ${
                        isPlaying 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Volume2 className="h-5 w-5" />
                      <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
                    </button>
                    {audioPlayed && (
                      <p className="text-sm text-gray-600 mt-2">Audio: "{getSampleContent()}"</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-lg border font-mono text-gray-800 text-sm leading-relaxed">
                    {getSampleContent()}
                  </div>
                )}
              </div>

              {getPreparationTime() > 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={startRecording}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Mic className="h-5 w-5" />
                    <span>Start Recording Early</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {currentPhase === 'recording' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <h3 className="font-semibold text-red-900">
                    {isWritingTask ? 'Writing in Progress' : 'Recording in Progress'}
                  </h3>
                </div>
                
                {isWritingTask ? (
                  <div>
                    {taskType === 'summarize-written-text' && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm">
                        <strong>Passage:</strong> {getSampleContent()}
                      </div>
                    )}
                    <textarea
                      value={userResponse}
                      onChange={(e) => setUserResponse(e.target.value)}
                      placeholder={
                        taskType === 'summarize-written-text' 
                          ? "Write your summary in one sentence (5-75 words)..."
                          : taskType === 'write-essay'
                          ? "Write your essay here (200-300 words)..."
                          : taskType === 'summarize-spoken-text'
                          ? "Write your summary here (50-70 words)..."
                          : "Type what you heard..."
                      }
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>Words: {userResponse.split(' ').filter(word => word.length > 0).length}</span>
                      <span>Characters: {userResponse.length}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic className="h-12 w-12 text-red-600" />
                    </div>
                    <p className="text-red-800">Speak clearly into your microphone</p>
                    <div className="mt-4 flex justify-center">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-8 bg-red-400 rounded animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={stopRecording}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Pause className="h-5 w-5" />
                  <span>Stop {isWritingTask ? 'Writing' : 'Recording'}</span>
                </button>
                <button
                  onClick={resetSession}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          )}

          {currentPhase === 'completed' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-900 mb-2">Session Complete!</h3>
                <p className="text-green-800 mb-4">Your response has been recorded and scored.</p>
                
                {score && (
                  <div className="bg-white p-4 rounded-lg border border-green-200 inline-block">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">{score}</div>
                    <div className="text-sm text-gray-600">Estimated Score</div>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetSession}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Practice Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="px-8 pb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                currentPhase === 'preparation' ? 'bg-blue-500' :
                currentPhase === 'recording' ? 'bg-red-500' :
                'bg-green-500'
              }`}
              style={{ 
                width: `${currentPhase === 'completed' ? 100 : 
                  ((currentPhase === 'preparation' ? getPreparationTime() : getRecordingTime()) - timeLeft) / 
                  (currentPhase === 'preparation' ? getPreparationTime() : getRecordingTime()) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}