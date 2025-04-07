// Configuration
import config from './config.js';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Removed theme initialization
  
  initNavigation();
  initHTMLAnalyzer();
  initKeywordDensity();
  initTFIDF();
  initReadability();
  initMetaTags();
  initSchemaGenerator();
  initKeywordDatabase();
  initBacklinkChecker();
  initCompetitorGap();
  initSentimentAnalysis();
  initContentEditor();
  initAIChatbot();
});

// Removed theme functionality

// Tools navigation
function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const toolContainers = document.querySelectorAll('.tool-container');
  
  if (!navButtons || navButtons.length === 0 || !toolContainers || toolContainers.length === 0) return;
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tool = button.getAttribute('data-tool');
      
      // Remove active class from all buttons and containers
      navButtons.forEach(btn => btn.classList.remove('active'));
      toolContainers.forEach(container => container.classList.remove('active'));
      
      // Add active class to clicked button and corresponding container
      button.classList.add('active');
      const container = document.getElementById(tool);
      if (container) {
        container.classList.add('active');
        
        // Scroll to the tool container with a smooth animation
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// HTML Analyzer
function initHTMLAnalyzer() {
  const analyzeBtn = document.querySelector('#html-analyzer .analyze-btn');
  const textarea = document.querySelector('#html-analyzer textarea');
  let htmlStructureChart = null;
  
  if (!analyzeBtn || !textarea) return;
  
  // Create additional visualization containers
  const resultsContainer = document.querySelector('#html-analyzer .results');
  if (resultsContainer) {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    chartContainer.innerHTML = '<canvas id="htmlStructureChart"></canvas>';
    
    resultsContainer.appendChild(chartContainer);
  }
  
  analyzeBtn.addEventListener('click', () => {
    const html = textarea.value;
    if (!html) return;
    
    // Structure analysis
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const headings = {
      h1: doc.querySelectorAll('h1').length,
      h2: doc.querySelectorAll('h2').length,
      h3: doc.querySelectorAll('h3').length,
      h4: doc.querySelectorAll('h4').length,
      h5: doc.querySelectorAll('h5').length,
      h6: doc.querySelectorAll('h6').length
    };
    
    const links = doc.querySelectorAll('a').length;
    const internalLinks = Array.from(doc.querySelectorAll('a')).filter(a => 
      !a.href.startsWith('http') || a.href.includes(window.location.hostname)
    ).length;
    const externalLinks = links - internalLinks;
    
    const images = doc.querySelectorAll('img').length;
    const paragraphs = doc.querySelectorAll('p').length;
    const lists = doc.querySelectorAll('ul, ol').length;
    const tables = doc.querySelectorAll('table').length;
    const buttons = doc.querySelectorAll('button, input[type="button"], input[type="submit"]').length;
    const forms = doc.querySelectorAll('form').length;
    
    // SEO issues
    const issues = [];
    
    if (!doc.querySelector('title')) {
      issues.push('Missing title tag');
    }
    
    if (!doc.querySelector('meta[name="description"]')) {
      issues.push('Missing meta description');
    }
    
    if (headings.h1 === 0) {
      issues.push('No H1 heading found');
    }
    
    if (headings.h1 > 1) {
      issues.push('Multiple H1 headings found (recommended: only one H1)');
    }
    
    const imgWithoutAlt = doc.querySelectorAll('img:not([alt])').length;
    if (imgWithoutAlt > 0) {
      issues.push(`${imgWithoutAlt} image(s) missing alt text`);
    }
    
    // Check heading hierarchy
    const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;
    let hierarchyIssues = false;
    
    headingElements.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      if (previousLevel > 0 && level - previousLevel > 1) {
        hierarchyIssues = true;
      }
      previousLevel = level;
    });
    
    if (hierarchyIssues) {
      issues.push('Heading hierarchy is not sequential (e.g., H1 followed by H3)');
    }
    
    // Recommendations
    const recommendations = [];
    
    if (paragraphs < 3) {
      recommendations.push('Add more content to improve page value');
    }
    
    if (links < 2) {
      recommendations.push('Consider adding more internal or external links');
    }
    
    if (headings.h2 === 0 && paragraphs > 2) {
      recommendations.push('Consider adding H2 headings to structure content');
    }
    
    if (images > 0 && imgWithoutAlt > 0) {
      recommendations.push('Add alt text to all images for better accessibility');
    }
    
    // Update UI with enhanced visualizations
    const structureResultsEl = document.getElementById('structure-results');
    const seoIssuesEl = document.getElementById('seo-issues');
    const recommendationsEl = document.getElementById('recommendations');
    
    if (structureResultsEl) {
      structureResultsEl.innerHTML = `
        <div class="stat-visualization">
          <div class="stat-metric">
            <h4>Paragraphs</h4>
            <div class="stat-value">${paragraphs}</div>
          </div>
          <div class="stat-metric">
            <h4>Links</h4>
            <div class="stat-value">${links}</div>
          </div>
          <div class="stat-metric">
            <h4>Images</h4>
            <div class="stat-value">${images}</div>
          </div>
          <div class="stat-metric">
            <h4>Headings</h4>
            <div class="stat-value">${headings.h1 + headings.h2 + headings.h3 + headings.h4 + headings.h5 + headings.h6}</div>
          </div>
        </div>
        <ul>
          <li>Headings: H1 (${headings.h1}), H2 (${headings.h2}), H3 (${headings.h3}), H4+ (${headings.h4 + headings.h5 + headings.h6})</li>
          <li>Links: ${links} (Internal: ${internalLinks}, External: ${externalLinks})</li>
          <li>Images: ${images} (With alt: ${images - imgWithoutAlt}, Without alt: ${imgWithoutAlt})</li>
          <li>Other elements: Lists (${lists}), Tables (${tables}), Buttons (${buttons}), Forms (${forms})</li>
        </ul>
      `;
    }
    
    if (seoIssuesEl) {
      seoIssuesEl.innerHTML = issues.length > 0 ?
        `<ul>${issues.map(issue => `<li>${issue}</li>`).join('')}</ul>` :
        '<p>No major SEO issues found!</p>';
    }
    
    if (recommendationsEl) {
      recommendationsEl.innerHTML = recommendations.length > 0 ?
        `<ul>${recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>` :
        '<p>Your HTML structure looks good!</p>';
    }
    
    // Create/update structure chart
    const chartCanvas = document.getElementById('htmlStructureChart');
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      
      if (htmlStructureChart) {
        htmlStructureChart.destroy();
      }
      
      const theme = localStorage.getItem('themePref') || config.theme.defaultTheme;
      const chartColors = config.chartColors[theme] || config.chartColors.light;
      
      htmlStructureChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Paragraphs', 'Links', 'Images', 'Headings', 'Lists', 'Tables', 'Buttons', 'Forms'],
          datasets: [{
            data: [paragraphs, links, images, headings.h1 + headings.h2 + headings.h3 + headings.h4 + headings.h5 + headings.h6, lists, tables, buttons, forms],
            backgroundColor: [
              chartColors.backgroundColor,
              chartColors.borderColor,
              chartColors.accentColor,
              chartColors.secondAccent,
              chartColors.thirdAccent,
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(201, 203, 207, 0.6)'
            ],
            borderColor: [
              chartColors.borderColor,
              chartColors.borderColor.replace('0.2', '1'),
              chartColors.accentColor.replace('0.6', '1'),
              chartColors.secondAccent.replace('0.6', '1'),
              chartColors.thirdAccent.replace('0.6', '1'),
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(201, 203, 207, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            },
            title: {
              display: true,
              text: 'HTML Structure Composition'
            }
          }
        }
      });
    }
  });
}

// Keyword Density Analyzer
function initKeywordDensity() {
  const analyzeBtn = document.querySelector('#keyword-density .analyze-btn');
  const textarea = document.querySelector('#keyword-density textarea');
  let keywordChart = null;
  let keywordPieChart = null;
  
  if (!analyzeBtn || !textarea) return;
  
  // Create additional chart containers
  const resultsContainer = document.querySelector('#keyword-density .results');
  if (resultsContainer) {
    const pieChartContainer = document.createElement('div');
    pieChartContainer.className = 'pie-chart-container';
    pieChartContainer.innerHTML = '<canvas id="keywordPieChart"></canvas>';
    
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'keyword-bubble-chart';
    bubbleContainer.id = 'keywordBubbles';
    
    resultsContainer.appendChild(pieChartContainer);
    resultsContainer.appendChild(bubbleContainer);
  }
  
  analyzeBtn.addEventListener('click', () => {
    const content = textarea.value;
    if (!content) return;
    
    // Process text
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const totalWords = words.length;
    
    // Count word frequency
    const wordCounts = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    // Calculate percentages
    const keywordData = sortedWords.map(([word, count]) => ({
      word,
      count,
      percentage: ((count / totalWords) * 100).toFixed(2)
    }));
    
    // Update UI
    const keywordResultsEl = document.getElementById('keyword-results');
    if (keywordResultsEl) {
      keywordResultsEl.innerHTML = `
        <div class="stat-visualization">
          <div class="stat-metric">
            <h4>Total Words</h4>
            <div class="stat-value">${totalWords}</div>
          </div>
          <div class="stat-metric">
            <h4>Unique Words</h4>
            <div class="stat-value">${Object.keys(wordCounts).length}</div>
          </div>
          <div class="stat-metric">
            <h4>Top Keyword</h4>
            <div class="stat-value">${keywordData[0]?.word || 'N/A'}</div>
          </div>
          <div class="stat-metric">
            <h4>Keyword Density</h4>
            <div class="stat-value">${keywordData[0]?.percentage || '0'}%</div>
          </div>
        </div>
        <table>
          <tr>
            <th>Keyword</th>
            <th>Count</th>
            <th>Density</th>
          </tr>
          ${keywordData.map(data => `
            <tr>
              <td>${data.word}</td>
              <td>${data.count}</td>
              <td>${data.percentage}%</td>
            </tr>
          `).join('')}
        </table>
      `;
    }
    
    // Create/update bar chart
    const chartCanvas = document.getElementById('keywordChart');
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      
      if (keywordChart) {
        keywordChart.destroy();
      }
      
      const theme = localStorage.getItem('themePref') || config.theme.defaultTheme;
      const chartColors = config.chartColors[theme] || config.chartColors.light;
      
      keywordChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: keywordData.map(data => data.word),
          datasets: [{
            label: 'Keyword Density (%)',
            data: keywordData.map(data => data.percentage),
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Percentage (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Keywords'
              },
              ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      });
    }
    
    // Create/update pie chart
    const pieChartCanvas = document.getElementById('keywordPieChart');
    if (pieChartCanvas) {
      const ctx = pieChartCanvas.getContext('2d');
      
      if (keywordPieChart) {
        keywordPieChart.destroy();
      }
      
      const theme = localStorage.getItem('themePref') || config.theme.defaultTheme;
      const chartColors = config.chartColors[theme] || config.chartColors.light;
      
      // Take top 5 keywords and group the rest as "Others"
      const top5 = keywordData.slice(0, 5);
      const otherPercentage = keywordData.slice(5).reduce((sum, data) => sum + parseFloat(data.percentage), 0);
      
      const pieData = [
        ...top5.map(data => parseFloat(data.percentage)),
        otherPercentage
      ];
      
      const pieLabels = [
        ...top5.map(data => data.word),
        'Others'
      ];
      
      // Generate a color array
      const colorArray = [
        chartColors.backgroundColor,
        chartColors.accentColor,
        chartColors.secondAccent,
        chartColors.thirdAccent,
        'rgba(153, 102, 255, 0.6)',
        'rgba(201, 203, 207, 0.6)'
      ];
      
      keywordPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: colorArray,
            borderColor: colorArray.map(color => color.replace('0.6', '1')),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right'
            },
            title: {
              display: true,
              text: 'Keyword Distribution'
            }
          }
        }
      });
    }
    
    // Create keyword bubbles
    const bubbleContainer = document.getElementById('keywordBubbles');
    if (bubbleContainer) {
      bubbleContainer.innerHTML = '';
      
      keywordData.forEach(data => {
        const bubble = document.createElement('span');
        bubble.className = 'keyword-bubble';
        bubble.textContent = data.word;
        bubble.style.fontSize = `${Math.max(0.9, Math.min(2, parseFloat(data.percentage) / 2 + 0.8))}rem`;
        bubble.style.opacity = `${Math.max(0.5, Math.min(1, parseFloat(data.percentage) / 5 + 0.5))}`;
        bubbleContainer.appendChild(bubble);
      });
    }
  });
}

