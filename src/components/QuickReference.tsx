import React, { useState } from 'react';
import { BookOpen, FileText, Mic, Headphones, Copy, Check, Brain, Clock, Star, Target } from 'lucide-react';
import ScoreCalculator from './ScoreCalculator';

export default function QuickReference() {
  const [copiedText, setCopiedText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'templates' | 'notes' | 'vocabulary' | 'timing'>('templates');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const templates = {
    essay: `Introduction:
The topic of [TOPIC] has become increasingly important in today's society. While some argue that [VIEWPOINT A], others believe that [VIEWPOINT B]. This essay will examine both perspectives before presenting my own opinion.

Body Paragraph 1:
On one hand, [SUPPORTING ARGUMENT 1]. For instance, [SPECIFIC EXAMPLE]. This demonstrates that [EXPLANATION].

Body Paragraph 2:
On the other hand, [OPPOSING ARGUMENT]. Evidence for this can be seen in [EXAMPLE]. This clearly shows that [EXPLANATION].

Conclusion:
In conclusion, while both viewpoints have merit, I believe that [YOUR OPINION] because [BRIEF REASON]. Moving forward, it is essential that [FUTURE RECOMMENDATION].`,

    summarizeWritten: `The passage discusses [MAIN TOPIC], explaining that [KEY POINT 1] and [KEY POINT 2], which leads to [CONCLUSION/RESULT].`,

    describeImage: `This [TYPE OF IMAGE] shows/depicts [MAIN SUBJECT]. In the foreground, we can see [DETAILS]. The background contains [BACKGROUND ELEMENTS]. The image suggests/indicates [INTERPRETATION]. Overall, this illustrates [MAIN MESSAGE].`,

    retellLecture: `The lecture discusses [MAIN TOPIC]. The speaker explains that [KEY POINT 1]. Additionally, [KEY POINT 2] is mentioned. The speaker also states that [KEY POINT 3]. In conclusion, [FINAL POINT/SUMMARY].`,

    summarizeSpoken: `The speaker discusses [MAIN TOPIC], stating that [KEY POINT 1] and [KEY POINT 2], concluding that [MAIN CONCLUSION].`
  };

  const vocabularyPhrases = {
    introduction: [
      "The topic of... has become increasingly important",
      "This issue has gained significant attention",
      "There is ongoing debate about...",
      "It is widely acknowledged that..."
    ],
    connecting: [
      "Furthermore", "Moreover", "In addition", "Additionally",
      "However", "Nevertheless", "On the other hand", "Conversely",
      "Therefore", "Consequently", "As a result", "Thus"
    ],
    conclusion: [
      "In conclusion", "To summarize", "Overall", "In summary",
      "Taking everything into consideration",
      "All things considered"
    ],
    opinion: [
      "I believe that", "In my opinion", "From my perspective",
      "It seems to me that", "I would argue that"
    ]
  };

  const noteTakingSymbols = [
    { symbol: "↑", meaning: "increase, rise, go up" },
    { symbol: "↓", meaning: "decrease, fall, go down" },
    { symbol: "→", meaning: "leads to, results in, causes" },
    { symbol: "←", meaning: "comes from, is caused by" },
    { symbol: "=", meaning: "equals, is the same as" },
    { symbol: "≠", meaning: "not equal, different from" },
    { symbol: ">", meaning: "greater than, more than" },
    { symbol: "<", meaning: "less than, fewer than" },
    { symbol: "&", meaning: "and" },
    { symbol: "w/", meaning: "with" },
    { symbol: "w/o", meaning: "without" },
    { symbol: "b/c", meaning: "because" },
    { symbol: "diff", meaning: "different" },
    { symbol: "imp", meaning: "important" }
  ];

  const timingGuide = [
    { task: "Read Aloud", time: "30-40 seconds", preparation: "30-40 seconds", tip: "Practice chunking and rhythm" },
    { task: "Repeat Sentence", time: "15 seconds", preparation: "3 seconds", tip: "Focus on exact reproduction" },
    { task: "Describe Image", time: "40 seconds", preparation: "25 seconds", tip: "Use template structure" },
    { task: "Re-tell Lecture", time: "40 seconds", preparation: "10 seconds", tip: "Take quick notes" },
    { task: "Answer Short Question", time: "10 seconds", preparation: "3 seconds", tip: "Answer immediately" },
    { task: "Summarize Written Text", time: "10 minutes", preparation: "N/A", tip: "One sentence, 5-75 words" },
    { task: "Write Essay", time: "20 minutes", preparation: "N/A", tip: "Plan 2-3 min, write 15 min, check 2 min" },
    { task: "Multiple Choice (Reading)", time: "Varies", preparation: "N/A", tip: "Skim first, then read carefully" },
    { task: "Fill in Blanks (R&W)", time: "Varies", preparation: "N/A", tip: "Read context, check grammar" },
    { task: "Summarize Spoken Text", time: "10 minutes", preparation: "N/A", tip: "Take notes, 50-70 words" },
    { task: "Write from Dictation", time: "Varies", preparation: "7 seconds", tip: "Type as you hear" }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Brain className="h-7 w-7 text-indigo-600 mr-3" />
          Quick Reference Guide
        </h1>
        <p className="text-gray-600">
          Essential templates, vocabulary, and strategies for PTE Academic success. Copy and customize these resources for your practice.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'notes', label: 'Note Taking', icon: BookOpen },
              { id: 'vocabulary', label: 'Vocabulary', icon: Star },
              { id: 'timing', label: 'Timing Guide', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2025 Updated Templates</h2>
              
              {Object.entries(templates).map(([key, template]) => (
                <div key={key} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 capitalize flex items-center">
                      {key === 'essay' && <FileText className="h-4 w-4 mr-2 text-purple-600" />}
                      {key === 'summarizeWritten' && <Target className="h-4 w-4 mr-2 text-blue-600" />}
                      {key === 'describeImage' && <Mic className="h-4 w-4 mr-2 text-green-600" />}
                      {key === 'retellLecture' && <Headphones className="h-4 w-4 mr-2 text-orange-600" />}
                      {key === 'summarizeSpoken' && <Headphones className="h-4 w-4 mr-2 text-red-600" />}
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(template, key)}
                      className="flex items-center space-x-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      {copiedText === key ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded-lg overflow-x-auto">
                      {template}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note Taking Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shorthand Note-Taking System</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Quick Note-Taking Strategy
                </h3>
                <div className="text-blue-800 text-sm space-y-2">
                  <p>• Listen for key words and main ideas</p>
                  <p>• Use symbols and abbreviations (see below)</p>
                  <p>• Write horizontally, not vertically</p>
                  <p>• Skip articles (a, an, the) and prepositions</p>
                  <p>• Focus on nouns, verbs, and adjectives</p>
                  <p>• Number your points (1, 2, 3...)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Common Symbols</h3>
                  <div className="space-y-2">
                    {noteTakingSymbols.map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-mono text-lg font-bold text-indigo-600">{item.symbol}</span>
                        <span className="text-sm text-gray-700 text-right flex-1 ml-4">{item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Practice Example</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Audio: "Climate change is causing temperatures to rise globally, which leads to melting ice caps and rising sea levels."</div>
                    <div className="font-mono text-sm text-indigo-600 bg-white p-2 rounded border">
                      Climate change → temp ↑ globally<br/>
                      → melting ice caps<br/>
                      → sea levels ↑
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vocabulary Tab */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Vocabulary & Phrases</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(vocabularyPhrases).map(([category, phrases]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900 capitalize flex items-center">
                        <Star className="h-4 w-4 mr-2 text-amber-500" />
                        {category} Phrases
                      </h3>
                      <button
                        onClick={() => copyToClipboard(phrases.join('\n'), category)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        {copiedText === category ? 'Copied!' : 'Copy All'}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {phrases.map((phrase, index) => (
                        <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700">
                          {phrase}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-semibold text-amber-800 mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Power Words for High Scores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-amber-800 mb-2">Analysis Words</div>
                    <div className="text-amber-700 space-y-1">
                      <div>analyze, evaluate, assess</div>
                      <div>demonstrate, illustrate</div>
                      <div>significant, substantial</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-amber-800 mb-2">Academic Words</div>
                    <div className="text-amber-700 space-y-1">
                      <div>comprehensive, extensive</div>
                      <div>fundamental, essential</div>
                      <div>implications, consequences</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-amber-800 mb-2">Advanced Connectors</div>
                    <div className="text-amber-700 space-y-1">
                      <div>Furthermore, Moreover</div>
                      <div>Nevertheless, Nonetheless</div>
                      <div>Consequently, Subsequently</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timing Guide Tab */}
          {activeTab === 'timing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">PTE 2025 Timing Guide</h2>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Time Management Strategy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-green-800">
                    <div className="font-medium mb-1">Before Speaking</div>
                    <div>Use prep time to plan structure and key points</div>
                  </div>
                  <div className="text-green-800">
                    <div className="font-medium mb-1">During Tasks</div>
                    <div>Stick to time limits, finish strong even if incomplete</div>
                  </div>
                  <div className="text-green-800">
                    <div className="font-medium mb-1">For Writing</div>
                    <div>Plan (2 min) → Write (15-16 min) → Review (2-3 min)</div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Task</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Speaking/Writing Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Prep Time</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Key Tip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timingGuide.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-200">{item.task}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">{item.time}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">{item.preparation}</td>
                        <td className="px-4 py-3 text-sm text-indigo-600 border-b border-gray-200">{item.tip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Critical Time Management Tips
                </h3>
                <div className="space-y-2 text-red-800 text-sm">
                  <p>• Never leave any task completely blank - partial credit is better than zero</p>
                  <p>• For Repeat Sentence: If you miss the beginning, focus on the ending</p>
                  <p>• In Reading: If time is running out, educated guessing is better than no answer</p>
                  <p>• Write from Dictation: Type as you hear, don't wait for the full sentence</p>
                  <p>• Speaking tasks: Keep talking until the progress bar ends</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Score Calculator */}
      <ScoreCalculator targetScore={70} />
    </div>
  );
}