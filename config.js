// SEO Tools Suite Configuration
const config = {
  // Chatbot settings
  chatbot: {
    greeting: "Hello! I'm your SEO Assistant. How can I help you optimize your content today?",
    aiModel: "gpt-4", // Can be changed based on available models
    enabled: true
  },
  
  // API endpoints - Replace with actual endpoints in production
  apiEndpoints: {
    sentiment: 'https://api.example.com/sentiment',
    keywords: 'https://api.example.com/keywords',
    readability: 'https://api.example.com/readability',
    backlinks: 'https://api.example.com/backlinks',
    competitors: 'https://api.example.com/competitors'
  },
  
  // Tools settings
  tools: {
    htmlAnalyzer: {
      maxSize: 50000, // Maximum HTML size in characters
    },
    keywordDensity: {
      minWords: 100, // Minimum words needed for analysis
      maxKeywords: 15 // Maximum keywords to show in results
    },
    readability: {
      targetScore: 60, // Target Flesch reading ease score
      targetGrade: 8 // Target grade level
    },
    backlinkChecker: {
      maxBacklinks: 100, // Maximum backlinks to display
      maxReferringDomains: 50 // Maximum referring domains to display
    },
    competitorGap: {
      maxCompetitors: 3 // Maximum competitors to analyze at once
    }
  },
  
  // Chart colors - Simplified to one set
  chartColors: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderColor: 'rgba(74, 144, 226, 1)',
    accentColor: 'rgba(92, 184, 92, 0.6)',
    secondAccent: 'rgba(240, 173, 78, 0.6)',
    thirdAccent: 'rgba(217, 83, 79, 0.6)'
  }
};

export default config;