// TF-IDF Analysis
function initTFIDF() {
  const analyzeBtn = document.querySelector('#tf-idf .analyze-btn');
  const mainTextarea = document.querySelector('#tf-idf .multi-input textarea:first-child');
  const competitorTextarea = document.querySelector('#tf-idf .multi-input textarea:last-child');
  
  if (!analyzeBtn || !mainTextarea || !competitorTextarea) return;
  
  analyzeBtn.addEventListener('click', () => {
    const mainContent = mainTextarea.value;
    const competitorContent = competitorTextarea.value;
    
    if (!mainContent) return;
    
    // Calculate TF-IDF
    const mainDoc = processText(mainContent);
    const competitorDoc = competitorContent ? processText(competitorContent) : null;
    
    const tfidfResults = calculateTFIDF(mainDoc, competitorDoc);
    
    // Update UI
    const resultsEl = document.getElementById('tf-idf-results');
    if (resultsEl) {
      resultsEl.innerHTML = `
        <h4>TF-IDF Analysis Results</h4>
        <table>
          <tr>
            <th>Term</th>
            <th>TF-IDF Score</th>
            <th>Frequency</th>
          </tr>
          ${tfidfResults.map(item => `
            <tr>
              <td>${item.term}</td>
              <td>${item.tfidf.toFixed(4)}</td>
              <td>${item.frequency}</td>
            </tr>
          `).join('')}
        </table>
        <p class="note">Higher TF-IDF scores indicate more important terms unique to your content.</p>
      `;
    }
  });
  
  function processText(text) {
    // Simple text processing
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordCounts = {};
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    return {
      wordCounts,
      totalWords: words.length
    };
  }
  
  function calculateTFIDF(mainDoc, competitorDoc) {
    const results = [];
    
    // Calculate term frequency
    for (const [term, count] of Object.entries(mainDoc.wordCounts)) {
      const tf = count / mainDoc.totalWords;
      
      // Calculate inverse document frequency
      let idf = 1; // Default if no competitor doc
      
      if (competitorDoc) {
        const docsWithTerm = (mainDoc.wordCounts[term] ? 1 : 0) + 
                            (competitorDoc.wordCounts[term] ? 1 : 0);
        idf = Math.log(2 / docsWithTerm);
      }
      
      const tfidf = tf * idf;
      
      results.push({
        term,
        tfidf,
        frequency: count
      });
    }
    
    // Sort by TF-IDF score
    return results.sort((a, b) => b.tfidf - a.tfidf).slice(0, 20);
  }
}

// Readability Analysis
function initReadability() {
  const analyzeBtn = document.querySelector('#readability .analyze-btn');
  const textarea = document.querySelector('#readability textarea');
  let readabilityChart = null;
  let readabilityGauge = null;
  
  if (!analyzeBtn || !textarea) return;
  
  // Create additional visualization containers
  const resultsContainer = document.querySelector('#readability .results');
  if (resultsContainer) {
    const gaugeContainer = document.createElement('div');
    gaugeContainer.className = 'gauge-chart-container';
    gaugeContainer.innerHTML = `
      <h3>Readability Score Gauge</h3>
      <div class="gauge-container" id="readabilityGauge">
        <div class="gauge-background">
          <div class="gauge-fill" id="gaugeFill"></div>
          <div class="gauge-center"></div>
          <div class="gauge-value" id="gaugeValue">0</div>
        </div>
      </div>
      <div class="heatmap-legend">
        <span>Very Difficult</span>
        <span>Difficult</span>
        <span>Standard</span>
        <span>Easy</span>
        <span>Very Easy</span>
      </div>
    `;
    
    // Insert gauge before the chart
    const chartContainer = document.querySelector('#readability .chart-container');
    if (chartContainer) {
      resultsContainer.insertBefore(gaugeContainer, chartContainer);
    }
  }
  
  analyzeBtn.addEventListener('click', () => {
    const content = textarea.value;
    if (!content) return;
    
    // Calculate readability metrics
    const stats = calculateTextStats(content);
    const fleschScore = calculateFleschScore(stats);
    const fleschKincaidGrade = calculateFleschKincaidGrade(stats);
    const smogIndex = calculateSMOG(stats);
    const colemanLiauIndex = calculateColemanLiau(stats);
    const automatedReadabilityIndex = calculateARI(stats);
    const gunningFogIndex = calculateGunningFog(stats);
    
    // Average of multiple readability metrics for more accurate assessment
    const avgReadabilityScore = (
      normalizeScore(fleschScore, 0, 100) + 
      normalizeScore(100 - fleschKincaidGrade * 6.25, 0, 100) + 
      normalizeScore(100 - smogIndex * 6.25, 0, 100)
    ) / 3;
    
    // Update UI with additional visualizations
    const readabilityScoresEl = document.getElementById('readability-scores');
    const contentStatsEl = document.getElementById('content-stats');
    const chartCanvas = document.getElementById('readabilityChart');
    
    if (readabilityScoresEl) {
      readabilityScoresEl.innerHTML = `
        <div class="score-item">
          <span>Flesch Reading Ease:</span> <strong>${fleschScore.toFixed(1)}</strong>
          <div class="score-desc">${getFleschRating(fleschScore)}</div>
        </div>
        <div class="score-item">
          <span>Flesch-Kincaid Grade:</span> <strong>${fleschKincaidGrade.toFixed(1)}</strong>
          <div class="score-desc">Approximate grade level needed to understand the text</div>
        </div>
        <div class="score-item">
          <span>SMOG Index:</span> <strong>${smogIndex.toFixed(1)}</strong>
          <div class="score-desc">Years of education needed to understand the text</div>
        </div>
        <div class="score-item">
          <span>Coleman-Liau Index:</span> <strong>${colemanLiauIndex.toFixed(1)}</strong>
          <div class="score-desc">Grade level based on character count instead of syllables</div>
        </div>
        <div class="score-item">
          <span>Automated Readability:</span> <strong>${automatedReadabilityIndex.toFixed(1)}</strong>
          <div class="score-desc">Grade level based on characters per word and words per sentence</div>
        </div>
        <div class="score-item">
          <span>Gunning Fog:</span> <strong>${gunningFogIndex.toFixed(1)}</strong>
          <div class="score-desc">Years of formal education needed to understand text</div>
        </div>
      `;
    }
    
    if (contentStatsEl) {
      contentStatsEl.innerHTML = `
        <div class="stat-visualization">
          <div class="stat-metric">
            <h4>Words</h4>
            <div class="stat-value">${stats.wordCount}</div>
          </div>
          <div class="stat-metric">
            <h4>Sentences</h4>
            <div class="stat-value">${stats.sentenceCount}</div>
          </div>
          <div class="stat-metric">
            <h4>Words/Sentence</h4>
            <div class="stat-value">${(stats.wordCount / stats.sentenceCount).toFixed(1)}</div>
          </div>
          <div class="stat-metric">
            <h4>Complex Words</h4>
            <div class="stat-value">${((stats.complexWords / stats.wordCount) * 100).toFixed(1)}%</div>
          </div>
        </div>
        <div class="heat-map" id="sentenceLengthMap">
          ${generateSentenceLengthHeatmap(content)}
        </div>
        <div class="heatmap-legend">
          <span>Short</span>
          <span>Ideal</span>
          <span>Long</span>
        </div>
      `;
    }
    
    // Update gauge
    const gaugeFill = document.getElementById('gaugeFill');
    const gaugeValue = document.getElementById('gaugeValue');
    
    if (gaugeFill && gaugeValue) {
      // Convert Flesch score (0-100) to gauge percentage
      const fillPercentage = Math.min(100, Math.max(0, avgReadabilityScore));
      gaugeFill.style.height = `${fillPercentage}%`;
      gaugeValue.textContent = avgReadabilityScore.toFixed(0);
      
      // Color based on readability
      let fillColor = '';
      if (avgReadabilityScore >= 80) {
        fillColor = 'var(--success-color)';
      } else if (avgReadabilityScore >= 60) {
        fillColor = 'var(--secondary-color)';
      } else if (avgReadabilityScore >= 40) {
        fillColor = 'var(--accent-color)';
      } else {
        fillColor = 'var(--danger-color)';
      }
      
      gaugeFill.style.background = fillColor;
      gaugeValue.style.color = fillColor;
    }
    
    // Create/update radar chart
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      
      if (readabilityChart) {
        readabilityChart.destroy();
      }
      
      // Ensure data points are valid and in proper range
      const sentenceLength = stats.sentenceCount > 0 ? stats.wordCount / stats.sentenceCount : 15;
      const wordLength = stats.wordCount > 0 ? stats.syllableCount / stats.wordCount : 1.5;
      
      const theme = localStorage.getItem('themePref') || config.theme.defaultTheme;
      const chartColors = config.chartColors[theme] || config.chartColors.light;
      
      readabilityChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Reading Ease', 'Grade Level', 'Sentence Length', 'Word Length', 'Content Length'],
          datasets: [{
            label: 'Your Content',
            data: [
              mapToRange(fleschScore, 0, 100, 0, 100),
              mapToRange(Math.min(fleschKincaidGrade, 16), 0, 16, 100, 0),
              mapToRange(sentenceLength, 10, 25, 100, 0),
              mapToRange(wordLength, 1, 3, 100, 0),
              mapToRange(Math.min(stats.wordCount, 1000), 0, 1000, 0, 100)
            ],
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            borderWidth: 1
          }, {
            label: 'Ideal Content',
            data: [75, 75, 70, 65, 60],
            backgroundColor: chartColors.accentColor,
            borderColor: chartColors.accentColor.replace('0.6', '1'),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: {
                display: false,
                stepSize: 20
              },
              pointLabels: {
                font: {
                  size: 12
                }
              }
            }
          }
        }
      });
    }
  });
  
  // Helper function to generate heatmap for sentence length
  function generateSentenceLengthHeatmap(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    let html = '';
    sentences.forEach(sentence => {
      const words = sentence.trim().split(/\s+/);
      const wordCount = words.length;
      
      // Determine color based on optimal sentence length (8-15 words)
      let color = '';
      if (wordCount < 5) {
        color = 'var(--chart-bg)'; // Too short
      } else if (wordCount <= 15) {
        color = 'var(--success-color)'; // Optimal
      } else if (wordCount <= 25) {
        color = 'var(--warning-color)'; // Getting long
      } else {
        color = 'var(--danger-color)'; // Too long
      }
      
      const cell = `<div class="heat-cell" style="background-color: ${color}" title="${wordCount} words: '${sentence.trim().substring(0, 30)}${sentence.length > 30 ? '...' : ''}'"></div>`;
      html += cell;
    });
    
    return html;
  }
  
  // Readability analysis functions
  function calculateTextStats(text) {
    // Clean text
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // Count sentences - improved regex for better sentence detection
    const sentences = cleanText.split(/[.!?]+(?=\s+[A-Z]|\s*$)/).filter(s => s.trim().length > 0);
    const sentenceCount = Math.max(1, sentences.length); // Ensure at least 1 sentence
    
    // Count words
    const words = cleanText.split(/\s+/).filter(w => w.match(/[a-zA-Z0-9]/));
    const wordCount = Math.max(1, words.length); // Ensure at least 1 word
    
    // Count characters
    const charCount = words.join('').length;
    const avgCharsPerWord = charCount / wordCount;
    
    // Count syllables
    let syllableCount = 0;
    let complexWords = 0;
    
    words.forEach(word => {
      const count = countSyllables(word);
      syllableCount += count;
      if (count >= 3 && !isNameOrAbbreviation(word)) {
        complexWords++;
      }
    });
    
    return {
      sentenceCount,
      wordCount,
      syllableCount,
      complexWords,
      charCount,
      avgCharsPerWord
    };
  }

  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    
    // Special cases and exceptions
    if (!word || word.length <= 1) return 1;
    
    // List of common exceptions
    const exceptions = {
      "simile": 3,
      "forever": 3,
      "shoreline": 2
    };
    
    if (exceptions[word]) return exceptions[word];
    
    // Remove endings
    if (word.length > 3) {
      if (word.match(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/)) {
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
      }
    }
    
    // Count vowel groups as syllables
    const syllables = word.match(/[aeiouy]{1,2}/g);
    
    // Return count of vowel groups, with a minimum of 1 syllable
    return syllables ? syllables.length : 1;
  }
  
  function isNameOrAbbreviation(word) {
    // Check if word is likely a proper name or abbreviation
    return word.length <= 2 || 
           (word.length >= 2 && word[0] === word[0].toUpperCase() && word[1] === word[1].toLowerCase()) ||
           word.toUpperCase() === word;
  }

  function calculateFleschScore(stats) {
    // Flesch Reading Ease = 206.835 - 1.015 × (words/sentences) - 84.6 × (syllables/words)
    const wordsPerSentence = stats.wordCount / stats.sentenceCount;
    const syllablesPerWord = stats.syllableCount / stats.wordCount;
    
    return 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
  }

  function calculateFleschKincaidGrade(stats) {
    // Flesch-Kincaid Grade Level = 0.39 × (words/sentences) + 11.8 × (syllables/words) - 15.59
    const wordsPerSentence = stats.wordCount / stats.sentenceCount;
    const syllablesPerWord = stats.syllableCount / stats.wordCount;
    
    return 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  }

  function calculateSMOG(stats) {
    // SMOG = 1.043 × sqrt(30 × (complex words / sentences)) + 3.1291
    const complexWordRatio = stats.complexWords / stats.sentenceCount;
    
    return 1.043 * Math.sqrt(30 * complexWordRatio) + 3.1291;
  }
  
  function calculateColemanLiau(stats) {
    // Coleman-Liau Index = 0.0588 × (avg chars per 100 words) - 0.296 × (avg sentences per 100 words) - 15.8
    const L = stats.avgCharsPerWord * 100;
    const S = (stats.sentenceCount / stats.wordCount) * 100;
    
    return 0.0588 * L - 0.296 * S - 15.8;
  }
  
  function calculateARI(stats) {
    // Automated Readability Index = 4.71 × (chars/words) + 0.5 × (words/sentences) - 21.43
    const charsPerWord = stats.charCount / stats.wordCount;
    const wordsPerSentence = stats.wordCount / stats.sentenceCount;
    
    return 4.71 * charsPerWord + 0.5 * wordsPerSentence - 21.43;
  }
  
  function calculateGunningFog(stats) {
    // Gunning Fog Index = 0.4 × ((words/sentences) + 100 × (complex words/words))
    const wordsPerSentence = stats.wordCount / stats.sentenceCount;
    const percentComplexWords = stats.complexWords / stats.wordCount;
    
    return 0.4 * (wordsPerSentence + 100 * percentComplexWords);
  }

  function getFleschRating(score) {
    if (score >= 90) return "Very Easy - 5th grade level";
    if (score >= 80) return "Easy - 6th grade level";
    if (score >= 70) return "Fairly Easy - 7th grade level";
    if (score >= 60) return "Standard - 8th-9th grade level";
    if (score >= 50) return "Fairly Difficult - 10th-12th grade level";
    if (score >= 30) return "Difficult - College level";
    return "Very Difficult - College graduate level";
  }
  
  function normalizeScore(score, min, max) {
    return Math.min(100, Math.max(0, ((score - min) / (max - min)) * 100));
  }

  function mapToRange(value, fromMin, fromMax, toMin, toMax) {
    // Map a value from one range to another
    const fromRange = fromMax - fromMin;
    const toRange = toMax - toMin;
    const valueScaled = (value - fromMin) / fromRange;
    
    return toMin + (valueScaled * toRange);
  }
}

