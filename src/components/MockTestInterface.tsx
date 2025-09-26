import React, { useState, useEffect } from 'react';
import { Clock, Mic, Volume2, FileText, CheckCircle, AlertCircle, X, Play, Pause } from 'lucide-react';

interface MockTestInterfaceProps {
  onComplete: (results: any) => void;
  onClose: () => void;
}

export default function MockTestInterface({ onComplete, onClose }: MockTestInterfaceProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour for demo
  const [responses, setResponses] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [sectionScores, setSectionScores] = useState<number[]>([]);

  const sections = [
    {
      name: 'Speaking',
      duration: 3240, // 54 minutes
      tasks: [
        { name: 'Read Aloud', count: 6, timePerTask: 40, prepTime: 30 },
        { name: 'Repeat Sentence', count: 10, timePerTask: 15, prepTime: 3 },
        { name: 'Describe Image', count: 6, timePerTask: 40, prepTime: 25 },
        { name: 'Re-tell Lecture', count: 3, timePerTask: 40, prepTime: 10 },
        { name: 'Answer Short Question', count: 10, timePerTask: 10, prepTime: 3 }
      ]
    },
    {
      name: 'Writing',
      duration: 1800, // 30 minutes
      tasks: [
        { name: 'Summarize Written Text', count: 2, timePerTask: 600, prepTime: 0 },
        { name: 'Write Essay', count: 1, timePerTask: 1200, prepTime: 0 }
      ]
    },
    {
      name: 'Reading',
      duration: 1800, // 30 minutes
      tasks: [
        { name: 'Multiple Choice (Single)', count: 2, timePerTask: 120, prepTime: 0 },
        { name: 'Multiple Choice (Multiple)', count: 2, timePerTask: 120, prepTime: 0 },
        { name: 'Re-order Paragraphs', count: 2, timePerTask: 150, prepTime: 0 },
        { name: 'Fill in Blanks (Reading)', count: 4, timePerTask: 90, prepTime: 0 },
        { name: 'Fill in Blanks (R&W)', count: 5, timePerTask: 90, prepTime: 0 }
      ]
    },
    {
      name: 'Listening',
      duration: 2700, // 45 minutes
      tasks: [
        { name: 'Summarize Spoken Text', count: 2, timePerTask: 600, prepTime: 0 },
        { name: 'Multiple Choice (Single)', count: 2, timePerTask: 90, prepTime: 0 },
        { name: 'Fill in Blanks', count: 2, timePerTask: 60, prepTime: 0 },
        { name: 'Highlight Correct Summary', count: 2, timePerTask: 90, prepTime: 0 },
        { name: 'Multiple Choice (Multiple)', count: 2, timePerTask: 90, prepTime: 0 },
        { name: 'Select Missing Word', count: 2, timePerTask: 60, prepTime: 0 },
        { name: 'Highlight Incorrect Words', count: 2, timePerTask: 90, prepTime: 0 },
        { name: 'Write from Dictation', count: 3, timePerTask: 30, prepTime: 7 }
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTestComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTestComplete = () => {
    const speaking = Math.floor(Math.random() * 20) + 60;
    const writing = Math.floor(Math.random() * 20) + 60;
    const reading = Math.floor(Math.random() * 20) + 60;
    const listening = Math.floor(Math.random() * 20) + 60;
    const overall = Math.round((speaking + writing + reading + listening) / 4);

    const results = {
      overall,
      speaking,
      writing,
      reading,
      listening,
      date: new Date().toISOString().split('T')[0],
      duration: 3600 - timeLeft,
      completedTasks: responses.length
    };
    onComplete(results);
  };

  const nextTask = () => {
    // Save current response
    if (currentResponse.trim()) {
      setResponses([...responses, {
        section: currentSection,
        task: currentTask,
        question: currentQuestion,
        response: currentResponse,
        timestamp: Date.now()
      }]);
    }

    const currentSectionData = sections[currentSection];
    const currentTaskData = currentSectionData.tasks[currentTask];
    
    if (currentQuestion < currentTaskData.count - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentTask < currentSectionData.tasks.length - 1) {
      setCurrentTask(currentTask + 1);
      setCurrentQuestion(0);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentTask(0);
      setCurrentQuestion(0);
    } else {
      handleTestComplete();
    }
    
    setCurrentResponse('');
    setIsRecording(false);
  };

  const previousTask = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentTask > 0) {
      setCurrentTask(currentTask - 1);
      setCurrentQuestion(sections[currentSection].tasks[currentTask - 1].count - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      const prevSection = sections[currentSection - 1];
      setCurrentTask(prevSection.tasks.length - 1);
      setCurrentQuestion(prevSection.tasks[prevSection.tasks.length - 1].count - 1);
    }
    setCurrentResponse('');
    setIsRecording(false);
  };

  const currentSectionData = sections[currentSection];
  const currentTaskData = currentSectionData.tasks[currentTask];
  const totalProgress = ((currentSection * 25 + currentTask * 5 + currentQuestion + 1) / 100) * 100;

  const getSampleContent = () => {
    const contents = {
      'Read Aloud': "The rapid advancement of artificial intelligence has transformed numerous industries, creating both unprecedented opportunities and significant challenges for society.",
      'Repeat Sentence': "The university library will be closed for renovations during the summer break.",
      'Describe Image': "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600",
      'Re-tell Lecture': "Today's lecture focuses on renewable energy sources and their impact on global sustainability efforts.",
      'Answer Short Question': "What do you call the person who cuts hair professionally?",
      'Summarize Written Text': "Climate change represents one of the most pressing challenges of our time. Rising global temperatures are causing widespread environmental disruption, including more frequent extreme weather events, rising sea levels, and ecosystem changes. Scientists emphasize the urgent need for coordinated global action to reduce greenhouse gas emissions and implement sustainable practices across all sectors of society.",
      'Write Essay': "Some people believe that technology has made our lives easier, while others argue it has made them more complicated. Discuss both views and give your opinion.",
      'Multiple Choice (Single)': "According to the passage, what is the main cause of climate change?",
      'Multiple Choice (Multiple)': "Which of the following are mentioned as effects of climate change? (Select all that apply)",
      'Re-order Paragraphs': "Arrange the following sentences in the correct order:",
      'Fill in Blanks (Reading)': "The research _____ that regular exercise can _____ mental health significantly.",
      'Fill in Blanks (R&W)': "Scientists have _____ a new method for _____ renewable energy more efficiently.",
      'Summarize Spoken Text': "In today's presentation, we discussed the importance of biodiversity in maintaining ecological balance...",
      'Fill in Blanks': "The speaker mentioned that _____ is crucial for sustainable development.",
      'Highlight Correct Summary': "Choose the summary that best represents the main points of the lecture:",
      'Select Missing Word': "The final word in the sentence was _____.",
      'Highlight Incorrect Words': "Click on the words that do not match what you heard:",
      'Write from Dictation': "The research findings were published in the latest scientific journal."
    };
    return contents[currentTaskData.name as keyof typeof contents] || "Sample content for this task.";
  };

  const isWritingTask = ['Summarize Written Text', 'Write Essay', 'Summarize Spoken Text', 'Write from Dictation'].includes(currentTaskData.name);
  const isSpeakingTask = currentSectionData.name === 'Speaking';
  const isListeningTask = currentSectionData.name === 'Listening';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">PTE Academic Mock Test</h2>
              <p className="text-indigo-100">
                {currentSectionData.name} - {currentTaskData.name} ({currentQuestion + 1}/{currentTaskData.count})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
                <div className="text-sm text-indigo-100">Time Remaining</div>
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

        {/* Progress Bar */}
        <div className="bg-gray-100 px-6 py-3">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Section {currentSection + 1} of {sections.length}: {currentSectionData.name}</span>
            <span>{Math.round(totalProgress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Task Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                {isSpeakingTask && <Mic className="h-5 w-5 mr-2" />}
                {isWritingTask && <FileText className="h-5 w-5 mr-2" />}
                {isListeningTask && <Volume2 className="h-5 w-5 mr-2" />}
                {!isSpeakingTask && !isWritingTask && !isListeningTask && <FileText className="h-5 w-5 mr-2" />}
                {currentTaskData.name} Instructions
              </h3>
              <p className="text-blue-800 text-sm">
                {isSpeakingTask && 'Speak clearly into your microphone. Your response will be recorded.'}
                {isWritingTask && 'Type your response in the text area below. Check your grammar and spelling.'}
                {currentSectionData.name === 'Reading' && 'Read the passage carefully and select the correct answer(s).'}
                {isListeningTask && !isWritingTask && 'Listen carefully to the audio and select your answer.'}
              </p>
            </div>

            {/* Task Content */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              {currentTaskData.name === 'Describe Image' ? (
                <div className="text-center">
                  <img 
                    src={getSampleContent()} 
                    alt="Practice image" 
                    className="max-w-md mx-auto rounded-lg mb-4"
                  />
                  {isSpeakingTask && (
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`px-8 py-4 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto ${
                        isRecording 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Mic className="h-5 w-5" />
                      <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                    </button>
                  )}
                </div>
              ) : isWritingTask ? (
                <div>
                  {(currentTaskData.name === 'Summarize Written Text' || currentTaskData.name === 'Write Essay') && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {currentTaskData.name === 'Summarize Written Text' ? 'Passage:' : 'Topic:'}
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg text-sm">
                        {getSampleContent()}
                      </div>
                    </div>
                  )}
                  <textarea
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    placeholder={
                      currentTaskData.name === 'Summarize Written Text' 
                        ? "Write your summary in one sentence (5-75 words)..."
                        : currentTaskData.name === 'Write Essay'
                        ? "Write your essay here (200-300 words)..."
                        : currentTaskData.name === 'Summarize Spoken Text'
                        ? "Write your summary here (50-70 words)..."
                        : "Type what you heard..."
                    }
                    className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Words: {currentResponse.split(' ').filter(word => word.length > 0).length}</span>
                    <span>Characters: {currentResponse.length}</span>
                  </div>
                </div>
              ) : isSpeakingTask ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-lg font-medium text-gray-900 mb-4">
                      {currentTaskData.name === 'Read Aloud' && 'Read the following text aloud:'}
                      {currentTaskData.name === 'Repeat Sentence' && 'Listen and repeat the sentence:'}
                      {currentTaskData.name === 'Re-tell Lecture' && 'Listen to the lecture and retell it:'}
                      {currentTaskData.name === 'Answer Short Question' && 'Answer the following question:'}
                    </div>
                    {currentTaskData.name !== 'Repeat Sentence' && currentTaskData.name !== 'Re-tell Lecture' ? (
                      <div className="bg-gray-50 p-4 rounded-lg text-left">
                        {getSampleContent()}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <button
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                        >
                          <Volume2 className="h-5 w-5" />
                          <span>Play Audio</span>
                        </button>
                        <p className="text-sm text-gray-600 mt-2">Audio: "{getSampleContent()}"</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`px-8 py-4 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto ${
                      isRecording 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                    <span>{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <p className="text-gray-800 mb-4">
                      {getSampleContent()}
                    </p>
                  </div>
                  
                  {currentTaskData.name.includes('Multiple Choice') ? (
                    <div className="space-y-3">
                      {['Option A: First choice', 'Option B: Second choice', 'Option C: Third choice', 'Option D: Fourth choice'].map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input 
                            type={currentTaskData.name.includes('Multiple') ? 'checkbox' : 'radio'} 
                            name="answer" 
                            className="text-indigo-600" 
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : currentTaskData.name === 'Fill in Blanks (Reading)' || currentTaskData.name === 'Fill in Blanks (R&W)' ? (
                    <div className="space-y-4">
                      <p className="text-gray-800">
                        The research <select className="mx-2 p-1 border rounded">
                          <option>shows</option>
                          <option>demonstrates</option>
                          <option>indicates</option>
                        </select> that regular exercise can <select className="mx-2 p-1 border rounded">
                          <option>improve</option>
                          <option>enhance</option>
                          <option>boost</option>
                        </select> mental health significantly.
                      </p>
                    </div>
                  ) : (
                    <textarea
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      placeholder="Enter your response here..."
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={previousTask}
                disabled={currentSection === 0 && currentTask === 0 && currentQuestion === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentSection === 0 && currentTask === 0 && currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Exit Test
                </button>
                
                <button
                  onClick={nextTask}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {currentSection === sections.length - 1 && 
                   currentTask === currentSectionData.tasks.length - 1 && 
                   currentQuestion === currentTaskData.count - 1 ? 'Finish Test' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}