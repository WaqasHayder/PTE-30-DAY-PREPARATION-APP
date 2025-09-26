import React, { useState } from 'react';
import { Calculator, Target, TrendingUp, AlertCircle } from 'lucide-react';

interface ScoreCalculatorProps {
  targetScore: number;
}

export default function ScoreCalculator({ targetScore }: ScoreCalculatorProps) {
  const [scores, setScores] = useState({
    speaking: 65,
    writing: 65,
    reading: 65,
    listening: 65
  });

  const overallScore = Math.round((scores.speaking + scores.writing + scores.reading + scores.listening) / 4);
  
  const getScoreColor = (score: number) => {
    if (score >= targetScore) return 'text-green-600 bg-green-100';
    if (score >= targetScore - 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendations = () => {
    const weakAreas = Object.entries(scores)
      .filter(([_, score]) => score < targetScore)
      .sort(([_, a], [__, b]) => a - b);

    if (weakAreas.length === 0) {
      return "Excellent! You're meeting your target in all areas. Focus on consistency.";
    }

    const weakestArea = weakAreas[0][0];
    const recommendations = {
      speaking: "Focus on pronunciation, fluency, and using templates for Describe Image and Retell Lecture.",
      writing: "Improve grammar, vocabulary range, and essay structure. Practice Summarize Written Text daily.",
      reading: "Work on reading speed, vocabulary, and Fill in the Blanks accuracy.",
      listening: "Practice note-taking, focus on Write from Dictation, and improve Summarize Spoken Text."
    };

    return recommendations[weakestArea as keyof typeof recommendations];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Calculator className="h-5 w-5 text-indigo-600 mr-2" />
        Score Calculator
      </h3>

      <div className="space-y-4 mb-6">
        {Object.entries(scores).map(([skill, score]) => (
          <div key={skill} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 capitalize">
                {skill}
              </label>
              <span className="text-sm font-bold text-gray-900">{score}</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              value={score}
              onChange={(e) => setScores({...scores, [skill]: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">Overall Score</span>
          <div className={`px-4 py-2 rounded-lg text-xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Target: {targetScore} | Gap: {Math.max(0, targetScore - overallScore)} points
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-blue-900 mb-1">Recommendation</div>
              <div className="text-sm text-blue-800">{getRecommendations()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}