// Meta Tags Generator
function initMetaTags() {
  const generateBtn = document.getElementById('meta-tags .analyze-btn');
  const titleInput = document.getElementById('page-title');
  const descInput = document.getElementById('page-description');
  const keywordsInput = document.getElementById('keywords');
  const canonicalInput = document.getElementById('canonical-url');
  const copyBtn = document.getElementById('copy-meta');
  
  if (!generateBtn || !titleInput || !descInput || !keywordsInput || !canonicalInput || !copyBtn) return;
  
  generateBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const keywords = keywordsInput.value.trim();
    const canonical = canonicalInput.value.trim();
    
    if (!title || !description) {
      alert('Please enter at least a title and description.');
      return;
    }
    
    // Generate meta tags
    let metaTags = `<title>${escapeHtml(title)}</title>\n`;
    metaTags += `<meta name="description" content="${escapeHtml(description)}">\n`;
    
    if (keywords) {
      metaTags += `<meta name="keywords" content="${escapeHtml(keywords)}">\n`;
    }
    
    if (canonical) {
      metaTags += `<link rel="canonical" href="${escapeHtml(canonical)}">\n`;
    }
    
    // Open Graph tags
    metaTags += `<meta property="og:title" content="${escapeHtml(title)}">\n`;
    metaTags += `<meta property="og:description" content="${escapeHtml(description)}">\n`;
    if (canonical) {
      metaTags += `<meta property="og:url" content="${escapeHtml(canonical)}">\n`;
    }
    metaTags += `<meta property="og:type" content="website">\n`;
    
    // Twitter Card tags
    metaTags += `<meta name="twitter:card" content="summary">\n`;
    metaTags += `<meta name="twitter:title" content="${escapeHtml(title)}">\n`;
    metaTags += `<meta name="twitter:description" content="${escapeHtml(description)}">\n`;
    
    // Update UI
    const metaOutputEl = document.getElementById('meta-output');
    const serpPreviewEl = document.getElementById('serp-preview');
    
    if (metaOutputEl) {
      metaOutputEl.textContent = metaTags;
    }
    
    if (serpPreviewEl) {
      serpPreviewEl.innerHTML = `
        <div class="serp-title">${escapeHtml(title)}</div>
        <div class="serp-url">${canonical || 'example.com/page'}</div>
        <div class="serp-desc">${escapeHtml(description)}</div>
      `;
    }
  });
  
  copyBtn.addEventListener('click', () => {
    const metaOutput = document.getElementById('meta-output');
    if (metaOutput) {
      navigator.clipboard.writeText(metaOutput.textContent)
        .then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  });
  
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Schema Generator
function initSchemaGenerator() {
  const schemaType = document.getElementById('schema-type');
  const fieldsContainer = document.getElementById('schema-fields-container');
  const generateBtn = document.getElementById('generate-schema-btn');
  const schemaOutput = document.getElementById('schema-output');
  const copyBtn = document.getElementById('copy-schema');
  const validateBtn = document.getElementById('validate-schema-btn');
  const suggestBtn = document.getElementById('suggest-schema-btn');
  const contentInput = document.getElementById('schema-content-analysis');
  
  if (!schemaType || !fieldsContainer || !generateBtn || !schemaOutput || !copyBtn) return;
  
  const schemaFields = {
    LocalBusiness: [
      { name: 'name', label: 'Business Name', type: 'text', required: true },
      { name: 'description', label: 'Business Description', type: 'textarea' },
      { name: 'url', label: 'Website URL', type: 'url', required: true },
      { name: 'telephone', label: 'Phone Number', type: 'tel' },
      { name: 'address', label: 'Street Address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true },
      { name: 'zipCode', label: 'Zip Code', type: 'text', required: true },
      { name: 'country', label: 'Country', type: 'text', required: true }
    ],
    Organization: [
      { name: 'name', label: 'Organization Name', type: 'text', required: true },
      { name: 'description', label: 'Organization Description', type: 'textarea' },
      { name: 'url', label: 'Website URL', type: 'url', required: true },
      { name: 'logo', label: 'Logo URL', type: 'url' }
    ],
    Person: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'jobTitle', label: 'Job Title', type: 'text' },
      { name: 'telephone', label: 'Phone Number', type: 'tel' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'url', label: 'Website URL', type: 'url' }
    ],
    Product: [
      { name: 'name', label: 'Product Name', type: 'text', required: true },
      { name: 'description', label: 'Product Description', type: 'textarea', required: true },
      { name: 'image', label: 'Product Image URL', type: 'url' },
      { name: 'brand', label: 'Brand Name', type: 'text' },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'priceCurrency', label: 'Currency (e.g., USD)', type: 'text', required: true }
    ],
    Event: [
      { name: 'name', label: 'Event Name', type: 'text', required: true },
      { name: 'description', label: 'Event Description', type: 'textarea' },
      { name: 'startDate', label: 'Start Date & Time', type: 'datetime-local', required: true },
      { name: 'endDate', label: 'End Date & Time', type: 'datetime-local' },
      { name: 'location', label: 'Location Name', type: 'text', required: true },
      { name: 'address', label: 'Address', type: 'text', required: true }
    ],
    Article: [
      { name: 'headline', label: 'Article Headline', type: 'text', required: true },
      { name: 'description', label: 'Article Description', type: 'textarea' },
      { name: 'image', label: 'Featured Image URL', type: 'url' },
      { name: 'authorName', label: 'Author Name', type: 'text', required: true },
      { name: 'publishDate', label: 'Date Published', type: 'date', required: true },
      { name: 'publisher', label: 'Publisher Name', type: 'text', required: true }
    ],
    FAQ: [
      { name: 'question1', label: 'Question 1', type: 'text', required: true },
      { name: 'answer1', label: 'Answer 1', type: 'textarea', required: true },
      { name: 'question2', label: 'Question 2', type: 'text' },
      { name: 'answer2', label: 'Answer 2', type: 'textarea' },
      { name: 'question3', label: 'Question 3', type: 'text' },
      { name: 'answer3', label: 'Answer 3', type: 'textarea' }
    ]
  };
  
  // Initialize with the default schema type
  renderSchemaFields(schemaType.value);
  
  schemaType.addEventListener('change', () => {
    renderSchemaFields(schemaType.value);
  });
  
  generateBtn.addEventListener('click', () => {
    const type = schemaType.value;
    const schema = generateSchema(type);
    
    if (schema) {
      const schemaJson = JSON.stringify(schema, null, 2);
      schemaOutput.textContent = `<script type="application/ld+json">\n${schemaJson}\n</script>`;
    }
  });
  
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(schemaOutput.textContent)
      .then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  });
  
  // Add validation capability
  if (validateBtn) {
    validateBtn.addEventListener('click', () => {
      const schemaJson = schemaOutput.textContent.replace('<script type="application/ld+json">\n', '').replace('\n</script>', '');
      
      try {
        const schemaObj = JSON.parse(schemaJson);
        validateSchema(schemaObj);
      } catch (e) {
        showValidationError('Invalid JSON format: ' + e.message);
      }
    });
  }
  
  // Add suggestion capability
  if (suggestBtn && contentInput) {
    suggestBtn.addEventListener('click', () => {
      const content = contentInput.value.trim();
      if (!content) {
        alert('Please enter some content to analyze for schema suggestions.');
        return;
      }
      
      suggestSchemaFromContent(content);
    });
  }
  
  function renderSchemaFields(type) {
    // Clear current fields
    fieldsContainer.innerHTML = '';
    
    const fields = schemaFields[type] || [];
    
    fields.forEach(field => {
      const fieldElement = document.createElement('div');
      fieldElement.className = 'form-group';
      
      const label = document.createElement('label');
      label.textContent = field.label + (field.required ? ' *' : '');
      
      let input;
      if (field.type === 'textarea') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = field.type;
      }
      
      input.id = `schema-${field.name}`;
      input.name = field.name;
      input.required = field.required;
      
      fieldElement.appendChild(label);
      fieldElement.appendChild(input);
      fieldsContainer.appendChild(fieldElement);
    });
  }
  
  function generateSchema(type) {
    const fields = schemaFields[type] || [];
    const missingRequired = [];
    
    // Check for required fields
    fields.forEach(field => {
      if (field.required) {
        const input = document.getElementById(`schema-${field.name}`);
        if (input && !input.value.trim()) {
          missingRequired.push(field.label);
        }
      }
    });
    
    if (missingRequired.length > 0) {
      alert(`Please fill in the following required fields: ${missingRequired.join(', ')}`);
      return null;
    }
    
    // Generate schema based on type
    switch (type) {
      case 'LocalBusiness':
        return generateLocalBusinessSchema();
      case 'Organization':
        return generateOrganizationSchema();
      case 'Person':
        return generatePersonSchema();
      case 'Product':
        return generateProductSchema();
      case 'Event':
        return generateEventSchema();
      case 'Article':
        return generateArticleSchema();
      case 'FAQ':
        return generateFAQSchema();
      default:
        return null;
    }
  }
  
  function getFieldValue(name) {
    const el = document.getElementById(`schema-${name}`);
    return el ? el.value.trim() : '';
  }
  
  function generateLocalBusinessSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": getFieldValue('name'),
      "description": getFieldValue('description'),
      "url": getFieldValue('url'),
      "telephone": getFieldValue('telephone'),
      "address": {
        "@type": "PostalAddress",
        "streetAddress": getFieldValue('address'),
        "addressLocality": getFieldValue('city'),
        "addressRegion": getFieldValue('state'),
        "postalCode": getFieldValue('zipCode'),
        "addressCountry": getFieldValue('country')
      }
    };
  }
  
  function generateOrganizationSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": getFieldValue('name'),
      "url": getFieldValue('url')
    };
    
    if (getFieldValue('description')) {
      schema.description = getFieldValue('description');
    }
    
    if (getFieldValue('logo')) {
      schema.logo = getFieldValue('logo');
    }
    
    return schema;
  }
  
  function generatePersonSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": getFieldValue('name')
    };
    
    if (getFieldValue('jobTitle')) {
      schema.jobTitle = getFieldValue('jobTitle');
    }
    
    if (getFieldValue('telephone')) {
      schema.telephone = getFieldValue('telephone');
    }
    
    if (getFieldValue('email')) {
      schema.email = getFieldValue('email');
    }
    
    if (getFieldValue('url')) {
      schema.url = getFieldValue('url');
    }
    
    return schema;
  }
  
  function generateProductSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": getFieldValue('name'),
      "description": getFieldValue('description'),
      "image": getFieldValue('image') || undefined,
      "brand": {
        "@type": "Brand",
        "name": getFieldValue('brand') || getFieldValue('name')
      },
      "offers": {
        "@type": "Offer",
        "price": getFieldValue('price'),
        "priceCurrency": getFieldValue('priceCurrency')
      }
    };
  }
  
  function generateEventSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": getFieldValue('name'),
      "description": getFieldValue('description'),
      "startDate": getFieldValue('startDate'),
      "endDate": getFieldValue('endDate') || undefined,
      "location": {
        "@type": "Place",
        "name": getFieldValue('location'),
        "address": getFieldValue('address')
      }
    };
  }
  
  function generateArticleSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": getFieldValue('headline'),
      "description": getFieldValue('description'),
      "image": getFieldValue('image') || undefined,
      "author": {
        "@type": "Person",
        "name": getFieldValue('authorName')
      },
      "datePublished": getFieldValue('publishDate'),
      "publisher": {
        "@type": "Organization",
        "name": getFieldValue('publisher')
      }
    };
  }
  
  function generateFAQSchema() {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": []
    };
    
    // Add questions and answers
    for (let i = 1; i <= 3; i++) {
      const question = getFieldValue(`question${i}`);
      const answer = getFieldValue(`answer${i}`);
      
      if (question && answer) {
        faqSchema.mainEntity.push({
          "@type": "Question",
          "name": question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answer
          }
        });
      }
    }
    
    return faqSchema;
  }
  
  function validateSchema(schema) {
    const schemaInfoEl = document.getElementById('schema-info');
    
    // Basic validation
    const validationResults = [];
    
    // Check for required context
    if (!schema['@context'] || schema['@context'] !== 'https://schema.org') {
      validationResults.push({type: 'error', message: 'Missing or invalid @context. Must be "https://schema.org".'});
    }
    
    // Check for type
    if (!schema['@type']) {
      validationResults.push({type: 'error', message: 'Missing @type property.'});
    }
    
    // Type-specific validation
    const type = schema['@type'];
    if (type) {
      switch(type) {
        case 'LocalBusiness':
          if (!schema.name) validationResults.push({type: 'error', message: 'LocalBusiness requires a name property.'});
          if (!schema.address) validationResults.push({type: 'error', message: 'LocalBusiness requires an address property.'});
          break;
        case 'Product':
          if (!schema.name) validationResults.push({type: 'error', message: 'Product requires a name property.'});
          if (!schema.offers) validationResults.push({type: 'error', message: 'Product should have an offers property.'});
          else if (!schema.offers.price) validationResults.push({type: 'error', message: 'Product offers should include a price.'});
          break;
        case 'Article':
          if (!schema.headline) validationResults.push({type: 'error', message: 'Article requires a headline property.'});
          if (!schema.author) validationResults.push({type: 'error', message: 'Article should have an author property.'});
          break;
        // Add more type validations as needed
      }
    }
    
    // Display validation results
    if (schemaInfoEl) {
      if (validationResults.length === 0) {
        schemaInfoEl.innerHTML = `
          <div class="validation-success">
            <p>✓ Schema validation passed! Your schema appears to be valid.</p>
            <p>For comprehensive validation, use the <a href="https://search.google.com/test/rich-results" target="_blank">Google Rich Results Test</a>.</p>
          </div>
        `;
      } else {
        let validationHTML = `
          <div class="validation-errors">
            <p>Schema validation found ${validationResults.length} issue(s):</p>
            <ul>
        `;
        
        validationResults.forEach(result => {
          validationHTML += `<li class="${result.type}">${result.message}</li>`;
        });
        
        validationHTML += `
            </ul>
            <p>For comprehensive validation, use the <a href="https://search.google.com/test/rich-results" target="_blank">Google Rich Results Test</a>.</p>
          </div>
        `;
        
        schemaInfoEl.innerHTML = validationHTML;
      }
    }
  }
  
  function showValidationError(errorMessage) {
    const schemaInfoEl = document.getElementById('schema-info');
    if (schemaInfoEl) {
      schemaInfoEl.innerHTML = `
        <div class="validation-errors">
          <p>Schema validation error:</p>
          <p class="error">${errorMessage}</p>
        </div>
      `;
    }
  }
  
  async function suggestSchemaFromContent(content) {
    const schemaInfoEl = document.getElementById('schema-info');
    
    if (schemaInfoEl) {
      schemaInfoEl.innerHTML = '<p>Analyzing content and generating suggestions...</p>';
      
      try {
        // Here we'll use a language model to analyze the content and suggest schema types
        const completion = await websim.chat.completions.create({
          messages: [
            {
              role: "system",
              content: `You are a specialized SEO assistant focused on schema.org markup. 
              Analyze the provided content and suggest the most appropriate schema types and properties.
              Focus on the main topics and entities in the content.
              Respond directly with JSON, following this JSON schema, and no other text:
              {
                "recommendedType": string,
                "reason": string,
                "alternativeTypes": string[],
                "suggestedProperties": string[]
              }`
            },
            {
              role: "user",
              content: content
            }
          ],
          json: true
        });
        
        const result = JSON.parse(completion.content);
        
        // Display the suggestions
        let suggestionsHTML = `
          <div class="schema-suggestions">
            <h4>Content Analysis Results</h4>
            <p><strong>Recommended Schema Type:</strong> ${result.recommendedType}</p>
            <p><strong>Reason:</strong> ${result.reason}</p>
            
            <p><strong>Alternative Schema Types:</strong></p>
            <ul>
              ${result.alternativeTypes.map(type => `<li>${type}</li>`).join('')}
            </ul>
            
            <p><strong>Suggested Properties:</strong></p>
            <ul>
              ${result.suggestedProperties.map(prop => `<li>${prop}</li>`).join('')}
            </ul>
            
            <button class="option-btn" id="apply-suggestion">Apply ${result.recommendedType} Schema</button>
          </div>
        `;
        
        schemaInfoEl.innerHTML = suggestionsHTML;
        
        // Add event listener for the apply button
        const applyBtn = document.getElementById('apply-suggestion');
        if (applyBtn) {
          applyBtn.addEventListener('click', () => {
            // Find and select the recommended schema type
            const options = Array.from(schemaType.options);
            const matchingOption = options.find(option => 
              option.value === result.recommendedType || 
              option.value.toLowerCase() === result.recommendedType.toLowerCase()
            );
            
            if (matchingOption) {
              schemaType.value = matchingOption.value;
              // Trigger the change event to update fields
              const event = new Event('change');
              schemaType.dispatchEvent(event);
            } else {
              alert(`Schema type "${result.recommendedType}" is not available. Please select a schema type manually.`);
            }
          });
        }
        
      } catch (error) {
        console.error('Error analyzing content:', error);
        schemaInfoEl.innerHTML = `
          <div class="validation-errors">
            <p>Error analyzing content:</p>
            <p class="error">${error.message || 'Unknown error'}</p>
          </div>
        `;
      }
    }
  }
}

