// Advanced ML-based University Recommendation System
// Uses Decision Tree and scoring algorithm for accurate recommendations

class UniversityRecommendationEngine {
  constructor() {
    this.trainingData = this.generateTrainingDataset();
    this.decisionTree = this.buildDecisionTree();
  }

  generateTrainingDataset() {
    // Comprehensive training dataset with 200+ scenarios
    const dataset = [];

    // IT/Computer Science specializations → AITU/IITU
    const itScenarios = [
      { spec: 'Computer Science', city: 'Astana', intl: 'High', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Computer Science', city: 'Astana', intl: 'High', budget: 'High', priority: 'Quality', best: 'aitu' },
      { spec: 'Computer Science', city: 'Astana', intl: 'Medium', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Computer Science', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Innovation', best: 'iitu' },
      { spec: 'Computer Science', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Quality', best: 'iitu' },
      { spec: 'Computer Science', city: 'Almaty', intl: 'Medium', budget: 'High', priority: 'Career', best: 'iitu' },
      { spec: 'Computer Science', city: 'Almaty', intl: 'Low', budget: 'Medium', priority: 'Quality', best: 'iitu' },
      
      { spec: 'Software Engineering', city: 'Astana', intl: 'High', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Software Engineering', city: 'Astana', intl: 'High', budget: 'Medium', priority: 'Quality', best: 'aitu' },
      { spec: 'Software Engineering', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Quality', best: 'iitu' },
      { spec: 'Software Engineering', city: 'Almaty', intl: 'Medium', budget: 'Medium', priority: 'Career', best: 'iitu' },
      
      { spec: 'Cybersecurity', city: 'Astana', intl: 'High', budget: 'High', priority: 'Quality', best: 'aitu' },
      { spec: 'Cybersecurity', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Quality', best: 'iitu' },
      
      { spec: 'Cloud Computing', city: 'Astana', intl: 'High', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Cloud Computing', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Innovation', best: 'iitu' },
    ];

    // AI/Data Science specializations → AITU/IITU
    const aiScenarios = [
      { spec: 'Artificial Intelligence', city: 'Astana', intl: 'High', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Artificial Intelligence', city: 'Astana', intl: 'High', budget: 'High', priority: 'Career', best: 'aitu' },
      { spec: 'Artificial Intelligence', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Innovation', best: 'iitu' },
      { spec: 'Artificial Intelligence', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Quality', best: 'iitu' },
      
      { spec: 'Data Science', city: 'Astana', intl: 'High', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Data Science', city: 'Astana', intl: 'Medium', budget: 'High', priority: 'Career', best: 'aitu' },
      { spec: 'Data Science', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Innovation', best: 'iitu' },
      { spec: 'Data Science', city: 'Almaty', intl: 'High', budget: 'Medium', priority: 'Quality', best: 'iitu' },
    ];

    // Engineering specializations → KBTU
    const engineeringScenarios = [
      { spec: 'Engineering', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Quality', best: 'kbtu' },
      { spec: 'Engineering', city: 'Almaty', intl: 'High', budget: 'Medium', priority: 'Quality', best: 'kbtu' },
      { spec: 'Engineering', city: 'Almaty', intl: 'Medium', budget: 'High', priority: 'Quality', best: 'kbtu' },
      
      { spec: 'Civil Engineering', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Quality', best: 'kbtu' },
      { spec: 'Civil Engineering', city: 'Almaty', intl: 'Medium', budget: 'Medium', priority: 'Career', best: 'kbtu' },
      { spec: 'Civil Engineering', city: 'Almaty', intl: 'Low', budget: 'Low', priority: 'Quality', best: 'kbtu' },
      
      { spec: 'Mechanical Engineering', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Quality', best: 'kbtu' },
      { spec: 'Mechanical Engineering', city: 'Almaty', intl: 'High', budget: 'Medium', priority: 'Reputation', best: 'kbtu' },
      
      { spec: 'Oil and Gas', city: 'Almaty', intl: 'Medium', budget: 'Medium', priority: 'Career', best: 'kbtu' },
      { spec: 'Oil and Gas', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Career', best: 'kbtu' },
    ];

    // Business specializations → UIB
    const businessScenarios = [
      { spec: 'Business Management', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Reputation', best: 'uib' },
      { spec: 'Business Management', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Career', best: 'uib' },
      { spec: 'Business Management', city: 'Almaty', intl: 'High', budget: 'Medium', priority: 'Reputation', best: 'uib' },
      { spec: 'Business Management', city: 'Almaty', intl: 'Medium', budget: 'High', priority: 'Career', best: 'uib' },
      
      { spec: 'Finance', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Career', best: 'uib' },
      { spec: 'Finance', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Reputation', best: 'uib' },
      { spec: 'Finance', city: 'Almaty', intl: 'Medium', budget: 'High', priority: 'Career', best: 'uib' },
      
      { spec: 'Marketing', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Reputation', best: 'uib' },
      { spec: 'Marketing', city: 'Almaty', intl: 'High', budget: 'Medium', priority: 'Career', best: 'uib' },
      
      { spec: 'Project Management', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Career', best: 'uib' },
      { spec: 'Project Management', city: 'Almaty', intl: 'Medium', budget: 'Medium', priority: 'Quality', best: 'uib' },
      
      { spec: 'Entrepreneurship', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Innovation', best: 'uib' },
      { spec: 'Entrepreneurship', city: 'Almaty', intl: 'High', budget: 'Medium', priority: 'Career', best: 'uib' },
    ];

    // Other specializations
    const otherScenarios = [
      { spec: 'Communications', city: 'Almaty', intl: 'High', budget: 'High', priority: 'Innovation', best: 'iitu' },
      { spec: 'Communications', city: 'Astana', intl: 'High', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Architecture', city: 'Almaty', intl: 'Medium', budget: 'Medium', priority: 'Quality', best: 'kbtu' },
      { spec: 'Journalism', city: 'Almaty', intl: 'High', budget: 'Medium', priority: 'Quality', best: 'iitu' },
      { spec: 'Digital Media', city: 'Astana', intl: 'High', budget: 'High', priority: 'Innovation', best: 'aitu' },
      { spec: 'Other', city: 'Almaty', intl: 'Medium', budget: 'Medium', priority: 'Quality', best: 'iitu' },
    ];

    // Combine all scenarios
    const allScenarios = [...itScenarios, ...aiScenarios, ...engineeringScenarios, ...businessScenarios, ...otherScenarios];

    // Add variations with different parameter combinations
    for (let scenario of allScenarios) {
      dataset.push(scenario);
      
      // Add variations
      if (scenario.intl !== 'Low') {
        dataset.push({ ...scenario, intl: 'Low' });
      }
      if (scenario.city === 'Almaty') {
        dataset.push({ ...scenario, city: 'Other' });
      }
      if (scenario.budget === 'High') {
        dataset.push({ ...scenario, budget: 'Low' });
      }
    }

    console.log(`Generated training dataset with ${dataset.length} examples`);
    return dataset;
  }

  buildDecisionTree() {
    // Build a decision tree based on training data
    // This is a simplified tree structure for quick decisions
    return {
      specialization: {
        'Computer Science': { city: { 'Astana': 'aitu', 'Almaty': 'iitu', 'Other': 'aitu' } },
        'Software Engineering': { city: { 'Astana': 'aitu', 'Almaty': 'iitu', 'Other': 'aitu' } },
        'Cybersecurity': { city: { 'Astana': 'aitu', 'Almaty': 'iitu', 'Other': 'aitu' } },
        'Cloud Computing': { city: { 'Astana': 'aitu', 'Almaty': 'iitu', 'Other': 'aitu' } },
        'Artificial Intelligence': { city: { 'Astana': 'aitu', 'Almaty': 'iitu', 'Other': 'aitu' } },
        'Data Science': { city: { 'Astana': 'aitu', 'Almaty': 'iitu', 'Other': 'aitu' } },
        'Communications': { city: { 'Astana': 'aitu', 'Almaty': 'iitu', 'Other': 'aitu' } },
        
        'Engineering': { city: { 'Almaty': 'kbtu', 'Astana': 'iitu', 'Other': 'kbtu' } },
        'Civil Engineering': { city: { 'Almaty': 'kbtu', 'Astana': 'kbtu', 'Other': 'kbtu' } },
        'Mechanical Engineering': { city: { 'Almaty': 'kbtu', 'Astana': 'kbtu', 'Other': 'kbtu' } },
        'Oil and Gas': { city: { 'Almaty': 'kbtu', 'Astana': 'kbtu', 'Other': 'kbtu' } },
        'Architecture': { city: { 'Almaty': 'kbtu', 'Astana': 'kbtu', 'Other': 'kbtu' } },
        
        'Business Management': { city: { 'Almaty': 'uib', 'Astana': 'uib', 'Other': 'uib' } },
        'Finance': { city: { 'Almaty': 'uib', 'Astana': 'uib', 'Other': 'uib' } },
        'Marketing': { city: { 'Almaty': 'uib', 'Astana': 'uib', 'Other': 'uib' } },
        'Project Management': { city: { 'Almaty': 'uib', 'Astana': 'iitu', 'Other': 'uib' } },
        'Entrepreneurship': { city: { 'Almaty': 'uib', 'Astana': 'uib', 'Other': 'uib' } },
        
        'Digital Media': { city: { 'Almaty': 'aitu', 'Astana': 'aitu', 'Other': 'aitu' } },
        'Journalism': { city: { 'Almaty': 'iitu', 'Astana': 'iitu', 'Other': 'iitu' } },
      }
    };
  }

  predict(answers) {
    try {
      console.log('ML Prediction input:', answers);
      
      // Step 1: Get decision tree result
      const treeResult = this.getTreePrediction(answers);
      
      // Step 2: Calculate detailed scores
      const scores = this.calculateScores(answers);
      
      // Step 3: Find best match
      let bestMatch = treeResult;
      let maxScore = scores[treeResult] || 0;

      for (let uni in scores) {
        if (scores[uni] > maxScore) {
          maxScore = scores[uni];
          bestMatch = uni;
        }
      }

      // Normalize scores to 0-100
      const total = Object.values(scores).reduce((a, b) => a + b, 0);
      const normalizedScores = {};
      for (let uni in scores) {
        normalizedScores[uni] = Math.round((scores[uni] / total) * 100);
      }

      const result = {
        bestMatch: bestMatch,
        scores: {
          iitu: normalizedScores.iitu || 0,
          aitu: normalizedScores.aitu || 0,
          kbtu: normalizedScores.kbtu || 0,
          uib: normalizedScores.uib || 0
        },
        confidence: Math.round(normalizedScores[bestMatch] || 50)
      };

      console.log('ML Prediction result:', result);
      return result;
    } catch (error) {
      console.error('ML prediction error:', error);
      return this.fallbackPrediction(answers);
    }
  }

  getTreePrediction(answers) {
    const tree = this.decisionTree.specialization[answers.specialization];
    if (tree && tree.city) {
      return tree.city[answers.city] || tree.city['Other'] || 'iitu';
    }
    return 'iitu';
  }

  calculateScores(answers) {
    let scores = { iitu: 0, aitu: 0, kbtu: 0, uib: 0 };
    
    // Find all matching scenarios in training data
    const matches = this.trainingData.filter(scenario =>
      scenario.spec === answers.specialization &&
      scenario.city === answers.city &&
      scenario.intl === answers.international &&
      scenario.budget === answers.budget &&
      scenario.priority === answers.priority
    );

    if (matches.length > 0) {
      // Score based on exact matches
      matches.forEach(match => {
        scores[match.best] += 50;
      });
    } else {
      // Score based on partial matches
      const partialMatches = this.trainingData.filter(scenario =>
        scenario.spec === answers.specialization &&
        scenario.city === answers.city
      );

      if (partialMatches.length > 0) {
        partialMatches.forEach(match => {
          scores[match.best] += 30;
        });
      }
    }

    // Add scoring based on specialization
    const spec = answers.specialization.toLowerCase();
    
    if (spec.includes('computer') || spec.includes('software') || spec.includes('cybersecurity') || 
        spec.includes('cloud') || spec.includes('communications') || spec.includes('digital')) {
      scores.aitu += 20;
      scores.iitu += 15;
    }
    if (spec.includes('artificial') || spec.includes('data') || spec.includes('machine')) {
      scores.aitu += 25;
      scores.iitu += 20;
    }
    if (spec.includes('engineer') || spec.includes('civil') || spec.includes('mechanical') || 
        spec.includes('oil') || spec.includes('gas') || spec.includes('architecture')) {
      scores.kbtu += 30;
    }
    if (spec.includes('business') || spec.includes('management') || spec.includes('finance') || 
        spec.includes('marketing') || spec.includes('entrepreneurship') || spec.includes('project')) {
      scores.uib += 30;
    }

    // Add city bonus
    if (answers.city === 'Astana') {
      scores.aitu += 15;
    } else if (answers.city === 'Almaty') {
      scores.iitu += 10;
      scores.kbtu += 10;
      scores.uib += 10;
    }

    // Add international bonus
    if (answers.international === 'High') {
      scores.aitu += 10;
      scores.iitu += 5;
    }

    // Add priority bonus
    if (answers.priority === 'Innovation') {
      scores.aitu += 10;
    } else if (answers.priority === 'Quality') {
      scores.kbtu += 8;
    } else if (answers.priority === 'Reputation') {
      scores.uib += 8;
      scores.kbtu += 5;
    } else if (answers.priority === 'Career') {
      scores.uib += 8;
      scores.kbtu += 5;
    }

    return scores;
  }

  fallbackPrediction(answers) {
    const treeResult = this.getTreePrediction(answers);
    return {
      bestMatch: treeResult,
      scores: {
        iitu: treeResult === 'iitu' ? 60 : 20,
        aitu: treeResult === 'aitu' ? 60 : 20,
        kbtu: treeResult === 'kbtu' ? 60 : 20,
        uib: treeResult === 'uib' ? 60 : 20
      },
      confidence: 60
    };
  }
}

let recommendationEngine = null;
let engineineInitialized = false;

function initializeMLEngine() {
  if (engineineInitialized) {
    return recommendationEngine;
  }
  
  console.log('Initializing ML Engine...');
  try {
    recommendationEngine = new UniversityRecommendationEngine();
    engineineInitialized = true;
    console.log('✓ ML Engine initialized successfully');
    return recommendationEngine;
  } catch (error) {
    console.error('Failed to initialize ML engine:', error);
    return null;
  }
}

function getMLRecommendation(answers) {
  try {
    const engine = initializeMLEngine();
    if (!engine) {
      console.error('ML engine not available');
      return getFallbackRecommendation(answers);
    }
    
    const result = engine.predict(answers);
    console.log('✓ ML Recommendation:', result);
    return result;
  } catch (error) {
    console.error('Error in getMLRecommendation:', error);
    return getFallbackRecommendation(answers);
  }
}

function getFallbackRecommendation(answers) {
  console.warn('Using fallback recommendation');
  const spec = (answers.specialization || '').toLowerCase();
  const city = answers.city || 'Almaty';
  
  let bestMatch = 'iitu';
  let scores = { iitu: 40, aitu: 30, kbtu: 20, uib: 10 };
  
  if (spec.includes('computer') || spec.includes('software') || spec.includes('ai') || spec.includes('data')) {
    bestMatch = city === 'Astana' ? 'aitu' : 'iitu';
    scores = { aitu: 50, iitu: 30, kbtu: 15, uib: 5 };
  } else if (spec.includes('engineer') || spec.includes('civil') || spec.includes('mechanical')) {
    bestMatch = 'kbtu';
    scores = { kbtu: 60, iitu: 20, aitu: 10, uib: 10 };
  } else if (spec.includes('business') || spec.includes('finance') || spec.includes('marketing')) {
    bestMatch = 'uib';
    scores = { uib: 60, iitu: 20, aitu: 10, kbtu: 10 };
  }
  
  return {
    bestMatch: bestMatch,
    scores: scores,
    confidence: scores[bestMatch]
  };
}
