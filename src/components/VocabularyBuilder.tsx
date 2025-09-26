import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Brain, CheckCircle, RotateCcw, Volume2, Eye, EyeOff } from 'lucide-react';

interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  example: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learned: boolean;
  reviewCount: number;
  lastReviewed: string;
}

export default function VocabularyBuilder() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [currentWord, setCurrentWord] = useState<VocabularyWord | null>(null);
  const [showDefinition, setShowDefinition] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [studyMode, setStudyMode] = useState<'learn' | 'review' | 'test'>('learn');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    initializeVocabulary();
  }, []);

  const initializeVocabulary = () => {
    const vocabularyData: VocabularyWord[] = [
      // Academic Words
      {
        id: '1',
        word: 'analyze',
        definition: 'to examine something in detail to understand it better',
        example: 'Scientists analyze data to draw conclusions about climate change.',
        category: 'Academic',
        difficulty: 'intermediate',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      {
        id: '2',
        word: 'comprehensive',
        definition: 'complete and including everything that is necessary',
        example: 'The report provides a comprehensive overview of the situation.',
        category: 'Academic',
        difficulty: 'advanced',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      {
        id: '3',
        word: 'significant',
        definition: 'important or notable',
        example: 'There has been a significant improvement in air quality.',
        category: 'Academic',
        difficulty: 'intermediate',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      // Business Words
      {
        id: '4',
        word: 'collaborate',
        definition: 'to work together with others on a project',
        example: 'The teams will collaborate to develop the new product.',
        category: 'Business',
        difficulty: 'intermediate',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      {
        id: '5',
        word: 'innovative',
        definition: 'introducing new ideas or methods',
        example: 'The company is known for its innovative approach to technology.',
        category: 'Business',
        difficulty: 'intermediate',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      // Science Words
      {
        id: '6',
        word: 'hypothesis',
        definition: 'a proposed explanation for a phenomenon',
        example: 'The scientist tested her hypothesis through careful experimentation.',
        category: 'Science',
        difficulty: 'advanced',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      {
        id: '7',
        word: 'sustainable',
        definition: 'able to be maintained at a certain rate or level',
        example: 'We need to find sustainable solutions to environmental problems.',
        category: 'Science',
        difficulty: 'intermediate',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      // Technology Words
      {
        id: '8',
        word: 'algorithm',
        definition: 'a set of rules or instructions for solving a problem',
        example: 'The search engine uses a complex algorithm to rank results.',
        category: 'Technology',
        difficulty: 'advanced',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      {
        id: '9',
        word: 'interface',
        definition: 'a point where two systems meet and interact',
        example: 'The user interface is intuitive and easy to navigate.',
        category: 'Technology',
        difficulty: 'intermediate',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      },
      // Social Issues
      {
        id: '10',
        word: 'diversity',
        definition: 'the state of being diverse; variety',
        example: 'The company values diversity in its workforce.',
        category: 'Social',
        difficulty: 'intermediate',
        learned: false,
        reviewCount: 0,
        lastReviewed: ''
      }
    ];

    const saved = localStorage.getItem('vocabularyWords');
    if (saved) {
      setWords(JSON.parse(saved));
    } else {
      setWords(vocabularyData);
      localStorage.setItem('vocabularyWords', JSON.stringify(vocabularyData));
    }
  };

  useEffect(() => {
    localStorage.setItem('vocabularyWords', JSON.stringify(words));
  }, [words]);

  const getFilteredWords = () => {
    let filtered = words;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(word => word.category === selectedCategory);
    }
    
    if (studyMode === 'review') {
      filtered = filtered.filter(word => word.learned && word.reviewCount < 5);
    } else if (studyMode === 'learn') {
      filtered = filtered.filter(word => !word.learned);
    }
    
    return filtered;
  };

  const startStudySession = () => {
    const filtered = getFilteredWords();
    if (filtered.length > 0) {
      const randomWord = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentWord(randomWord);
      setShowDefinition(false);
      if (studyMode === 'test') {
        setTotalQuestions(totalQuestions + 1);
      }
    }
  };

  const markAsLearned = () => {
    if (currentWord) {
      setWords(words.map(word => 
        word.id === currentWord.id 
          ? { ...word, learned: true, lastReviewed: new Date().toISOString() }
          : word
      ));
      if (studyMode === 'test') {
        setScore(score + 1);
      }
      setTimeout(startStudySession, 1000);
    }
  };

  const markAsNeedReview = () => {
    if (currentWord) {
      setWords(words.map(word => 
        word.id === currentWord.id 
          ? { 
              ...word, 
              reviewCount: word.reviewCount + 1,
              lastReviewed: new Date().toISOString()
            }
          : word
      ));
      setTimeout(startStudySession, 1000);
    }
  };

  const resetProgress = () => {
    setWords(words.map(word => ({ 
      ...word, 
      learned: false, 
      reviewCount: 0, 
      lastReviewed: '' 
    })));
    setScore(0);
    setTotalQuestions(0);
    setCurrentWord(null);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const categories = ['all', ...Array.from(new Set(words.map(word => word.category)))];
  const filteredWords = getFilteredWords();
  const learnedCount = words.filter(word => word.learned).length;
  const totalWords = words.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
          Vocabulary Builder
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{learnedCount}</div>
            <div className="text-sm text-blue-800">Words Learned</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{totalWords - learnedCount}</div>
            <div className="text-sm text-green-800">To Learn</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round((learnedCount / totalWords) * 100)}%</div>
            <div className="text-sm text-purple-800">Progress</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-amber-600">{studyMode === 'test' && totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%</div>
            <div className="text-sm text-amber-800">Test Score</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Mode:</label>
            <select
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value as 'learn' | 'review' | 'test')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="learn">Learn New</option>
              <option value="review">Review</option>
              <option value="test">Test Mode</option>
            </select>
          </div>
          
          <button
            onClick={startStudySession}
            disabled={filteredWords.length === 0}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Start Session
          </button>
          
          <button
            onClick={resetProgress}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Study Card */}
      {currentWord ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <h3 className="text-4xl font-bold text-gray-900">{currentWord.word}</h3>
                <button
                  onClick={() => speakWord(currentWord.word)}
                  className="p-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentWord.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  currentWord.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentWord.difficulty}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentWord.category}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <button
                onClick={() => setShowDefinition(!showDefinition)}
                className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {showDefinition ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span>{showDefinition ? 'Hide' : 'Show'} Definition</span>
              </button>
            </div>

            {showDefinition && (
              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Definition</h4>
                  <p className="text-blue-800">{currentWord.definition}</p>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Example</h4>
                  <p className="text-green-800 italic">"{currentWord.example}"</p>
                  <button
                    onClick={() => speakWord(currentWord.example)}
                    className="mt-2 p-1 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={markAsNeedReview}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Need Review
              </button>
              <button
                onClick={markAsLearned}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Got It!</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Learn?</h3>
          <p className="text-gray-600 mb-6">
            {filteredWords.length === 0 
              ? `No words available for ${studyMode} mode in ${selectedCategory === 'all' ? 'any category' : selectedCategory}.`
              : 'Click "Start Session" to begin studying vocabulary words.'
            }
          </p>
          {filteredWords.length > 0 && (
            <button
              onClick={startStudySession}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Learning
            </button>
          )}
        </div>
      )}

      {/* Word List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Word List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {words.map((word) => (
            <div
              key={word.id}
              className={`p-4 rounded-lg border transition-colors ${
                word.learned 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{word.word}</h4>
                {word.learned && <CheckCircle className="h-5 w-5 text-green-600" />}
              </div>
              <p className="text-sm text-gray-600 mb-2">{word.definition}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{word.category}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  word.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  word.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {word.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}