// Keyword Database
function initKeywordDatabase() {
  const searchBtn = document.getElementById('search-keyword-btn');
  const keywordInput = document.getElementById('keyword-search');
  let keywordTrendChart = null;
  
  if (!searchBtn || !keywordInput) return;
  
  const mockKeywordData = {
    'seo': {
      volume: '165,000',
      difficulty: 'High',
      cpc: '$12.50',
      related: ['seo tools', 'seo services', 'seo agency', 'search engine optimization'],
      trend: [58, 62, 60, 65, 70, 68, 75, 80, 82, 85, 80, 78]
    },
    'content marketing': {
      volume: '90,500',
      difficulty: 'Medium',
      cpc: '$8.30',
      related: ['content strategy', 'content creation', 'content marketing services', 'digital marketing'],
      trend: [50, 52, 55, 60, 65, 70, 72, 75, 70, 68, 66, 64]
    },
    'digital marketing': {
      volume: '246,000',
      difficulty: 'High',
      cpc: '$15.20',
      related: ['online marketing', 'social media marketing', 'internet marketing', 'digital advertising'],
      trend: [65, 68, 70, 75, 80, 85, 82, 80, 78, 82, 85, 88]
    },
    'keyword research': {
      volume: '74,000',
      difficulty: 'Medium',
      cpc: '$10.60',
      related: ['keyword tools', 'seo keywords', 'keyword planner', 'keyword analysis'],
      trend: [60, 62, 65, 68, 72, 75, 73, 70, 72, 75, 73, 70]
    },
    'link building': {
      volume: '40,500',
      difficulty: 'High',
      cpc: '$14.30',
      related: ['backlinks', 'quality links', 'link building services', 'link building strategies'],
      trend: [45, 48, 50, 55, 58, 60, 62, 65, 63, 60, 58, 55]
    }
  };
  
  searchBtn.addEventListener('click', () => {
    const keyword = keywordInput.value.toLowerCase().trim();
    if (!keyword) return;
    
    // Search in mock data
    let data = null;
    
    for (const key in mockKeywordData) {
      if (key.includes(keyword) || keyword.includes(key)) {
        data = mockKeywordData[key];
        break;
      }
    }
    
    // If no exact match, find the first related keyword that matches
    if (!data) {
      for (const key in mockKeywordData) {
        const related = mockKeywordData[key].related;
        if (related.some(r => r.includes(keyword) || keyword.includes(r))) {
          data = mockKeywordData[key];
          break;
        }
      }
    }
    
    // If still no match, use a default
    if (!data) {
      data = {
        volume: 'No data',
        difficulty: 'N/A',
        cpc: 'N/A',
        related: ['No related keywords found'],
        trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
    }
    
    // Update UI
    const keywordSearchResultsEl = document.getElementById('keyword-search-results');
    const relatedKeywordsEl = document.getElementById('related-keywords');
    const chartCanvas = document.getElementById('keywordTrendChart');
    
    if (keywordSearchResultsEl) {
      keywordSearchResultsEl.innerHTML = `
        <div class="keyword-header">
          <h3>${keyword}</h3>
        </div>
        <div class="keyword-details">
          <div class="detail-item">
            <div class="detail-label">Search Volume</div>
            <div class="detail-value">${data.volume}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Keyword Difficulty</div>
            <div class="detail-value">${data.difficulty}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Cost Per Click</div>
            <div class="detail-value">${data.cpc}</div>
          </div>
        </div>
      `;
    }
    
    if (relatedKeywordsEl) {
      relatedKeywordsEl.innerHTML = `
        <ul class="related-list">
          ${data.related.map(rel => `<li>${rel}</li>`).join('')}
        </ul>
      `;
    }
    
    // Create/update trend chart
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      
      if (keywordTrendChart) {
        keywordTrendChart.destroy();
      }
      
      keywordTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Search Trend',
            data: data.trend,
            backgroundColor: 'rgba(74, 144, 226, 0.2)',
            borderColor: 'rgba(74, 144, 226, 1)',
            borderWidth: 2,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Interest Over Time (0-100)'
              }
            },
            x: {
              ticks: {
                autoSkip: true,
                maxRotation: 0
              }
            }
          }
        }
      });
    }
  });
}

// Sentiment Analysis
function initSentimentAnalysis() {
  const optionBtns = document.querySelectorAll('.option-btn');
  const inputAreas = document.querySelectorAll('.input-area');
  const analyzeBtn = document.getElementById('analyze-sentiment-btn');
  const fileInput = document.getElementById('document-upload');
  const fileNameDisplay = document.getElementById('file-name');
  
  if (!optionBtns.length || !inputAreas.length || !analyzeBtn || !fileInput || !fileNameDisplay) return;
  
  let conversationHistory = [];
  
  // Toggle between input methods
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const source = btn.getAttribute('data-source');
      
      // Update active button
      optionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Show/hide appropriate input area
      inputAreas.forEach(area => area.classList.add('hidden'));
      const sourceContentEl = document.getElementById(`${source}-content`);
      if (sourceContentEl) {
        sourceContentEl.classList.remove('hidden');
      }
    });
  });
  
  // Display filename when file is selected
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileNameDisplay.textContent = e.target.files[0].name;
    } else {
      fileNameDisplay.textContent = '';
    }
  });
  
  // Analyze sentiment
  analyzeBtn.addEventListener('click', async () => {
    let content = '';
    
    // Get active input method
    const activeOption = document.querySelector('.option-btn.active');
    if (!activeOption) return;
    
    const source = activeOption.getAttribute('data-source');
    
    // Get content based on input method
    if (source === 'paste') {
      const contentEl = document.getElementById('sentiment-content');
      content = contentEl ? contentEl.value : '';
    } else if (source === 'url') {
      const urlEl = document.getElementById('sentiment-url');
      content = urlEl ? urlEl.value : '';
      // In a real app, this would fetch the URL content
      content = `This is simulated content from the URL: ${content}. Since this is a demo, we'll analyze the URL itself.`;
    } else if (source === 'file') {
      if (fileInput.files.length > 0) {
        // Read file content
        try {
          const file = fileInput.files[0];
          const reader = new FileReader();
          content = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
          });
        } catch (error) {
          alert('Error reading file: ' + error.message);
          return;
        }
      } else {
        alert('Please select a file to analyze.');
        return;
      }
    }
    
    if (!content) {
      alert('Please provide content to analyze.');
      return;
    }
    
    // Perform actual sentiment analysis using AI
    try {
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a sentiment and content analysis expert. Analyze the provided text and determine its sentiment and content characteristics.
            Respond directly with JSON, following this JSON schema, and no other text:
            {
              "overallSentiment": number, // value between -1 (very negative) and 1 (very positive)
              "sentimentBreakdown": {
                "positive": number, // percentage (0-100)
                "negative": number, // percentage (0-100)
                "neutral": number // percentage (0-100)
              },
              "contentAnalysis": {
                "estimatedHeadings": number,
                "estimatedParagraphs": number,
                "estimatedSentences": number,
                "topTopics": string[], // 3 likely topics of the content
                "topKeywords": [
                  {"term": string, "relevance": string, "density": string}
                  // 3 objects with these properties
                ]
              }
            }`
          },
          {
            role: "user",
            content: content
          }
        ],
        json: true
      });
      
      const result = JSON.parse(completion.content);
      
      // Update sentiment meter
      const sentimentFillEl = document.querySelector('.sentiment-fill');
      const sentimentValueEl = document.querySelector('.sentiment-value');
      const positiveScoreEl = document.getElementById('positive-score');
      const negativeScoreEl = document.getElementById('negative-score');
      const neutralScoreEl = document.getElementById('neutral-score');
      const headingAnalysisEl = document.getElementById('heading-analysis');
      const contextAnalysisEl = document.getElementById('context-analysis');
      const keywordRelevanceEl = document.getElementById('keyword-relevance');
      
      // Convert sentiment score (-1 to 1) to percentage (0-100)
      const normalizedScore = ((result.overallSentiment + 1) / 2) * 100;
      
      if (sentimentFillEl) {
        sentimentFillEl.style.width = `${normalizedScore}%`;
      }
      
      let sentimentText = 'Neutral';
      if (result.overallSentiment > 0.3) sentimentText = 'Positive';
      if (result.overallSentiment < -0.3) sentimentText = 'Negative';
      
      if (sentimentValueEl) {
        sentimentValueEl.textContent = `${sentimentText} (${result.overallSentiment.toFixed(2)})`;
      }
      
      // Update sentiment breakdown
      if (positiveScoreEl) positiveScoreEl.textContent = `${result.sentimentBreakdown.positive.toFixed(1)}%`;
      if (negativeScoreEl) negativeScoreEl.textContent = `${result.sentimentBreakdown.negative.toFixed(1)}%`;
      if (neutralScoreEl) neutralScoreEl.textContent = `${result.sentimentBreakdown.neutral.toFixed(1)}%`;
      
      // Update heading structure analysis
      if (headingAnalysisEl) {
        headingAnalysisEl.innerHTML = `
          <p>Content appears to be ${content.length > 500 ? 'well-structured' : 'too short for proper structure'}.</p>
          <ul>
            <li>Estimated headings: ${result.contentAnalysis.estimatedHeadings}</li>
            <li>Paragraph count: ${result.contentAnalysis.estimatedParagraphs}</li>
            <li>Sentences: ${result.contentAnalysis.estimatedSentences}</li>
          </ul>
        `;
      }
      
      // Update context analysis
      if (contextAnalysisEl) {
        contextAnalysisEl.innerHTML = `
          <p>The content appears to be about:</p>
          <ul>
            ${result.contentAnalysis.topTopics.map(topic => `<li>${topic}</li>`).join('')}
          </ul>
        `;
      }
      
      // Update keyword relevance
      if (keywordRelevanceEl) {
        keywordRelevanceEl.innerHTML = `
          <table>
            <tr>
              <th>Keyword</th>
              <th>Relevance</th>
              <th>Density</th>
            </tr>
            ${result.contentAnalysis.topKeywords.map(kw => `
              <tr>
                <td>${kw.term}</td>
                <td>${kw.relevance}</td>
                <td>${kw.density}</td>
              </tr>
            `).join('')}
          </table>
        `;
      }
    } catch (error) {
      console.error('Error analyzing content:', error);
      alert('Error analyzing content: ' + error.message);
    }
  });
}

// Content Editor
function initContentEditor() {
  // Initialize markdown editor
  const markdownEditor = document.getElementById('markdownEditor');
  const markdownPreview = document.getElementById('markdownPreview');
  const editorButtons = document.querySelectorAll('.toolbar button[data-command]');
  
  // Skip if elements don't exist
  if (!markdownEditor || !markdownPreview || !editorButtons.length) return;
  
  // Initialize mermaid if available
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
  }
  
  // Markdown preview update
  markdownEditor.addEventListener('input', updateMarkdownPreview);
  updateMarkdownPreview();
  
  // Markdown toolbar buttons
  editorButtons.forEach(button => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');
      applyMarkdownCommand(command);
    });
  });
  
  // Mermaid functionality
  const mermaidEditor = document.getElementById('mermaidEditor');
  const mermaidPreview = document.getElementById('mermaidPreview');
  const mermaidTemplates = document.getElementById('mermaidTemplates');
  const exportMermaidBtn = document.getElementById('exportMermaid');
  
  if (mermaidEditor && mermaidPreview) {
    mermaidEditor.addEventListener('input', updateMermaidPreview);
    updateMermaidPreview();
    
    if (mermaidTemplates) {
      mermaidTemplates.addEventListener('change', () => {
        const template = mermaidTemplates.value;
        if (!template) return;
        
        let code = '';
        
        switch(template) {
          case 'flowchart':
            code = `graph TD
        A[Start] --> B{Decision}
        B -->|Yes| C[Action 1]
        B -->|No| D[Action 2]
        C --> E[Result 1]
        D --> E`;
            break;
          case 'sequence':
            code = `sequenceDiagram
        participant A as User
        participant B as System
        A->>B: Request Data
        B->>B: Process Data
        B->>A: Return Result`;
            break;
          case 'gantt':
            code = `gantt
        title Project Schedule
        dateFormat  YYYY-MM-DD
        section Planning
        Requirements  :done, a1, 2023-01-01, 7d
        Design        :a2, after a1, 10d
        section Development
        Coding        :a3, after a2, 15d
        Testing       :a4, after a3, 5d`;
            break;
        }
        
        mermaidEditor.value = code;
        updateMermaidPreview();
      });
    }
    
    if (exportMermaidBtn) {
      exportMermaidBtn.addEventListener('click', () => {
        // This would require additional code for real SVG export
        alert('In a production environment, this would export the diagram as SVG.');
      });
    }
  }
  
  function updateMarkdownPreview() {
    const markdown = markdownEditor.value;
    if (typeof marked !== 'undefined') {
      markdownPreview.innerHTML = marked.parse(markdown);
    } else {
      markdownPreview.innerHTML = `<p>Markdown preview not available. Marked.js is required.</p>`;
    }
  }
  
  function applyMarkdownCommand(command) {
    const textarea = markdownEditor;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let replacement = '';
    
    switch(command) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](url)`;
        break;
      case 'code':
        replacement = `\`${selectedText || 'code'}\``;
        break;
      case 'image':
        replacement = `![${selectedText || 'alt text'}](image-url)`;
        break;
      case 'table':
        replacement = `| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Row 1 Col 1 | Row 1 Col 2 | Row 1 Col 3 |\n| Row 2 Col 1 | Row 2 Col 2 | Row 2 Col 3 |`;
        break;
    }
    
    textarea.focus();
    
    if (typeof textarea.setRangeText === 'function') {
      textarea.setRangeText(replacement, start, end);
      textarea.selectionStart = start + replacement.length;
      textarea.selectionEnd = start + replacement.length;
    } else {
      // Fallback for older browsers
      const beforeText = textarea.value.substring(0, start);
      const afterText = textarea.value.substring(end);
      textarea.value = beforeText + replacement + afterText;
    }
    
    updateMarkdownPreview();
  }
  
  function updateMermaidPreview() {
    if (typeof mermaid === 'undefined') {
      mermaidPreview.innerHTML = `<div class="error">Mermaid library not loaded</div>`;
      return;
    }
    
    try {
      const code = mermaidEditor.value;
      // Clear previous diagram before rendering new one
      mermaidPreview.innerHTML = '';
      const tempDiv = document.createElement('div');
      tempDiv.className = 'mermaid';
      tempDiv.textContent = code;
      mermaidPreview.appendChild(tempDiv);
      
      mermaid.init(undefined, '.mermaid');
    } catch (error) {
      mermaidPreview.innerHTML = `<div class="error">Diagram Error: ${error.message}</div>`;
    }
  }
}

// AI Chatbot
function initAIChatbot() {
  const chatButton = document.getElementById('chat-button');
  const chatContainer = document.getElementById('chat-container');
  const closeChat = document.getElementById('close-chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  
  if (!chatButton || !chatContainer || !closeChat || !chatMessages || !chatInput || !sendButton) return;
  
  let conversationHistory = [];
  
  // Toggle chat window
  chatButton.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
    
    // Add greeting message if this is the first open
    if (chatMessages.children.length === 0) {
      addBotMessage(config.chatbotGreeting);
    }
  });
  
  closeChat.addEventListener('click', () => {
    chatContainer.style.display = 'none';
  });
  
  // Send message
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    chatInput.value = '';
    
    // Save to conversation history
    conversationHistory.push({
      role: "user",
      content: message
    });
    
    // Process with AI
    processWithAI(message);
  }
  
  async function processWithAI(message) {
    try {
      // Show typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'message bot-message typing-indicator';
      typingIndicator.textContent = '...';
      chatMessages.appendChild(typingIndicator);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // This is where you would normally call an external API
      // For this demo, we'll simulate a response
      await simulateTyping();
      
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);
      
      // Generate a response based on the message
      let response = '';
      
      if (message.toLowerCase().includes('keyword')) {
        response = "Keyword research is essential for SEO. Start by identifying relevant terms your audience uses, analyze competition, and focus on long-tail keywords with reasonable search volume.";
      } else if (message.toLowerCase().includes('meta')) {
        response = "Meta tags help search engines understand your content. Ensure your title is under 60 characters, descriptions are around 155 characters, and both contain relevant keywords naturally.";
      } else if (message.toLowerCase().includes('schema')) {
        response = "Schema markup helps search engines understand your content context. LocalBusiness schema is great for companies with physical locations, while Product schema can enhance e-commerce listings with rich results.";
      } else if (message.toLowerCase().includes('analyze') || message.toLowerCase().includes('content')) {
        response = "For content analysis, focus on readability scores, keyword density, and sentiment. Aim for Flesch Reading Ease scores of 60-70 for general audiences, and maintain keyword density around 1-2%.";
      } else if (message.toLowerCase().includes('readability')) {
        response = "Readability is crucial for user engagement. The Flesch Reading Ease score measures how easy your content is to read. Higher scores (70-100) are easier to read. Most online content should aim for scores between 60-70, suitable for 8th-9th grade reading levels.";
      } else if (message.toLowerCase().includes('seo')) {
        response = "SEO combines technical optimization, quality content, and backlink building. Start with keyword research, optimize your on-page elements, create valuable content, and build high-quality backlinks from reputable sites.";
      } else {
        response = "I can help with keyword research, content analysis, meta tags, schema markup, and more. What specific SEO aspect would you like information about?";
      }
      
      // Add response to chat
      addBotMessage(response);
      
      // Save to conversation history
      conversationHistory.push({
        role: "assistant",
        content: response
      });
      
      // Only keep the last 10 messages for context
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      addBotMessage("I'm sorry, I couldn't process your request. Please try again.");
    }
  }
  
  function addUserMessage(text) {
    const message = document.createElement('div');
    message.className = 'message user-message';
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function addBotMessage(text) {
    const message = document.createElement('div');
    message.className = 'message bot-message';
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  async function simulateTyping() {
    return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  }
}

// Backlink Checker
function initBacklinkChecker() {
  const checkBtn = document.getElementById('check-backlinks-btn');
  const domainInput = document.getElementById('backlink-domain');
  let backlinkChart = null;
  
  if (!checkBtn || !domainInput) return;
  
  checkBtn.addEventListener('click', () => {
    const domain = domainInput.value.trim();
    if (!domain) {
      alert('Please enter a domain to analyze');
      return;
    }
    
    // Mock backlink data - in a real app, this would come from an API call
    analyzeBacklinks(domain);
  });
  
  function analyzeBacklinks(domain) {
    // Show loading state
    document.getElementById('backlink-summary').innerHTML = '<div class="loading">Analyzing backlinks...</div>';
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock data
      const mockData = generateMockBacklinkData(domain);
      
      // Update UI with backlink data
      updateBacklinkUI(mockData);
    }, 1500);
  }
  
  function generateMockBacklinkData(domain) {
    // Create realistic-looking mock data
    const totalBacklinks = Math.floor(Math.random() * 5000) + 500;
    const referringDomains = Math.floor(totalBacklinks / (Math.random() * 5 + 3));
    const doFollowLinks = Math.floor(totalBacklinks * (0.4 + Math.random() * 0.3));
    const noFollowLinks = totalBacklinks - doFollowLinks;
    
    // Domain authority - higher for more well-known domains
    let domainAuthority = 20 + Math.floor(Math.random() * 30);
    if (domain.includes('google') || domain.includes('amazon') || domain.includes('facebook')) {
      domainAuthority = 80 + Math.floor(Math.random() * 15);
    } else if (domain.includes('com') || domain.includes('org') || domain.includes('net')) {
      domainAuthority += 10;
    }
    
    // Create mock referring domains
    const mockDomains = [
      {name: 'example.com', backlinks: Math.floor(Math.random() * 50) + 5, authority: 35 + Math.floor(Math.random() * 20)},
      {name: 'blog.com', backlinks: Math.floor(Math.random() * 40) + 3, authority: 40 + Math.floor(Math.random() * 15)},
      {name: 'news.org', backlinks: Math.floor(Math.random() * 30) + 2, authority: 45 + Math.floor(Math.random() * 20)},
      {name: 'reference.net', backlinks: Math.floor(Math.random() * 20) + 1, authority: 30 + Math.floor(Math.random() * 25)},
      {name: 'directory.io', backlinks: Math.floor(Math.random() * 15) + 1, authority: 25 + Math.floor(Math.random() * 15)}
    ];
    
    // Generate more realistic domain list
    const topLevelDomains = ['.com', '.org', '.net', '.io', '.co', '.info', '.edu'];
    const prefixes = ['blog', 'news', 'digital', 'online', 'tech', 'web'];
    const domainWords = ['marketing', 'business', 'review', 'today', 'weekly', 'hub', 'central'];
    
    const extraDomains = [];
    for (let i = 0; i < 15; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const word = domainWords[Math.floor(Math.random() * domainWords.length)];
      const tld = topLevelDomains[Math.floor(Math.random() * topLevelDomains.length)];
      
      extraDomains.push({
        name: `${prefix}-${word}${tld}`,
        backlinks: Math.floor(Math.random() * 15) + 1,
        authority: 10 + Math.floor(Math.random() * 40)
      });
    }
    
    const allDomains = [...mockDomains, ...extraDomains];
    
    // Create mock backlinks
    const backlinks = [];
    const anchorTexts = ['click here', 'website', domain.split('.')[0], 'learn more', 'read more', 'source', 'reference'];
    const paths = ['/', '/about', '/blog', '/products', '/services', '/contact', '/resources'];
    
    for (let i = 0; i < 25; i++) {
      const sourceDomain = allDomains[Math.floor(Math.random() * allDomains.length)].name;
      const anchorText = anchorTexts[Math.floor(Math.random() * anchorTexts.length)];
      const targetPath = paths[Math.floor(Math.random() * paths.length)];
      const sourcePath = paths[Math.floor(Math.random() * paths.length)];
      const doFollow = Math.random() > 0.3;
      
      backlinks.push({
        sourceUrl: `https://${sourceDomain}${sourcePath}`,
        targetUrl: `https://${domain}${targetPath}`,
        anchorText: anchorText,
        doFollow: doFollow,
        firstSeen: getRandomDate(365),
        lastSeen: getRandomDate(30)
      });
    }
    
    return {
      domain: domain,
      totalBacklinks: totalBacklinks,
      referringDomains: referringDomains,
      doFollowLinks: doFollowLinks,
      noFollowLinks: noFollowLinks,
      domainAuthority: domainAuthority,
      domains: allDomains.sort((a, b) => b.backlinks - a.backlinks).slice(0, 15),
      backlinks: backlinks,
      monthlyTrend: [
        totalBacklinks - Math.floor(Math.random() * 100) - 200,
        totalBacklinks - Math.floor(Math.random() * 80) - 150,
        totalBacklinks - Math.floor(Math.random() * 60) - 100,
        totalBacklinks - Math.floor(Math.random() * 40) - 50,
        totalBacklinks - Math.floor(Math.random() * 20),
        totalBacklinks
      ]
    };
  }
  
  function getRandomDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date.toISOString().substring(0, 10);
  }
  
  function updateBacklinkUI(data) {
    // Update summary
    const backlinkSummaryEl = document.getElementById('backlink-summary');
    if (backlinkSummaryEl) {
      backlinkSummaryEl.innerHTML = `
        <div class="stat-visualization">
          <div class="stat-metric">
            <h4>Total Backlinks</h4>
            <div class="stat-value">${data.totalBacklinks.toLocaleString()}</div>
          </div>
          <div class="stat-metric">
            <h4>Referring Domains</h4>
            <div class="stat-value">${data.referringDomains.toLocaleString()}</div>
          </div>
          <div class="stat-metric">
            <h4>Domain Authority</h4>
            <div class="stat-value">${data.domainAuthority}</div>
          </div>
          <div class="stat-metric">
            <h4>DoFollow Links</h4>
            <div class="stat-value">${data.doFollowLinks.toLocaleString()}</div>
          </div>
        </div>
      `;
    }
    
    // Update referring domains
    const referringDomainsEl = document.getElementById('referring-domains');
    if (referringDomainsEl) {
      let domainsHTML = `
        <table class="data-table">
          <tr>
            <th>Domain</th>
            <th>Backlinks</th>
            <th>Authority</th>
          </tr>
      `;
      
      data.domains.forEach(domain => {
        domainsHTML += `
          <tr>
            <td>${domain.name}</td>
            <td>${domain.backlinks}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${domain.authority}%"></div>
                <span>${domain.authority}</span>
              </div>
            </td>
          </tr>
        `;
      });
      
      domainsHTML += '</table>';
      referringDomainsEl.innerHTML = domainsHTML;
    }
    
    // Update backlink list
    const backlinksListEl = document.getElementById('backlink-list');
    if (backlinksListEl) {
      let backlinksHTML = `
        <table class="data-table">
          <tr>
            <th>Source URL</th>
            <th>Anchor Text</th>
            <th>Type</th>
            <th>First Seen</th>
          </tr>
      `;
      
      data.backlinks.forEach(link => {
        backlinksHTML += `
          <tr>
            <td class="url-cell"><a href="${link.sourceUrl}" target="_blank">${link.sourceUrl}</a></td>
            <td>"${link.anchorText}"</td>
            <td><span class="tag ${link.doFollow ? 'tag-success' : 'tag-neutral'}">${link.doFollow ? 'DoFollow' : 'NoFollow'}</span></td>
            <td>${link.firstSeen}</td>
          </tr>
        `;
      });
      
      backlinksHTML += '</table>';
      backlinksListEl.innerHTML = backlinksHTML;
    }
    
    // Create domain map visualization
    const domainMapEl = document.getElementById('domainMap');
    if (domainMapEl) {
      let mapHTML = '<div class="domain-clusters">';
      
      // Use fixed positions instead of calculating based on sines/cosines
      const positions = [
        { top: 30, left: 150 }, { top: 70, left: 200 }, { top: 150, left: 250 },
        { top: 220, left: 200 }, { top: 250, left: 100 }, { top: 220, left: 40 },
        { top: 150, left: 20 }, { top: 70, left: 40 }, { top: 30, left: 90 },
        { top: 100, left: 60 }, { top: 150, left: 100 }, { top: 100, left: 200 },
        { top: 180, left: 150 }, { top: 130, left: 180 }, { top: 80, left: 130 },
      ];
      
      data.domains.forEach((domain, index) => {
        const size = 30 + (domain.backlinks * 3);
        const position = positions[Math.min(index, positions.length - 1)];
        const top = position.top;
        const left = position.left;
        const opacity = 0.6 + (domain.authority / 100) * 0.4;
        
        mapHTML += `
          <div class="domain-bubble" style="width: ${size}px; height: ${size}px; top: ${top}px; left: ${left}px; opacity: ${opacity};" 
               title="${domain.name} - ${domain.backlinks} backlinks">
            <span>${domain.name.substring(0, 8)}</span>
          </div>
        `;
      });
      
      // Add central domain
      mapHTML += `
        <div class="domain-bubble main-domain" style="width: 80px; height: 80px; top: 150px; left: 150px;" 
             title="${data.domain} - ${data.totalBacklinks} backlinks">
          <span>${data.domain.substring(0, 10)}</span>
        </div>
        
        <svg class="domain-links">
          ${data.domains.map((domain, index) => {
            const position = positions[Math.min(index, positions.length - 1)];
            const x1 = position.left + 15; // center of domain bubble
            const y1 = position.top + 15;
            const strokeWidth = Math.max(1, Math.min(5, domain.backlinks / 10));
            const opacity = 0.2 + (domain.backlinks / 50) * 0.8;
            
            return `<line x1="${x1}" y1="${y1}" x2="150" y2="150" 
                          stroke="var(--primary-color)" stroke-width="${strokeWidth}" 
                          opacity="${opacity}" />`;
          }).join('')}
        </svg>
      </div>`;
      
      domainMapEl.innerHTML = mapHTML;
    }
    
    // Create/update backlink chart
    const chartCanvas = document.getElementById('backlinkChart');
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      
      if (backlinkChart) {
        backlinkChart.destroy();
      }
      
      const theme = localStorage.getItem('themePref') || config.theme.defaultTheme;
      const chartColors = config.chartColors[theme] || config.chartColors.light;
      
      backlinkChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['6 months ago', '5 months ago', '4 months ago', '3 months ago', '2 months ago', 'Current'],
          datasets: [{
            label: 'Total Backlinks',
            data: data.monthlyTrend,
            fill: true,
            backgroundColor: chartColors.backgroundColor,
            borderColor: chartColors.borderColor,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Backlink Growth Trend'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Number of Backlinks'
              }
            }
          }
        }
      });
    }
  }
}

// Competitor Gap Analysis
function initCompetitorGap() {
  const analyzeBtn = document.getElementById('analyze-competitors-btn');
  const yourDomainInput = document.getElementById('your-domain');
  const competitor1Input = document.getElementById('competitor1');
  const competitor2Input = document.getElementById('competitor2');
  const competitor3Input = document.getElementById('competitor3');
  
  let competitorChart = null;
  let gapRadarChart = null;
  
  if (!analyzeBtn || !yourDomainInput || !competitor1Input) return;
  
  analyzeBtn.addEventListener('click', () => {
    const yourDomain = yourDomainInput.value.trim();
    const competitor1 = competitor1Input.value.trim();
    
    if (!yourDomain || !competitor1) {
      alert('Please enter your domain and at least one competitor');
      return;
    }
    
    // Get optional competitors
    const competitor2 = competitor2Input.value.trim();
    const competitor3 = competitor3Input.value.trim();
    
    // Array of competitors to analyze
    const competitors = [competitor1];
    if (competitor2) competitors.push(competitor2);
    if (competitor3) competitors.push(competitor3);
    
    // Analyze gap
    analyzeCompetitorGap(yourDomain, competitors);
  });
  
  function analyzeCompetitorGap(yourDomain, competitors) {
    // Show loading state
    document.getElementById('gap-metrics').innerHTML = '<div class="loading">Analyzing competitors...</div>';
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock data
      const gapData = generateMockGapData(yourDomain, competitors);
      
      // Update UI
      updateCompetitorGapUI(gapData);
    }, 1500);
  }
  
  function generateMockGapData(yourDomain, competitors) {
    // Create detailed mock data for gap analysis
    
    // Metrics for your domain
    const yourMetrics = {
      domain: yourDomain,
      trafficScore: 35 + Math.floor(Math.random() * 30),
      keywordCount: 800 + Math.floor(Math.random() * 500),
      backlinks: 1000 + Math.floor(Math.random() * 2000),
      contentCount: 50 + Math.floor(Math.random() * 50),
      domainAuthority: 30 + Math.floor(Math.random() * 20),
      socialSignals: 500 + Math.floor(Math.random() * 1000),
      loadSpeed: 80 + Math.floor(Math.random() * 15),
      mobileScore: 75 + Math.floor(Math.random() * 20)
    };
    
    // Generate competitor metrics
    const competitorMetrics = competitors.map(domain => {
      // Make well-known domains stronger
      const isMajorCompetitor = domain.includes('amazon') || domain.includes('google') || 
                               domain.includes('facebook') || domain.includes('shopify');
      
      // Generate realistic metrics with some competitors stronger, some weaker
      const variation = isMajorCompetitor ? 1.5 : (Math.random() > 0.5 ? 1.2 : 0.8);
      
      return {
        domain: domain,
        trafficScore: Math.floor(yourMetrics.trafficScore * variation * (0.8 + Math.random() * 0.4)),
        keywordCount: Math.floor(yourMetrics.keywordCount * variation * (0.8 + Math.random() * 0.4)),
        backlinks: Math.floor(yourMetrics.backlinks * variation * (0.8 + Math.random() * 0.4)),
        contentCount: Math.floor(yourMetrics.contentCount * variation * (0.8 + Math.random() * 0.4)),
        domainAuthority: Math.floor(yourMetrics.domainAuthority * variation * (0.8 + Math.random() * 0.4)),
        socialSignals: Math.floor(yourMetrics.socialSignals * variation * (0.8 + Math.random() * 0.4)),
        loadSpeed: Math.floor(yourMetrics.loadSpeed * (Math.random() > 0.5 ? 0.9 : 1.1)),
        mobileScore: Math.floor(yourMetrics.mobileScore * (Math.random() > 0.5 ? 0.9 : 1.1))
      };
    });
    
    // Generate keyword gaps
    const topKeywordGaps = [];
    const keywordTerms = ['seo', 'marketing', 'analytics', 'content', 'strategy', 'business', 'tools', 
                         'software', 'review', 'guide', 'tutorial', 'tips', 'best practices'];
    
    for (let i = 0; i < 15; i++) {
      const word1 = keywordTerms[Math.floor(Math.random() * keywordTerms.length)];
      const word2 = keywordTerms[Math.floor(Math.random() * keywordTerms.length)];
      const keyword = `${word1} ${word2}`;
      
      const difficulty = 10 + Math.floor(Math.random() * 80);
      const volume = 100 * Math.floor(Math.random() * 100);
      const competitorRanking = 1 + Math.floor(Math.random() * 10);
      const yourRanking = Math.random() > 0.7 ? 11 + Math.floor(Math.random() * 90) : 'Not ranking';
      
      topKeywordGaps.push({
        keyword,
        volume,
        difficulty,
        competitorRanking,
        yourRanking,
        opportunity: difficulty < 50 && volume > 1000 ? 'High' : 
                     difficulty < 70 && volume > 500 ? 'Medium' : 'Low'
      });
    }
    
    // Generate content opportunities
    const contentGaps = [];
    const contentTypes = ['Blog Post', 'Guide', 'Tutorial', 'Infographic', 'Video', 'Podcast', 'Case Study'];
    const contentTopics = [
      'SEO Strategy for 2023',
      'Content Marketing Best Practices',
      'Technical SEO Guide',
      'Local SEO Tips',
      'Mobile Optimization',
      'Voice Search Optimization',
      'Video SEO Guide',
      'Featured Snippets Guide',
      'E-commerce SEO Tips',
      'Link Building Strategies'
    ];
    
    for (let i = 0; i < Math.floor(Math.random() * 5) + 5; i++) {
      contentGaps.push({
        topic: contentTopics[Math.floor(Math.random() * contentTopics.length)],
        type: contentTypes[Math.floor(Math.random() * contentTypes.length)],
        competitor: competitors[Math.floor(Math.random() * competitors.length)],
        potential: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low'
      });
    }
    
    // Generate backlink opportunities
    const backlinkGaps = [];
    const domainTypes = ['.com', '.org', '.net', '.io', '.co'];
    const domainPrefixes = ['blog', 'news', 'digital', 'online', 'tech', 'web'];
    const domainWords = ['marketing', 'business', 'review', 'today', 'weekly', 'hub', 'central'];
    
    for (let i = 0; i < Math.floor(Math.random() * 5) + 5; i++) {
      const prefix = domainPrefixes[Math.floor(Math.random() * domainPrefixes.length)];
      const word = domainWords[Math.floor(Math.random() * domainWords.length)];
      const tld = domainTypes[Math.floor(Math.random() * domainTypes.length)];
      
      backlinkGaps.push({
        domain: `${prefix}-${word}${tld}`,
        authority: 20 + Math.floor(Math.random() * 60),
        linkingTo: competitors[Math.floor(Math.random() * competitors.length)],
        linkType: Math.random() > 0.3 ? 'DoFollow' : 'NoFollow',
        potential: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low'
      });
    }
    
    return {
      yourMetrics,
      competitorMetrics,
      topKeywordGaps,
      contentGaps,
      backlinkGaps
    };
  }
  
  function updateCompetitorGapUI(data) {
    // Update metrics overview
    const gapMetricsEl = document.getElementById('gap-metrics');
    if (gapMetricsEl) {
      let metricsHTML = '<div class="competitor-metrics">';
      
      // Your metrics first
      metricsHTML += `
        <div class="competitor-card your-domain">
          <h3>${data.yourMetrics.domain}</h3>
          <div class="metric-grid">
            <div class="metric">
              <div class="metric-label">Traffic Score</div>
              <div class="metric-value">${data.yourMetrics.trafficScore}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Keywords</div>
              <div class="metric-value">${data.yourMetrics.keywordCount.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Backlinks</div>
              <div class="metric-value">${data.yourMetrics.backlinks.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Domain Authority</div>
              <div class="metric-value">${data.yourMetrics.domainAuthority}</div>
            </div>
          </div>
        </div>
      `;
      
      // Competitor metrics
      data.competitorMetrics.forEach(competitor => {
        metricsHTML += `
          <div class="competitor-card">
            <h3>${competitor.domain}</h3>
            <div class="metric-grid">
              <div class="metric">
                <div class="metric-label">Traffic Score</div>
                <div class="metric-value ${competitor.trafficScore > data.yourMetrics.trafficScore ? 'metric-higher' : 'metric-lower'}">${competitor.trafficScore}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Keywords</div>
                <div class="metric-value ${competitor.keywordCount > data.yourMetrics.keywordCount ? 'metric-higher' : 'metric-lower'}">${competitor.keywordCount.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Backlinks</div>
                <div class="metric-value ${competitor.backlinks > data.yourMetrics.backlinks ? 'metric-higher' : 'metric-lower'}">${competitor.backlinks.toLocaleString()}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Domain Authority</div>
                <div class="metric-value ${competitor.domainAuthority > data.yourMetrics.domainAuthority ? 'metric-higher' : 'metric-lower'}">${competitor.domainAuthority}</div>
              </div>
            </div>
          </div>
        `;
      });
      
      metricsHTML += '</div>';
      gapMetricsEl.innerHTML = metricsHTML;
    }
    
    // Update keyword gaps
    const keywordGapsEl = document.getElementById('keyword-gaps');
    if (keywordGapsEl) {
      let gapsHTML = `
        <table class="data-table">
          <tr>
            <th>Keyword</th>
            <th>Volume</th>
            <th>Difficulty</th>
            <th>Competitor Rank</th>
            <th>Your Rank</th>
            <th>Opportunity</th>
          </tr>
      `;
      
      data.topKeywordGaps.forEach(gap => {
        const opportunityClass = gap.opportunity === 'High' ? 'tag-success' : 
                                 gap.opportunity === 'Medium' ? 'tag-warning' : 'tag-neutral';
                                 
        gapsHTML += `
          <tr>
            <td>${gap.keyword}</td>
            <td>${gap.volume.toLocaleString()}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill ${gap.difficulty > 70 ? 'hard' : gap.difficulty > 40 ? 'medium' : 'easy'}" style="width: ${gap.difficulty}%"></div>
                <span>${gap.difficulty}</span>
              </div>
            </td>
            <td>#${gap.competitorRanking}</td>
            <td>${gap.yourRanking}</td>
            <td><span class="tag ${opportunityClass}">${gap.opportunity}</span></td>
          </tr>
        `;
      });
      
      gapsHTML += '</table>';
      keywordGapsEl.innerHTML = gapsHTML;
    }
    
    // Update content opportunities
    const contentOppsEl = document.getElementById('content-opportunities');
    if (contentOppsEl) {
      let contentHTML = `
        <table class="data-table">
          <tr>
            <th>Topic</th>
            <th>Content Type</th>
            <th>Competitor</th>
            <th>Potential</th>
          </tr>
      `;
      
      data.contentGaps.forEach(gap => {
        const potentialClass = gap.potential === 'High' ? 'tag-success' : 
                              gap.potential === 'Medium' ? 'tag-warning' : 'tag-neutral';
                              
        contentHTML += `
          <tr>
            <td>${gap.topic}</td>
            <td>${gap.type}</td>
            <td>${gap.competitor}</td>
            <td><span class="tag ${potentialClass}">${gap.potential}</span></td>
          </tr>
        `;
      });
      
      contentHTML += '</table>';
      contentOppsEl.innerHTML = contentHTML;
    }
    
    // Update backlink opportunities
    const backlinkOppsEl = document.getElementById('backlink-opportunities');
    if (backlinkOppsEl) {
      let backlinkHTML = `
        <table class="data-table">
          <tr>
            <th>Domain</th>
            <th>Authority</th>
            <th>Links To</th>
            <th>Link Type</th>
            <th>Potential</th>
          </tr>
      `;
      
      data.backlinkGaps.forEach(gap => {
        const potentialClass = gap.potential === 'High' ? 'tag-success' : 
                              gap.potential === 'Medium' ? 'tag-warning' : 'tag-neutral';
                              
        backlinkHTML += `
          <tr>
            <td>${gap.domain}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${gap.authority}%"></div>
                <span>${gap.authority}</span>
              </div>
            </td>
            <td>${gap.linkingTo}</td>
            <td><span class="tag ${gap.linkType === 'DoFollow' ? 'tag-success' : 'tag-neutral'}">${gap.linkType}</span></td>
            <td><span class="tag ${potentialClass}">${gap.potential}</span></td>
          </tr>
        `;
      });
      
      backlinkHTML += '</table>';
      backlinkOppsEl.innerHTML = backlinkHTML;
    }
    
    // Create/update competitor comparison chart
    const chartCanvas = document.getElementById('competitorChart');
    if (chartCanvas) {
      const ctx = chartCanvas.getContext('2d');
      
      if (competitorChart) {
        competitorChart.destroy();
      }
      
      const theme = localStorage.getItem('themePref') || config.theme.defaultTheme;
      const chartColors = config.chartColors[theme] || config.chartColors.light;
      
      // Prepare data for the chart
      const labels = ['Traffic Score', 'Keywords', 'Backlinks', 'Domain Authority'];
      
      // Normalize data to be comparable
      const maxKeywords = Math.max(
        data.yourMetrics.keywordCount, 
        ...data.competitorMetrics.map(c => c.keywordCount)
      );
      
      const maxBacklinks = Math.max(
        data.yourMetrics.backlinks, 
        ...data.competitorMetrics.map(c => c.backlinks)
      );
      
      const normalizeKeywords = (value) => (value / maxKeywords) * 100;
      const normalizeBacklinks = (value) => (value / maxBacklinks) * 100;
      
      // Your domain dataset
      const yourData = [
        data.yourMetrics.trafficScore,
        normalizeKeywords(data.yourMetrics.keywordCount),
        normalizeBacklinks(data.yourMetrics.backlinks),
        data.yourMetrics.domainAuthority
      ];
      
      // Competitors datasets
      const competitorDatasets = data.competitorMetrics.map((competitor, index) => {
        return {
          label: competitor.domain,
          data: [
            competitor.trafficScore,
            normalizeKeywords(competitor.keywordCount),
            normalizeBacklinks(competitor.backlinks),
            competitor.domainAuthority
          ],
          backgroundColor: [
            chartColors.accentColor, 
            chartColors.secondAccent, 
            chartColors.thirdAccent, 
            'rgba(153, 102, 255, 0.6)'
          ][index % 4],
          borderColor: [
            chartColors.accentColor.replace('0.6', '1'), 
            chartColors.secondAccent.replace('0.6', '1'), 
            chartColors.thirdAccent.replace('0.6', '1'), 
            'rgba(153, 102, 255, 1)'
          ][index % 4],
          borderWidth: 1
        };
      });
      
      competitorChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: data.yourMetrics.domain,
              data: yourData,
              backgroundColor: chartColors.backgroundColor,
              borderColor: chartColors.borderColor,
              borderWidth: 1
            },
            ...competitorDatasets
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Score (Normalized)'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Competitor Comparison'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.raw;
                  
                  // For keywords and backlinks, show the actual values
                  if (context.dataIndex === 1) { // Keywords
                    const actualValue = context.datasetIndex === 0 
                      ? data.yourMetrics.keywordCount 
                      : data.competitorMetrics[context.datasetIndex - 1].keywordCount;
                    return `${label}: ${actualValue.toLocaleString()} keywords`;
                  } else if (context.dataIndex === 2) { // Backlinks
                    const actualValue = context.datasetIndex === 0 
                      ? data.yourMetrics.backlinks 
                      : data.competitorMetrics[context.datasetIndex - 1].backlinks;
                    return `${label}: ${actualValue.toLocaleString()} backlinks`;
                  }
                  
                  return `${label}: ${value}`;
                }
              }
            }
          }
        }
      });
    }
    
    // Create radar chart for gap analysis
    const radarCanvas = document.getElementById('gapRadarChart');
    if (radarCanvas) {
      const ctx = radarCanvas.getContext('2d');
      
      if (gapRadarChart) {
        gapRadarChart.destroy();
      }
      
      const theme = localStorage.getItem('themePref') || config.theme.defaultTheme;
      const chartColors = config.chartColors[theme] || config.chartColors.light;
      
      // Radar chart with more comprehensive metrics
      const labels = [
        'Traffic Score', 
        'Keywords', 
        'Backlinks', 
        'Content Count', 
        'Domain Authority', 
        'Social Signals',
        'Load Speed',
        'Mobile Score'
      ];
      
      // Normalize all data for radar chart
      const maxValues = {
        trafficScore: Math.max(data.yourMetrics.trafficScore, ...data.competitorMetrics.map(c => c.trafficScore)),
        keywordCount: Math.max(data.yourMetrics.keywordCount, ...data.competitorMetrics.map(c => c.keywordCount)),
        backlinks: Math.max(data.yourMetrics.backlinks, ...data.competitorMetrics.map(c => c.backlinks)),
        contentCount: Math.max(data.yourMetrics.contentCount, ...data.competitorMetrics.map(c => c.contentCount)),
        domainAuthority: Math.max(data.yourMetrics.domainAuthority, ...data.competitorMetrics.map(c => c.domainAuthority)),
        socialSignals: Math.max(data.yourMetrics.socialSignals, ...data.competitorMetrics.map(c => c.socialSignals)),
        loadSpeed: Math.max(data.yourMetrics.loadSpeed, ...data.competitorMetrics.map(c => c.loadSpeed)),
        mobileScore: Math.max(data.yourMetrics.mobileScore, ...data.competitorMetrics.map(c => c.mobileScore))
      };
      
      const normalize = (value, metric) => (value / maxValues[metric]) * 100;
      
      // Your domain radar data
      const yourRadarData = [
        normalize(data.yourMetrics.trafficScore, 'trafficScore'),
        normalize(data.yourMetrics.keywordCount, 'keywordCount'),
        normalize(data.yourMetrics.backlinks, 'backlinks'),
        normalize(data.yourMetrics.contentCount, 'contentCount'),
        normalize(data.yourMetrics.domainAuthority, 'domainAuthority'),
        normalize(data.yourMetrics.socialSignals, 'socialSignals'),
        normalize(data.yourMetrics.loadSpeed, 'loadSpeed'),
        normalize(data.yourMetrics.mobileScore, 'mobileScore')
      ];
      
      // Competitors radar data
      const competitorRadarDatasets = data.competitorMetrics.map((competitor, index) => {
        return {
          label: competitor.domain,
          data: [
            normalize(competitor.trafficScore, 'trafficScore'),
            normalize(competitor.keywordCount, 'keywordCount'),
            normalize(competitor.backlinks, 'backlinks'),
            normalize(competitor.contentCount, 'contentCount'),
            normalize(competitor.domainAuthority, 'domainAuthority'),
            normalize(competitor.socialSignals, 'socialSignals'),
            normalize(competitor.loadSpeed, 'loadSpeed'),
            normalize(competitor.mobileScore, 'mobileScore')
          ],
          backgroundColor: [
            chartColors.accentColor, 
            chartColors.secondAccent, 
            chartColors.thirdAccent, 
            'rgba(153, 102, 255, 0.6)'
          ][index % 4].replace('0.6', '0.2'),
          borderColor: [
            chartColors.accentColor.replace('0.6', '1'), 
            chartColors.secondAccent.replace('0.6', '1'), 
            chartColors.thirdAccent.replace('0.6', '1'), 
            'rgba(153, 102, 255, 1)'
          ][index % 4],
          borderWidth: 1
        };
      });
      
      gapRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [
            {
              label: data.yourMetrics.domain,
              data: yourRadarData,
              backgroundColor: chartColors.backgroundColor,
              borderColor: chartColors.borderColor,
              borderWidth: 1
            },
            ...competitorRadarDatasets
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: {
                display: false
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Comprehensive Performance Comparison'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.dataset.label || '';
                  const index = context.dataIndex;
                  const metrics = ['trafficScore', 'keywordCount', 'backlinks', 'contentCount', 
                                 'domainAuthority', 'socialSignals', 'loadSpeed', 'mobileScore'];
                  const metric = metrics[index];
                  
                  const value = context.datasetIndex === 0 
                    ? data.yourMetrics[metric] 
                    : data.competitorMetrics[context.datasetIndex - 1][metric];
                  
                  // Format based on metric type
                  if (metric === 'keywordCount' || metric === 'backlinks' || metric === 'socialSignals') {
                    return `${label}: ${value.toLocaleString()}`;
                  } else {
                    return `${label}: ${value}`;
                  }
                }
              }
            }
          }
        }
      });
    }
  }
}
