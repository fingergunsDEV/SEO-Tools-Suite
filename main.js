// Tool navigation
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const toolContainers = document.querySelectorAll('.tool-container');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTool = button.dataset.tool;
      
      // Update active button
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show selected tool container
      toolContainers.forEach(container => {
        container.classList.remove('active');
        if (container.id === targetTool) {
          container.classList.add('active');
        }
      });
    });
  });
  
  // Set up the tools
  setupHtmlAnalyzer();
  setupKeywordDensity();
  setupTfIdf();
  setupReadability();
  setupMetaTags();
  setupSchemaGenerator();
  setupKeywordDatabase(); 
  setupSentimentAnalysis();
  setupContentEditor(); 
  setupChatbot();
  setupThemeSwitcher();
  setupApiManagement();
});

// HTML Analyzer Tool
function setupHtmlAnalyzer() {
  const analyzeBtn = document.querySelector('#html-analyzer .analyze-btn');
  const textArea = document.querySelector('#html-analyzer textarea');
  
  analyzeBtn.addEventListener('click', () => {
    const html = textArea.value.trim();
    if (!html) {
      alert('Please enter some HTML to analyze');
      return;
    }
    
    // Analyze HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Structure analysis
    const headings = {
      h1: doc.querySelectorAll('h1').length,
      h2: doc.querySelectorAll('h2').length,
      h3: doc.querySelectorAll('h3').length,
      h4: doc.querySelectorAll('h4').length,
      h5: doc.querySelectorAll('h5').length,
      h6: doc.querySelectorAll('h6').length
    };
    
    const images = doc.querySelectorAll('img');
    const links = doc.querySelectorAll('a');
    const paragraphs = doc.querySelectorAll('p');
    const lists = doc.querySelectorAll('ul, ol');
    const tables = doc.querySelectorAll('table');
    const internalLinks = Array.from(links).filter(link => {
      const href = link.getAttribute('href');
      return href && !href.startsWith('http') && !href.startsWith('//');
    }).length;
    const externalLinks = links.length - internalLinks;
    
    // SEO checks
    const seoIssues = [];
    const recommendations = [];
    
    // Check title
    const title = doc.querySelector('title');
    if (!title) {
      seoIssues.push('Missing title tag');
      recommendations.push('Add a title tag with a descriptive page title');
    } else if (title.textContent.length < 10) {
      seoIssues.push('Title tag is too short');
      recommendations.push('Make your title more descriptive (30-60 characters)');
    } else if (title.textContent.length > 60) {
      seoIssues.push('Title tag is too long');
      recommendations.push('Keep your title under 60 characters to prevent truncation in search results');
    }
    
    // Check meta description
    const metaDesc = doc.querySelector('meta[name="description"]');
    if (!metaDesc) {
      seoIssues.push('Missing meta description');
      recommendations.push('Add a meta description tag with a concise page summary');
    } else if (metaDesc.getAttribute('content').length < 50) {
      seoIssues.push('Meta description is too short');
      recommendations.push('Write a more descriptive meta description (50-160 characters)');
    } else if (metaDesc.getAttribute('content').length > 160) {
      seoIssues.push('Meta description is too long');
      recommendations.push('Keep your meta description under 160 characters');
    }
    
    // Check heading structure
    if (headings.h1 === 0) {
      seoIssues.push('No H1 heading found');
      recommendations.push('Add an H1 heading as the main title of your page');
    } else if (headings.h1 > 1) {
      seoIssues.push(`Multiple H1 headings found (${headings.h1})`);
      recommendations.push('Use only one H1 heading per page');
    }
    
    // Check heading hierarchy
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let prevLevel = 0;
    let hasHierarchyIssues = false;
    
    headingElements.forEach(el => {
      const level = parseInt(el.tagName.substring(1));
      if (level > prevLevel + 1 && prevLevel > 0) {
        hasHierarchyIssues = true;
      }
      prevLevel = level;
    });
    
    if (hasHierarchyIssues) {
      seoIssues.push('Improper heading hierarchy');
      recommendations.push('Ensure heading levels are sequential (H1 → H2 → H3, not H1 → H3)');
    }
    
    // Check images for alt text
    let imagesWithoutAlt = 0;
    images.forEach(img => {
      if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
        imagesWithoutAlt++;
      }
    });
    
    if (imagesWithoutAlt > 0) {
      seoIssues.push(`${imagesWithoutAlt} images missing alt text`);
      recommendations.push('Add descriptive alt text to all images');
    }
    
    // Check for canonical tag
    const canonical = doc.querySelector('link[rel="canonical"]');
    if (!canonical) {
      seoIssues.push('Missing canonical tag');
      recommendations.push('Add a canonical tag to prevent duplicate content issues');
    }
    
    // Check for viewport meta tag (mobile-friendly)
    const viewport = doc.querySelector('meta[name="viewport"]');
    if (!viewport) {
      seoIssues.push('Missing viewport meta tag');
      recommendations.push('Add a viewport meta tag for better mobile experience');
    }
    
    // Display results
    document.getElementById('structure-results').innerHTML = `
      <div class="result-item">
        <strong>Headings:</strong>
        <div>H1: ${headings.h1}, H2: ${headings.h2}, H3: ${headings.h3}, H4: ${headings.h4}, H5: ${headings.h5}, H6: ${headings.h6}</div>
      </div>
      <div class="result-item">
        <strong>Images:</strong> ${images.length}
      </div>
      <div class="result-item">
        <strong>Links:</strong> ${links.length} (Internal: ${internalLinks}, External: ${externalLinks})
      </div>
      <div class="result-item">
        <strong>Paragraphs:</strong> ${paragraphs.length}
      </div>
      <div class="result-item">
        <strong>Lists:</strong> ${lists.length}
      </div>
      <div class="result-item">
        <strong>Tables:</strong> ${tables.length}
      </div>
    `;
    
    document.getElementById('seo-issues').innerHTML = seoIssues.length > 0 ? 
      seoIssues.map(issue => `<div class="result-item warning">❌ ${issue}</div>`).join('') :
      '<div class="result-item success">✓ No major SEO issues found</div>';
    
    document.getElementById('recommendations').innerHTML = recommendations.length > 0 ?
      recommendations.map(rec => `<div class="result-item">→ ${rec}</div>`).join('') :
      '<div class="result-item success">✓ Your HTML structure looks good!</div>';
  });
}

// Keyword Density Tool
function setupKeywordDensity() {
  const analyzeBtn = document.querySelector('#keyword-density .analyze-btn');
  const textArea = document.querySelector('#keyword-density textarea');
  let keywordChart = null;
  
  analyzeBtn.addEventListener('click', () => {
    const content = textArea.value.trim();
    if (!content) {
      alert('Please enter some content to analyze');
      return;
    }
    
    // Extract text content if HTML is provided
    let textContent = content;
    if (content.includes('<') && content.includes('>')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      textContent = doc.body.textContent;
    }
    
    // Define common stopwords to exclude
    const stopwords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'to', 'at', 'in',
      'on', 'for', 'with', 'by', 'about', 'as', 'of', 'from', 'this', 'that',
      'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'our', 'us',
      'will', 'would', 'should', 'can', 'could', 'may', 'might'
    ]);
    
    // Process words
    const words = textContent.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove punctuation except hyphens
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopwords.has(word));
    
    // Process phrases (2-3 word combinations)
    const phrases = [];
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i] && words[i+1]) {
        phrases.push(words[i] + ' ' + words[i+1]); // 2-word phrase
      }
      
      if (i < words.length - 2 && words[i+2]) {
        phrases.push(words[i] + ' ' + words[i+1] + ' ' + words[i+2]); // 3-word phrase
      }
    }
    
    const wordCount = words.length;
    const wordFreq = {};
    const phraseFreq = {};
    
    // Count word frequencies
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Count phrase frequencies
    phrases.forEach(phrase => {
      phraseFreq[phrase] = (phraseFreq[phrase] || 0) + 1;
    });
    
    // Sort words by frequency
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
    
    // Sort phrases by frequency (only include phrases that appear more than once)
    const sortedPhrases = Object.entries(phraseFreq)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    // Calculate percentages
    const keywordData = sortedWords.map(([word, count]) => {
      const percentage = (count / wordCount * 100).toFixed(2);
      return { word, count, percentage };
    });
    
    const phraseData = sortedPhrases.map(([phrase, count]) => {
      const percentage = (count / (wordCount - phrase.split(' ').length + 1) * 100).toFixed(2);
      return { phrase, count, percentage };
    });
    
    // Display results
    let resultsHTML = '<h4>Single Keywords</h4>';
    
    resultsHTML += keywordData
      .map(({ word, count, percentage }) => 
        `<div class="result-item">
          <div><strong>${word}</strong> (${count} occurrences, ${percentage}%)</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
          </div>
        </div>`
      ).join('');
    
    if (phraseData.length > 0) {
      resultsHTML += '<h4 style="margin-top: 1.5rem;">Keyword Phrases</h4>';
      
      resultsHTML += phraseData
        .map(({ phrase, count, percentage }) => 
          `<div class="result-item">
            <div><strong>${phrase}</strong> (${count} occurrences, ${percentage}%)</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
          </div>`
        ).join('');
    }
    
    document.getElementById('keyword-results').innerHTML = resultsHTML;
    
    // Create chart
    const chartCanvas = document.getElementById('keywordChart');
    const ctx = chartCanvas.getContext('2d');
    
    // Destroy previous chart if it exists
    if (keywordChart) {
      keywordChart.destroy();
    }
    
    keywordChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: keywordData.slice(0, 10).map(d => d.word),
        datasets: [{
          label: 'Keyword Frequency',
          data: keywordData.slice(0, 10).map(d => d.count),
          backgroundColor: 'rgba(37, 117, 252, 0.7)'
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
              text: 'Occurrences'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Keywords'
            }
          }
        }
      }
    });
  });
}

// TF-IDF Analysis Tool
function setupTfIdf() {
  const analyzeBtn = document.querySelector('#tf-idf .analyze-btn');
  const textAreas = document.querySelectorAll('#tf-idf textarea');
  
  analyzeBtn.addEventListener('click', () => {
    const mainContent = textAreas[0].value.trim();
    const competitorContent = textAreas[1].value.trim();
    
    if (!mainContent) {
      alert('Please enter your content to analyze');
      return;
    }
    
    // Extract text if HTML is provided
    const extractText = (content) => {
      if (content.includes('<') && content.includes('>')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        return doc.body.textContent;
      }
      return content;
    };
    
    const mainText = extractText(mainContent);
    const competitorText = competitorContent ? extractText(competitorContent) : '';
    
    // Define common stopwords to exclude
    const stopwords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'to', 'at', 'in',
      'on', 'for', 'with', 'by', 'about', 'as', 'of', 'from', 'this', 'that',
      'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'our', 'us',
      'will', 'would', 'should', 'can', 'could', 'may', 'might'
    ]);
    
    // Process text into word frequencies
    const getWordFrequency = (text) => {
      const words = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopwords.has(word));
      
      const wordFreq = { _totalWords: words.length };
      
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      return wordFreq;
    };
    
    // Create term frequency function
    const calculateTF = (term, doc) => {
      if (!doc[term]) return 0;
      return doc[term] / doc._totalWords;
    };
    
    // Create inverse document frequency function
    const calculateIDF = (term, docs) => {
      // Count docs containing the term
      let docsWithTerm = 0;
      docs.forEach(doc => {
        if (doc[term]) docsWithTerm++;
      });
      
      // If term not found in any docs, return 0
      if (docsWithTerm === 0) return 0;
      
      // Calculate IDF
      return Math.log(docs.length / docsWithTerm);
    };
    
    // Analyze TF-IDF
    const mainWords = getWordFrequency(mainText);
    const docs = [mainWords];
    
    if (competitorText) {
      const competitorWords = getWordFrequency(competitorText);
      docs.push(competitorWords);
    }
    
    // Calculate TF-IDF scores
    const tfIdfScores = [];
    
    // Process all words from main document
    Object.keys(mainWords).forEach(word => {
      // Skip metadata
      if (word === '_totalWords') return;
      
      // Calculate term frequency
      const tf = calculateTF(word, mainWords);
      
      // Calculate inverse document frequency
      const idf = calculateIDF(word, docs);
      
      // Calculate TF-IDF
      const tfIdf = tf * idf;
      
      tfIdfScores.push({
        word,
        tf,
        idf,
        tfIdf,
        count: mainWords[word]
      });
    });
    
    // Sort by TF-IDF score
    tfIdfScores.sort((a, b) => b.tfIdf - a.tfIdf);
    
    // Display results
    const resultsElement = document.getElementById('tf-idf-results');
    
    // Create a table with the results
    let html = `
      <table class="tf-idf-table">
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Occurrences</th>
            <th>TF</th>
            <th>IDF</th>
            <th>TF-IDF Score</th>
            <th>Importance</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    tfIdfScores.slice(0, 20).forEach(({ word, tfIdf, tf, idf, count }) => {
      const tfFormatted = tf.toFixed(4);
      const idfFormatted = idf.toFixed(4);
      const scoreFormatted = tfIdf.toFixed(4);
      const importance = getImportanceLevel(tfIdf);
      
      html += `
        <tr>
          <td>${word}</td>
          <td>${count}</td>
          <td>${tfFormatted}</td>
          <td>${idfFormatted}</td>
          <td>${scoreFormatted}</td>
          <td>
            <div class="importance-indicator ${importance.class}">${importance.label}</div>
          </td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
      <div class="note" style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
        <p>Higher TF-IDF scores indicate more distinctive keywords in your content.</p>
        <p>TF = Term Frequency, IDF = Inverse Document Frequency, measuring how unique and important a word is.</p>
      </div>
    `;
    
    resultsElement.innerHTML = html;
  });
  
  function getImportanceLevel(score) {
    if (score > 0.01) {
      return { label: 'High', class: 'high' };
    } else if (score > 0.005) {
      return { label: 'Medium', class: 'medium' };
    } else {
      return { label: 'Low', class: 'low' };
    }
  }
}

// Readability Analysis Tool
function setupReadability() {
  const analyzeBtn = document.querySelector('#readability .analyze-btn');
  const textArea = document.querySelector('#readability textarea');
  let readabilityChart = null;
  
  analyzeBtn.addEventListener('click', () => {
    const content = textArea.value.trim();
    if (!content) {
      alert('Please enter some content to analyze');
      return;
    }
    
    // Extract text if HTML is provided
    let textContent = content;
    if (content.includes('<') && content.includes('>')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      textContent = doc.body.textContent;
    }
    
    // Process text for readability analysis
    // Clean up the text to ensure proper sentence detection
    textContent = textContent
      .replace(/\s+/g, ' ')                 // Normalize whitespace
      .replace(/\n/g, ' ')                  // Replace newlines with spaces
      .replace(/\s*\.\s*/g, '. ')           // Normalize spacing around periods
      .replace(/\s*\?\s*/g, '? ')           // Normalize spacing around question marks
      .replace(/\s*!\s*/g, '! ')            // Normalize spacing around exclamation marks
      .replace(/\.\s+([a-z])/g, '. $1')     // Fix case after periods
      .replace(/\?\s+([a-z])/g, '? $1')     // Fix case after question marks
      .replace(/!\s+([a-z])/g, '! $1');     // Fix case after exclamation marks
    
    // Text statistics
    const words = textContent.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Smart sentence detection
    // Split by periods, exclamation and question marks, but consider common abbreviations 
    const sentenceRegex = /[^.!?]+[.!?]+/g;
    const sentences = textContent.match(sentenceRegex) || [];
    const sentenceCount = sentences.length;
    
    // Determine paragraphs by double newlines or very long sentences
    const paragraphs = content.split(/\n\s*\n/).filter(para => para.trim().length > 0);
    const paragraphCount = paragraphs.length;
    
    const characters = textContent.replace(/\s/g, '').length;
    const syllables = countSyllables(textContent);
    
    // Calculate readability scores
    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllables / wordCount;
    
    // Flesch Reading Ease score
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    const fleschGrade = getFleschGrade(fleschScore);
    
    // Flesch-Kincaid Grade Level
    const fkGradeLevel = (0.39 * avgWordsPerSentence) + (11.8 * avgSyllablesPerWord) - 15.59;
    
    // Gunning Fog Index - measures the years of formal education needed to understand the text
    const complexWords = words.filter(word => countSyllablesForWord(word) > 2).length;
    const percentComplexWords = (complexWords / wordCount) * 100;
    const gunningFog = 0.4 * (avgWordsPerSentence + percentComplexWords);
    
    // SMOG Index - estimates the years of education needed to understand a piece of writing
    const smogIndex = 1.043 * Math.sqrt(complexWords * (30 / sentenceCount)) + 3.1291;
    
    // Automated Readability Index (ARI)
    const automatedReadabilityIndex = 4.71 * (characters / wordCount) + 0.5 * (wordCount / sentenceCount) - 21.43;
    
    // Coleman-Liau Index - relies on characters instead of syllables
    const l = (characters / wordCount * 100); // avg number of characters per 100 words
    const s = (sentenceCount / wordCount * 100); // avg number of sentences per 100 words
    const colemanLiauIndex = 0.0588 * l - 0.296 * s - 15.8;
    
    // Display results
    document.getElementById('readability-scores').innerHTML = `
      <div class="result-item">
        <strong>Flesch Reading Ease:</strong> ${fleschScore.toFixed(1)}
        <div class="score-interpretation">${fleschGrade}</div>
      </div>
      <div class="result-item">
        <strong>Flesch-Kincaid Grade:</strong> ${fkGradeLevel.toFixed(1)}
        <div class="score-interpretation">Grade level: ${Math.round(fkGradeLevel)}</div>
      </div>
      <div class="result-item">
        <strong>Gunning Fog Index:</strong> ${gunningFog.toFixed(1)}
        <div class="score-interpretation">Years of formal education needed: ${Math.round(gunningFog)}</div>
      </div>
      <div class="result-item">
        <strong>SMOG Index:</strong> ${smogIndex.toFixed(1)}
        <div class="score-interpretation">Years of education needed: ${Math.round(smogIndex)}</div>
      </div>
      <div class="result-item">
        <strong>Automated Readability:</strong> ${automatedReadabilityIndex.toFixed(1)}
        <div class="score-interpretation">Grade level: ${Math.round(automatedReadabilityIndex)}</div>
      </div>
      <div class="result-item">
        <strong>Coleman-Liau Index:</strong> ${colemanLiauIndex.toFixed(1)}
        <div class="score-interpretation">Grade level: ${Math.round(colemanLiauIndex)}</div>
      </div>
    `;
    
    document.getElementById('content-stats').innerHTML = `
      <div class="result-item">
        <strong>Word Count:</strong> ${wordCount}
      </div>
      <div class="result-item">
        <strong>Sentence Count:</strong> ${sentenceCount}
      </div>
      <div class="result-item">
        <strong>Paragraph Count:</strong> ${paragraphCount}
      </div>
      <div class="result-item">
        <strong>Average Words Per Sentence:</strong> ${avgWordsPerSentence.toFixed(1)}
      </div>
      <div class="result-item">
        <strong>Complex Words:</strong> ${complexWords} (${(complexWords / wordCount * 100).toFixed(1)}%)
      </div>
      <div class="result-item">
        <strong>Average Syllables Per Word:</strong> ${avgSyllablesPerWord.toFixed(2)}
      </div>
    `;
    
    // Create chart
    const chartCanvas = document.getElementById('readabilityChart');
    const ctx = chartCanvas.getContext('2d');
    
    // Destroy previous chart if it exists
    if (readabilityChart) {
      readabilityChart.destroy();
    }
    
    readabilityChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Flesch Reading Ease', 'Flesch-Kincaid Grade', 'Gunning Fog', 'SMOG', 'Word Count', 'Sentence Length'],
        datasets: [{
          label: 'Your Content',
          data: [
            normalizeScore(fleschScore, 0, 100),
            normalizeScore(fkGradeLevel, 0, 18),
            normalizeScore(gunningFog, 0, 18),
            normalizeScore(smogIndex, 0, 18),
            normalizeScore(wordCount, 0, 1000),
            normalizeScore(avgWordsPerSentence, 0, 30)
          ],
          backgroundColor: 'rgba(37, 117, 252, 0.2)',
          borderColor: 'rgba(37, 117, 252, 0.7)',
          pointBackgroundColor: 'rgba(37, 117, 252, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(37, 117, 252, 1)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        }
      }
    });
  });
  
  function countSyllables(text) {
    const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    let syllableCount = 0;
    
    words.forEach(word => {
      syllableCount += countSyllablesForWord(word);
    });
    
    return syllableCount;
  }
  
  function countSyllablesForWord(word) {
    // Remove non-word characters
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    
    // Special cases
    if (word.length <= 3) {
      return 1;
    }
    
    // Remove es, ed at the end of words
    word = word.replace(/(?:es|ed)$/, '');
    
    // Count vowel groups
    const vowels = word.match(/[aeiouy]+/g);
    let count = vowels ? vowels.length : 0;
    
    // Adjust for special cases
    if (word.length > 1) {
      // Subtract 1 if word ends with 'e' unless it's a short word
      if (word.endsWith('e') && !['the', 'are', 'were'].includes(word)) {
        count--;
      }
      
      // Handle 'y' at the end as an added syllable
      if (word.endsWith('y') && vowels && !vowels[vowels.length - 1].endsWith('y')) {
        count++;
      }
      
      // Count 'io', 'ia', etc. as separate syllables
      const matches = word.match(/[aeiouy][aeiouy]/g) || [];
      count -= matches.length / 2;
    }
    
    // Every word has at least one syllable
    return Math.max(1, Math.round(count));
  }
  
  function getFleschGrade(score) {
    if (score >= 90) return 'Very Easy - 5th grade';
    if (score >= 80) return 'Easy - 6th grade';
    if (score >= 70) return 'Fairly Easy - 7th grade';
    if (score >= 60) return 'Standard - 8th & 9th grade';
    if (score >= 50) return 'Fairly Difficult - 10th to 12th grade';
    if (score >= 30) return 'Difficult - College level';
    return 'Very Difficult - College Graduate';
  }
  
  function normalizeScore(score, min, max) {
    // Convert any score to a 0-100 scale with proper boundary checking
    if (max === min) return 50; // Handle division by zero case
    return Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100));
  }
}

// Meta Tags Generator Tool
function setupMetaTags() {
  const generateBtn = document.querySelector('#meta-tags .analyze-btn');
  const titleInput = document.getElementById('page-title');
  const descInput = document.getElementById('page-description');
  const keywordsInput = document.getElementById('keywords');
  const canonicalInput = document.getElementById('canonical-url');
  const copyBtn = document.getElementById('copy-meta');
  
  generateBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const keywords = keywordsInput.value.trim();
    const canonicalUrl = canonicalInput.value.trim();
    
    if (!title || !description) {
      alert('Please enter at least a title and description');
      return;
    }
    
    // Generate meta tags
    let metaTags = `<title>${escapeHtml(title)}</title>\n`;
    metaTags += `<meta name="description" content="${escapeHtml(description)}">\n`;
    
    if (keywords) {
      metaTags += `<meta name="keywords" content="${escapeHtml(keywords)}">\n`;
    }
    
    // Open Graph tags
    metaTags += `<meta property="og:title" content="${escapeHtml(title)}">\n`;
    metaTags += `<meta property="og:description" content="${escapeHtml(description)}">\n`;
    metaTags += `<meta property="og:type" content="website">\n`;
    
    if (canonicalUrl) {
      metaTags += `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">\n`;
      metaTags += `<meta property="og:url" content="${escapeHtml(canonicalUrl)}">\n`;
    }
    
    // Twitter card
    metaTags += `<meta name="twitter:card" content="summary">\n`;
    metaTags += `<meta name="twitter:title" content="${escapeHtml(title)}">\n`;
    metaTags += `<meta name="twitter:description" content="${escapeHtml(description)}">\n`;
    
    // Display generated meta tags
    document.getElementById('meta-output').textContent = metaTags;
    
    // Show preview
    const serpPreview = document.getElementById('serp-preview');
    serpPreview.innerHTML = `
      <h4>${title}</h4>
      <div class="url">${canonicalUrl || 'example.com/page'}</div>
      <div class="description">${description}</div>
    `;
  });
  
  // Copy to clipboard functionality
  copyBtn.addEventListener('click', () => {
    const metaOutput = document.getElementById('meta-output');
    navigator.clipboard.writeText(metaOutput.textContent)
      .then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard');
      });
  });
  
  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Schema Generator Tool
function setupSchemaGenerator() {
  const schemaType = document.getElementById('schema-type');
  const fieldsContainer = document.getElementById('schema-fields-container');
  const generateBtn = document.getElementById('generate-schema-btn');
  const copyBtn = document.getElementById('copy-schema');
  const schemaOutput = document.getElementById('schema-output');
  
  // Schema field definitions for different types
  const schemaFields = {
    LocalBusiness: [
      { name: 'name', label: 'Business Name', type: 'text', required: true },
      { name: 'description', label: 'Business Description', type: 'textarea', required: true },
      { name: 'url', label: 'Website URL', type: 'url', required: true },
      { name: 'telephone', label: 'Telephone', type: 'tel', required: false },
      { name: 'address', label: 'Street Address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true },
      { name: 'zipCode', label: 'Zip Code', type: 'text', required: true },
      { name: 'country', label: 'Country', type: 'text', required: true },
      { name: 'priceRange', label: 'Price Range (e.g. $$$)', type: 'text', required: false },
      { name: 'image', label: 'Business Image URL', type: 'url', required: false }
    ],
    Organization: [
      { name: 'name', label: 'Organization Name', type: 'text', required: true },
      { name: 'description', label: 'Organization Description', type: 'textarea', required: true },
      { name: 'url', label: 'Website URL', type: 'url', required: true },
      { name: 'logo', label: 'Logo URL', type: 'url', required: false },
      { name: 'contactPoint', label: 'Contact Phone', type: 'tel', required: false },
      { name: 'email', label: 'Email', type: 'email', required: false }
    ],
    Person: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'jobTitle', label: 'Job Title', type: 'text', required: false },
      { name: 'worksFor', label: 'Company Name', type: 'text', required: false },
      { name: 'url', label: 'Website URL', type: 'url', required: false },
      { name: 'image', label: 'Profile Image URL', type: 'url', required: false },
      { name: 'description', label: 'Brief Biography', type: 'textarea', required: false }
    ],
    Product: [
      { name: 'name', label: 'Product Name', type: 'text', required: true },
      { name: 'description', label: 'Product Description', type: 'textarea', required: true },
      { name: 'image', label: 'Product Image URL', type: 'url', required: false },
      { name: 'brand', label: 'Brand Name', type: 'text', required: true },
      { name: 'offers', label: 'Price (USD)', type: 'number', required: true },
      { name: 'sku', label: 'SKU', type: 'text', required: false },
      { name: 'availability', label: 'Availability', type: 'select', required: true, 
        options: ['InStock', 'OutOfStock', 'PreOrder', 'Discontinued'] }
    ],
    Event: [
      { name: 'name', label: 'Event Name', type: 'text', required: true },
      { name: 'description', label: 'Event Description', type: 'textarea', required: true },
      { name: 'startDate', label: 'Start Date & Time', type: 'datetime-local', required: true },
      { name: 'endDate', label: 'End Date & Time', type: 'datetime-local', required: true },
      { name: 'location', label: 'Venue Name', type: 'text', required: true },
      { name: 'address', label: 'Street Address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'image', label: 'Event Image URL', type: 'url', required: false },
      { name: 'offers', label: 'Ticket Price (USD)', type: 'number', required: false }
    ],
    Article: [
      { name: 'headline', label: 'Article Headline', type: 'text', required: true },
      { name: 'description', label: 'Article Description', type: 'textarea', required: true },
      { name: 'author', label: 'Author Name', type: 'text', required: true },
      { name: 'image', label: 'Featured Image URL', type: 'url', required: false },
      { name: 'datePublished', label: 'Date Published', type: 'date', required: true },
      { name: 'dateModified', label: 'Date Modified', type: 'date', required: false },
      { name: 'publisher', label: 'Publisher Name', type: 'text', required: true },
      { name: 'publisherLogo', label: 'Publisher Logo URL', type: 'url', required: false }
    ],
    FAQ: [
      { name: 'title', label: 'FAQ Page Title', type: 'text', required: true },
      { name: 'description', label: 'FAQ Page Description', type: 'textarea', required: false },
      { name: 'question1', label: 'Question 1', type: 'text', required: true },
      { name: 'answer1', label: 'Answer 1', type: 'textarea', required: true },
      { name: 'question2', label: 'Question 2', type: 'text', required: false },
      { name: 'answer2', label: 'Answer 2', type: 'textarea', required: false },
      { name: 'question3', label: 'Question 3', type: 'text', required: false },
      { name: 'answer3', label: 'Answer 3', type: 'textarea', required: false }
    ]
  };
  
  // Generate form fields based on schema type
  schemaType.addEventListener('change', () => {
    renderFields(schemaType.value);
  });
  
  // Initialize with default type
  renderFields(schemaType.value);
  
  function renderFields(type) {
    const fields = schemaFields[type];
    fieldsContainer.innerHTML = '';
    
    fields.forEach(field => {
      const fieldGroup = document.createElement('div');
      fieldGroup.className = 'form-group';
      
      const fieldLabel = document.createElement('label');
      fieldLabel.textContent = field.label + (field.required ? ' *' : '');
      fieldGroup.appendChild(fieldLabel);
      
      let inputElement;
      
      if (field.type === 'textarea') {
        inputElement = document.createElement('textarea');
      } else if (field.type === 'select') {
        inputElement = document.createElement('select');
        field.options.forEach(option => {
          const optionEl = document.createElement('option');
          optionEl.value = option;
          optionEl.textContent = option;
          inputElement.appendChild(optionEl);
        });
      } else {
        inputElement = document.createElement('input');
        inputElement.type = field.type;
      }
      
      inputElement.id = 'schema-' + field.name;
      inputElement.name = field.name;
      inputElement.required = field.required;
      inputElement.className = 'schema-input';
      
      fieldGroup.appendChild(inputElement);
      fieldsContainer.appendChild(fieldGroup);
    });
  }
  
  // Generate schema based on form inputs
  generateBtn.addEventListener('click', () => {
    const selectedType = schemaType.value;
    const fields = schemaFields[selectedType];
    const schemaData = {};
    let isValid = true;
    
    // Collect form data
    fields.forEach(field => {
      const inputEl = document.getElementById('schema-' + field.name);
      if (field.required && !inputEl.value) {
        inputEl.classList.add('invalid');
        isValid = false;
      } else {
        inputEl.classList.remove('invalid');
        if (inputEl.value) {
          if (selectedType === 'FAQ' && field.name.startsWith('question')) {
            // Handle FAQ questions and answers separately
            const num = field.name.replace('question', '');
            const answer = document.getElementById('schema-answer' + num).value;
            if (!schemaData.faqs) schemaData.faqs = [];
            if (answer) {
              schemaData.faqs.push({
                question: inputEl.value,
                answer: answer
              });
            }
          } else if (!field.name.startsWith('answer')) {
            // Skip answer fields as they're handled with questions
            schemaData[field.name] = inputEl.value;
          }
        }
      }
    });
    
    if (!isValid) {
      alert('Please fill in all required fields marked with *');
      return;
    }
    
    // Generate schema JSON
    const schema = generateSchemaJSON(selectedType, schemaData);
    
    // Display the generated schema
    schemaOutput.textContent = schema;
    
    // Update schema info
    document.getElementById('schema-info').innerHTML = `
      <p>Your ${selectedType} schema has been generated successfully.</p>
      <p>Add this code to the &lt;head&gt; section of your webpage.</p>
      <p>You can test your schema with <a href="https://search.google.com/test/rich-results" target="_blank">Google's Rich Results Test</a>.</p>
    `;
  });
  
  // Copy to clipboard functionality
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(schemaOutput.textContent)
      .then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy to clipboard');
      });
  });
  
  function generateSchemaJSON(type, data) {
    let schemaObj = {
      "@context": "https://schema.org",
      "@type": type
    };
    
    switch (type) {
      case 'LocalBusiness':
        schemaObj = {
          ...schemaObj,
          "name": data.name,
          "description": data.description,
          "url": data.url,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": data.address,
            "addressLocality": data.city,
            "addressRegion": data.state,
            "postalCode": data.zipCode,
            "addressCountry": data.country
          }
        };
        
        if (data.telephone) schemaObj.telephone = data.telephone;
        if (data.priceRange) schemaObj.priceRange = data.priceRange;
        if (data.image) schemaObj.image = data.image;
        break;
        
      case 'Organization':
        schemaObj = {
          ...schemaObj,
          "name": data.name,
          "description": data.description,
          "url": data.url
        };
        
        if (data.logo) schemaObj.logo = data.logo;
        if (data.contactPoint) {
          schemaObj.contactPoint = {
            "@type": "ContactPoint",
            "telephone": data.contactPoint,
            "contactType": "customer service"
          };
        }
        if (data.email) schemaObj.email = data.email;
        break;
        
      case 'Person':
        schemaObj = {
          ...schemaObj,
          "name": data.name
        };
        
        if (data.jobTitle) schemaObj.jobTitle = data.jobTitle;
        if (data.worksFor) {
          schemaObj.worksFor = {
            "@type": "Organization",
            "name": data.worksFor
          };
        }
        if (data.url) schemaObj.url = data.url;
        if (data.image) schemaObj.image = data.image;
        if (data.description) schemaObj.description = data.description;
        break;
        
      case 'Product':
        schemaObj = {
          ...schemaObj,
          "name": data.name,
          "description": data.description,
          "brand": {
            "@type": "Brand",
            "name": data.brand
          }
        };
        
        if (data.image) schemaObj.image = data.image;
        if (data.offers) {
          schemaObj.offers = {
            "@type": "Offer",
            "price": data.offers,
            "priceCurrency": "USD"
          };
          
          if (data.availability) {
            schemaObj.offers.availability = "https://schema.org/" + data.availability;
          }
        }
        if (data.sku) schemaObj.sku = data.sku;
        break;
        
      case 'Event':
        schemaObj = {
          ...schemaObj,
          "name": data.name,
          "description": data.description,
          "startDate": data.startDate,
          "endDate": data.endDate,
          "location": {
            "@type": "Place",
            "name": data.location,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": data.address,
              "addressLocality": data.city
            }
          }
        };
        
        if (data.image) schemaObj.image = data.image;
        if (data.offers) {
          schemaObj.offers = {
            "@type": "Offer",
            "price": data.offers,
            "priceCurrency": "USD"
          };
        }
        break;
        
      case 'Article':
        schemaObj = {
          ...schemaObj,
          "headline": data.headline,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "datePublished": data.datePublished,
          "publisher": {
            "@type": "Organization",
            "name": data.publisher
          }
        };
        
        if (data.image) schemaObj.image = data.image;
        if (data.dateModified) schemaObj.dateModified = data.dateModified;
        if (data.publisherLogo) {
          schemaObj.publisher.logo = {
            "@type": "ImageObject",
            "url": data.publisherLogo
          };
        }
        break;
        
      case 'FAQ':
        schemaObj = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };
        break;
    }
    
    return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
  }
}

// Keyword Database Tool
function setupKeywordDatabase() {
  const searchBtn = document.getElementById('search-keyword-btn');
  const keywordInput = document.getElementById('keyword-search');
  let trendChart = null;
  
  searchBtn.addEventListener('click', () => {
    searchKeyword();
  });
  
  keywordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchKeyword();
  });
  
  async function searchKeyword() {
    const keyword = keywordInput.value.trim().toLowerCase();
    
    if (!keyword) {
      alert('Please enter a keyword to search');
      return;
    }
    
    document.getElementById('keyword-search-results').innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p>Searching for keyword data...</p>
      </div>
    `;
    
    try {
      // Connect to RapidAPI Keywords Everywhere API
      const response = await fetch(`https://cors-anywhere.herokuapp.com/https://keywords-everywhere.p.rapidapi.com/keywordOverview?keyword=${encodeURIComponent(keyword)}&country=us&currency=usd`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'SIGN-UP-FOR-KEY',
          'X-RapidAPI-Host': 'keywords-everywhere.p.rapidapi.com'
        }
      });
      
      // If we can't connect to the API, fallback to our sample data
      if (!response.ok) {
        console.warn('API connection failed, using sample data instead');
        useSampleData(keyword);
        return;
      }
      
      const data = await response.json();
      
      // Process and display the data
      displayApiResults(keyword, data);
      
    } catch (error) {
      console.error('Error fetching keyword data:', error);
      // Fallback to sample data if API fails
      useSampleData(keyword);
    }
  }
  
  function displayApiResults(keyword, data) {
    // Format the data from the API
    const volume = data.vol || 0;
    const cpc = data.cpc || 0;
    const competition = data.competition || 0;
    
    // Create trend data (usually would come from API)
    let trend = Array(12).fill(0);
    if (volume) {
      // Generate trend data based on volume
      const baseVolume = volume / 12;
      trend = Array.from({length: 12}, () => 
        Math.floor(baseVolume * (0.8 + Math.random() * 0.4))
      );
    }
    
    // Get related keywords
    const related = data.related_keywords || [];
    
    // Format the data for display
    const keywordData = {
      volume: volume,
      cpc: cpc,
      competition: competition / 100, // Convert to 0-1 range if needed
      trend: trend,
      related: related.map(item => ({
        keyword: item.keyword,
        volume: item.vol,
        competition: item.competition / 100
      }))
    };
    
    // Display the results
    renderKeywordResults(keyword, keywordData);
  }
  
  function useSampleData(keyword) {
    // Sample keyword database (in a real app, this would come from an API)
    const keywordDatabase = {
      "seo": {
        volume: 33100,
        cpc: 15.20,
        competition: 0.95,
        trend: [3200, 3100, 3300, 3400, 3200, 3100, 3000, 3200, 3400, 3500, 3600, 3700],
        related: [
          { keyword: "seo tools", volume: 5400, competition: 0.88 },
          { keyword: "seo services", volume: 8100, competition: 0.92 },
          { keyword: "seo agency", volume: 6700, competition: 0.90 },
          { keyword: "seo strategy", volume: 4200, competition: 0.85 },
          { keyword: "local seo", volume: 3900, competition: 0.82 }
        ]
      },
      "content marketing": {
        volume: 18200,
        cpc: 12.80,
        competition: 0.89,
        trend: [1500, 1600, 1620, 1700, 1750, 1800, 1800, 1850, 1900, 1920, 1950, 2000],
        related: [
          { keyword: "content strategy", volume: 4100, competition: 0.80 },
          { keyword: "content creation", volume: 6300, competition: 0.83 },
          { keyword: "content calendar", volume: 2100, competition: 0.75 },
          { keyword: "content marketing tools", volume: 3300, competition: 0.87 },
          { keyword: "b2b content marketing", volume: 1200, competition: 0.82 }
        ]
      },
      "backlinks": {
        volume: 22800,
        cpc: 10.50,
        competition: 0.91,
        trend: [1900, 1950, 2000, 2050, 2100, 2200, 2150, 2100, 2150, 2200, 2250, 2300],
        related: [
          { keyword: "quality backlinks", volume: 4800, competition: 0.88 },
          { keyword: "backlink checker", volume: 9200, competition: 0.86 },
          { keyword: "free backlinks", volume: 7100, competition: 0.95 },
          { keyword: "backlink builder", volume: 3100, competition: 0.89 },
          { keyword: "backlink analysis", volume: 2800, competition: 0.84 }
        ]
      },
      "keyword research": {
        volume: 27500,
        cpc: 14.25,
        competition: 0.92,
        trend: [2200, 2250, 2300, 2350, 2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750],
        related: [
          { keyword: "keyword research tools", volume: 6800, competition: 0.87 },
          { keyword: "keyword difficulty", volume: 3400, competition: 0.81 },
          { keyword: "free keyword research", volume: 5100, competition: 0.93 },
          { keyword: "keyword search volume", volume: 2700, competition: 0.79 },
          { keyword: "long tail keywords", volume: 4900, competition: 0.85 }
        ]
      },
      "meta tags": {
        volume: 12500,
        cpc: 8.30,
        competition: 0.76,
        trend: [1000, 1050, 1100, 1150, 1200, 1250, 1300, 1250, 1200, 1150, 1100, 1050],
        related: [
          { keyword: "meta description", volume: 4900, competition: 0.74 },
          { keyword: "meta title", volume: 3800, competition: 0.72 },
          { keyword: "meta keywords", volume: 5200, competition: 0.78 },
          { keyword: "meta tags generator", volume: 2100, competition: 0.70 },
          { keyword: "meta tags seo", volume: 1900, competition: 0.75 }
        ]
      }
    };
    
    // Search in our sample database
    let keywordData = null;
    
    // Exact match
    if (keywordDatabase[keyword]) {
      keywordData = keywordDatabase[keyword];
    } else {
      // Try partial match
      for (const key in keywordDatabase) {
        if (key.includes(keyword) || keyword.includes(key)) {
          keywordData = keywordDatabase[key];
          break;
        }
      }
      
      // Check related keywords
      if (!keywordData) {
        for (const key in keywordDatabase) {
          const found = keywordDatabase[key].related.find(item => 
            item.keyword.includes(keyword) || keyword.includes(item.keyword)
          );
          if (found) {
            keywordData = {
              volume: found.volume,
              competition: found.competition,
              cpc: keywordDatabase[key].cpc * (found.competition / keywordDatabase[key].competition),
              trend: keywordDatabase[key].trend.map(val => Math.round(val * found.volume / keywordDatabase[key].volume)),
              related: keywordDatabase[key].related
            };
            break;
          }
        }
      }
    }
    
    // Display results
    if (keywordData) {
      renderKeywordResults(keyword, keywordData);
    } else {
      document.getElementById('keyword-search-results').innerHTML = `
        <div class="no-results">
          <p>No data found for "${keyword}". Try another keyword or check your spelling.</p>
          <p>Suggested keywords: seo, content marketing, backlinks, keyword research, meta tags</p>
        </div>
      `;
      document.getElementById('related-keywords').innerHTML = '';
      
      // Clear chart if exists
      if (trendChart) {
        trendChart.destroy();
        trendChart = null;
      }
    }
  }
  
  function renderKeywordResults(keyword, data) {
    // Display keyword metrics
    document.getElementById('keyword-search-results').innerHTML = `
      <h3>Metrics for "${keyword}"</h3>
      <div class="keyword-metrics">
        <div class="metric-card">
          <div class="label">Monthly Search Volume</div>
          <div class="value">${data.volume.toLocaleString()}</div>
        </div>
        <div class="metric-card">
          <div class="label">Cost Per Click</div>
          <div class="value">$${typeof data.cpc === 'number' ? data.cpc.toFixed(2) : data.cpc}</div>
        </div>
        <div class="metric-card">
          <div class="label">Competition</div>
          <div class="value">
            ${(data.competition * 100).toFixed(0)}%
            <div class="difficulty-indicator">
              <div class="difficulty-fill" style="width: ${data.competition * 100}%"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Display related keywords
    let relatedHtml = '';
    if (data.related && data.related.length > 0) {
      data.related.forEach(item => {
        let competitionClass = '';
        if (item.competition < 0.75) competitionClass = 'competition-low';
        else if (item.competition < 0.9) competitionClass = 'competition-medium';
        else competitionClass = 'competition-high';
        
        relatedHtml += `
          <div class="related-keyword-item">
            <span>${item.keyword}</span>
            <span>
              ${item.volume.toLocaleString()} searches
              <div class="difficulty-indicator">
                <div class="difficulty-fill ${competitionClass}"></div>
              </div>
            </span>
          </div>
        `;
      });
    } else {
      relatedHtml = '<p>No related keywords found</p>';
    }
    
    document.getElementById('related-keywords').innerHTML = relatedHtml;
    
    // Create trend chart
    createTrendChart(data.trend);
  }
  
  function createTrendChart(trendData) {
    const ctx = document.getElementById('keywordTrendChart').getContext('2d');
    
    // Destroy previous chart if exists
    if (trendChart) {
      trendChart.destroy();
    }
    
    // Create labels for last 12 months
    const labels = [];
    const currentDate = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }
    
    trendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Search Volume',
          data: trendData,
          fill: true,
          backgroundColor: 'rgba(37, 117, 252, 0.1)',
          borderColor: 'rgba(37, 117, 252, 1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Monthly Searches'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    });
  }
  
  // Initialize with an example search
  setTimeout(() => {
    if (document.querySelector('.nav-btn[data-tool="keyword-database"]').classList.contains('active')) {
      keywordInput.value = "seo";
      searchKeyword();
    }
  }, 100);
}

// Sentiment Analysis Tool
function setupSentimentAnalysis() {
  const optionButtons = document.querySelectorAll('.option-btn');
  const inputAreas = document.querySelectorAll('.input-area');
  const analyzeBtn = document.getElementById('analyze-sentiment-btn');
  const fileUpload = document.getElementById('document-upload');
  const fileName = document.getElementById('file-name');
  
  // Switch between input options
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      optionButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show selected input area
      const sourceType = button.dataset.source;
      inputAreas.forEach(area => {
        area.classList.add('hidden');
        if (area.id === sourceType + '-content') {
          area.classList.remove('hidden');
        }
      });
    });
  });
  
  // Display selected file name
  fileUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileName.textContent = e.target.files[0].name;
    } else {
      fileName.textContent = '';
    }
  });
  
  // Analyze sentiment
  analyzeBtn.addEventListener('click', async () => {
    // Determine which input method is active
    const activeButton = document.querySelector('.option-btn.active');
    const sourceType = activeButton.dataset.source;
    
    let content = '';
    let sourceUrl = '';
    
    try {
      // Show loading state
      document.getElementById('sentiment-results').innerHTML = `
        <div class="loading-indicator">
          <div class="spinner"></div>
          <p>Analyzing content...</p>
        </div>
      `;
      document.getElementById('heading-analysis').innerHTML = '';
      document.getElementById('context-analysis').innerHTML = '';
      document.getElementById('keyword-relevance').innerHTML = '';
      
      // Get content based on input method
      if (sourceType === 'paste') {
        content = document.getElementById('sentiment-content').value.trim();
        if (!content) {
          throw new Error('Please enter some content to analyze');
        }
        
        // Analyze the pasted content directly
        await analyzeSentiment(content);
        
      } else if (sourceType === 'url') {
        sourceUrl = document.getElementById('sentiment-url').value.trim();
        if (!sourceUrl) {
          throw new Error('Please enter a URL to analyze');
        }
        
        // Fetch and analyze content from the URL
        try {
          // Use a CORS proxy to fetch the URL content
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceUrl)}`;
          const response = await fetch(proxyUrl);
          
          if (!response.ok) {
            throw new Error('Failed to fetch URL content');
          }
          
          const html = await response.text();
          
          // Extract text content from HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Remove scripts and styles
          const scripts = doc.querySelectorAll('script, style, nav, footer, header, aside');
          scripts.forEach(el => el.remove());
          
          // Preserve the HTML structure for heading analysis
          content = doc.body.innerHTML;
          
          // Analyze the extracted content
          await analyzeSentiment(content, sourceUrl);
          
        } catch (error) {
          console.error('URL fetch error:', error);
          throw new Error(`Failed to fetch content from URL: ${error.message}`);
        }
        
      } else if (sourceType === 'file') {
        const file = fileUpload.files[0];
        if (!file) {
          throw new Error('Please select a file to analyze');
        }
        
        // Read and analyze the uploaded document
        try {
          content = await readFileContent(file);
          await analyzeSentiment(content, file.name);
        } catch (error) {
          console.error('File reading error:', error);
          throw new Error(`Failed to read file: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      document.getElementById('sentiment-results').innerHTML = `
        <div class="error-message">
          <p>Error: ${error.message}</p>
        </div>
      `;
    }
  });
  
  // Function to read file content
  function readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          let content = e.target.result;
          
          // For .txt files, we can use the content directly
          if (file.type === 'text/plain') {
            resolve(content);
          }
          // For .docx and .pdf, we would need specialized libraries
          // For now, we'll just handle plain text
          else {
            reject(new Error('File type not supported. Please use .txt files or paste content directly.'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = function() {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  // Main sentiment analysis function
  async function analyzeSentiment(content, source = '') {
    try {
      // 1. Extract text if content is HTML
      const isHtml = content.includes('<') && content.includes('>');
      let textContent = content;
      let htmlContent = isHtml ? content : '';
      
      if (isHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        textContent = doc.body.textContent;
      } else {
        // If plain text, create simple HTML for headings analysis
        htmlContent = `<div>${content.split('\n\n').map(p => `<p>${p}</p>`).join('')}</div>`;
      }
      
      // 2. Calculate sentiment scores
      const sentimentScores = calculateSentiment(textContent);
      
      // 3. Analyze headings
      const headingAnalysis = analyzeHeadings(htmlContent);
      
      // 4. Identify main context
      const contextAnalysis = identifyContext(textContent);
      
      // 5. Calculate keyword relevance
      const keywordRelevance = calculateKeywordRelevance(textContent, htmlContent, contextAnalysis.primaryKeyword);
      
      // Display results
      displaySentimentResults(sentimentScores);
      displayHeadingAnalysis(headingAnalysis);
      displayContextAnalysis(contextAnalysis);
      displayKeywordRelevance(keywordRelevance);
      
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  }
  
  // Calculate sentiment scores
  function calculateSentiment(content) {
    // Word lists for sentiment analysis
    const positiveWords = [
      'good', 'great', 'excellent', 'positive', 'wonderful', 'fantastic',
      'amazing', 'happy', 'joy', 'successful', 'beneficial', 'improvement',
      'progress', 'growth', 'opportunity', 'solution', 'advantage', 'effective',
      'right', 'perfect', 'best', 'better', 'success', 'easy', 'recommend',
      'love', 'like', 'enjoy', 'impressive', 'innovative', 'efficient', 'helpful',
      'valuable', 'useful', 'beautiful', 'strong', 'gain', 'support', 'quality',
      'profit', 'bonus', 'achievement', 'accomplish', 'ideal', 'win', 'winning',
      'congratulation', 'achievement', 'celebrate', 'prosperity', 'satisfied'
    ];
    
    const negativeWords = [
      'bad', 'poor', 'terrible', 'negative', 'horrible', 'awful',
      'disappointing', 'sad', 'unhappy', 'failure', 'problem', 'issue',
      'challenge', 'risk', 'threat', 'difficult', 'trouble', 'crisis',
      'wrong', 'worst', 'worse', 'fail', 'hard', 'avoid',
      'hate', 'dislike', 'annoying', 'inefficient', 'useless', 'inadequate',
      'ugly', 'weak', 'loss', 'oppose', 'poor', 'cheap', 'damage',
      'lose', 'losing', 'complaint', 'disappoint', 'unfortunate', 'regret',
      'sorry', 'fear', 'worry', 'concern', 'anxious', 'angry', 'frustrated'
    ];
    
    // Intensity modifiers
    const intensifiers = {
      'very': 1.5,
      'extremely': 2,
      'highly': 1.5,
      'remarkably': 1.8,
      'incredibly': 1.8,
      'absolutely': 1.9,
      'completely': 1.6,
      'totally': 1.6,
      'utterly': 1.8,
      'really': 1.4,
      'genuinely': 1.3,
      'especially': 1.4,
      'particularly': 1.4,
      'exceptionally': 1.7,
      'immensely': 1.7,
      'deeply': 1.5,
      'profoundly': 1.7,
      'terribly': 1.6,
      'seriously': 1.4,
      'quite': 1.2,
      'rather': 1.1
    };
    
    // Negation words
    const negations = [
      'not', 'no', 'never', 'neither', 'nor', 'none', 'nothing', 'nowhere',
      'hardly', 'scarcely', 'barely', 'doesn\'t', 'don\'t', 'didn\'t', 'isn\'t',
      'aren\'t', 'wasn\'t', 'weren\'t', 'haven\'t', 'hasn\'t', 'hadn\'t',
      'won\'t', 'wouldn\'t', 'can\'t', 'cannot', 'couldn\'t', 'shouldn\'t'
    ];
    
    // Process the text
    const sentences = content.replace(/([.!?])\s*(?=[A-Z])/g, "$1|").split("|");
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralWords = 0;
    
    // Calculate sentence-level sentiment
    sentences.forEach(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      let sentencePositive = 0;
      let sentenceNegative = 0;
      let hasNegation = false;
      let currentIntensifier = 1;
      
      for (let i = 0; i < sentenceWords.length; i++) {
        const word = sentenceWords[i];
        
        // Check for negations
        if (negations.includes(word)) {
          hasNegation = true;
          continue;
        }
        
        // Check for intensifiers
        if (intensifiers[word]) {
          currentIntensifier = intensifiers[word];
          continue;
        }
        
        // Check sentiment
        if (positiveWords.includes(word)) {
          if (hasNegation) {
            sentenceNegative += currentIntensifier;
          } else {
            sentencePositive += currentIntensifier;
          }
          hasNegation = false;
          currentIntensifier = 1;
        } 
        else if (negativeWords.includes(word)) {
          if (hasNegation) {
            sentencePositive += currentIntensifier;
          } else {
            sentenceNegative += currentIntensifier;
          }
          hasNegation = false;
          currentIntensifier = 1;
        }
        else {
          // For words not in our sentiment lists
          neutralWords++;
        }
      }
      
      positiveScore += sentencePositive;
      negativeScore += sentenceNegative;
    });
    
    // Normalize scores
    const totalSentimentScore = positiveScore + negativeScore;
    const sentimentTotal = words.length || 1; // Ensure we don't divide by zero
    
    // Calculate percentages
    const positivePercent = (positiveScore / sentimentTotal * 100).toFixed(1);
    const negativePercent = (negativeScore / sentimentTotal * 100).toFixed(1);
    const neutralPercent = (100 - parseFloat(positivePercent) - parseFloat(negativePercent)).toFixed(1);
    
    // Calculate overall sentiment score (-1 to 1)
    let overallScore = 0;
    if (totalSentimentScore > 0) {
      overallScore = ((positiveScore - negativeScore) / (positiveScore + negativeScore)).toFixed(2);
    }
    
    // Determine sentiment category
    let sentimentCategory = 'Neutral';
    if (overallScore > 0.25) sentimentCategory = 'Positive';
    else if (overallScore < -0.25) sentimentCategory = 'Negative';
    else sentimentCategory = 'Neutral';
    
    return {
      overall: overallScore,
      category: sentimentCategory,
      positive: positivePercent,
      negative: negativePercent,
      neutral: neutralPercent
    };
  }
  
  // Analyze headings structure
  function analyzeHeadings(content) {
    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    // Extract all headings
    const h1Elements = Array.from(doc.querySelectorAll('h1'));
    const h2Elements = Array.from(doc.querySelectorAll('h2'));
    const h3Elements = Array.from(doc.querySelectorAll('h3'));
    const h4Elements = Array.from(doc.querySelectorAll('h4'));
    const h5Elements = Array.from(doc.querySelectorAll('h5'));
    const h6Elements = Array.from(doc.querySelectorAll('h6'));
    
    // Combine and sort by document position
    let allHeadings = [
      ...h1Elements, ...h2Elements, ...h3Elements,
      ...h4Elements, ...h5Elements, ...h6Elements
    ];
    
    // Sort headings by their position in the document
    allHeadings.sort((a, b) => {
      const position = a.compareDocumentPosition(b);
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    
    // Convert to our heading format
    const headings = allHeadings.map(el => ({
      level: parseInt(el.tagName.substring(1)),
      text: el.textContent.trim()
    }));
    
    // If no HTML headings found, try to identify headings based on text formatting
    if (headings.length === 0 && doc.body.textContent) {
      const lines = doc.body.textContent.split('\n').map(line => line.trim()).filter(line => line);
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Simple heuristic: short lines followed by longer content are likely headings
        if (line.length > 0 && line.length < 100 && 
            (i === lines.length - 1 || lines[i+1].length > line.length || 
             line.endsWith(':') || line.endsWith('?'))) {
          
          // Determine heading level based on position and content
          let level = 3; // Default to h3
          
          if (i === 0 || (i > 0 && lines[i-1].length === 0)) {
            level = 1; // First line or line after blank line is likely h1
          } else if (line.length < 50) {
            level = 2; // Short line is likely h2
          }
          
          // Ignore lines with less than 3 characters
          if (line.length >= 3) {
            headings.push({ level, text: line });
          }
        }
      }
    }
    
    // Count headings by level
    const counts = {
      h1: headings.filter(h => h.level === 1).length,
      h2: headings.filter(h => h.level === 2).length,
      h3: headings.filter(h => h.level === 3).length,
      h4: headings.filter(h => h.level === 4).length,
      h5: headings.filter(h => h.level === 5).length,
      h6: headings.filter(h => h.level === 6).length
    };
    
    // Check if heading structure is proper (sequential)
    const isSequential = checkHeadingSequence(headings);
    
    return {
      headings,
      counts,
      total: headings.length,
      hasProperStructure: counts.h1 > 0 && counts.h1 <= 1 && isSequential
    };
  }
  
  // Check if headings follow a proper sequence
  function checkHeadingSequence(headings) {
    if (headings.length < 2) return true;
    
    let prevLevel = 0;
    
    for (const heading of headings) {
      const level = heading.level;
      
      // First heading can be any level
      if (prevLevel === 0) {
        prevLevel = level;
        continue;
      }
      
      // Check if heading level jumps by more than 1
      if (level > prevLevel + 1) {
        return false;
      }
      
      prevLevel = level;
    }
    
    return true;
  }
  
  // Identify content context and primary keyword
  function identifyContext(content) {
    // Define common stopwords to exclude
    const stopwords = new Set([
      'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
      'be', 'have', 'has', 'had', 'do', 'does', 'did', 'to', 'at', 'in',
      'on', 'for', 'with', 'by', 'about', 'as', 'of', 'from', 'this', 'that',
      'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'our', 'us',
      'will', 'would', 'should', 'can', 'could', 'may', 'might', 'such', 'when',
      'what', 'who', 'how', 'where', 'why', 'which', 'if', 'then', 'than'
    ]);
    
    // Extract and count words, excluding stopwords
    const words = content.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const wordFreq = {};
    
    words.forEach(word => {
      if (stopwords.has(word)) return;
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Find word pairs (bigrams)
    const bigrams = [];
    for (let i = 0; i < words.length - 1; i++) {
      if (!stopwords.has(words[i]) && !stopwords.has(words[i+1])) {
        const bigram = words[i] + ' ' + words[i+1];
        bigrams.push(bigram);
      }
    }
    
    // Count bigram frequencies
    const bigramFreq = {};
    bigrams.forEach(bigram => {
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    });
    
    // Sort words by frequency
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
    
    // Sort bigrams by frequency (need at least 2 occurrences)
    const sortedBigrams = Object.entries(bigramFreq)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    // Extract top keywords
    const topKeywords = sortedWords.map(([word, count]) => ({
      word,
      count,
      frequency: ((count / words.length) * 100).toFixed(1) + '%'
    }));
    
    // Extract top bigrams
    const topBigrams = sortedBigrams.map(([phrase, count]) => ({
      word: phrase,
      count,
      frequency: ((count / bigrams.length) * 100).toFixed(1) + '%'
    }));
    
    // Determine primary keyword
    let primaryKeyword = '';
    
    // If we have bigrams with high frequency, use the most frequent
    if (topBigrams.length > 0 && topBigrams[0].count > 2) {
      primaryKeyword = topBigrams[0].word;
    } 
    // Otherwise use the most frequent single word
    else if (topKeywords.length > 0) {
      primaryKeyword = topKeywords[0].word;
    }
    
    // Determine content context based on keywords
    const contextKeywords = {
      business: ['market', 'business', 'company', 'industry', 'economic', 'financial', 'strategy', 'growth',
                'sales', 'revenue', 'profit', 'customer', 'service', 'product', 'management'],
      technology: ['technology', 'digital', 'software', 'data', 'innovation', 'tech', 'computer', 'online',
                  'device', 'internet', 'app', 'application', 'system', 'network', 'code', 'developer'],
      health: ['health', 'medical', 'healthcare', 'patient', 'treatment', 'disease', 'doctor', 'wellness',
              'hospital', 'clinic', 'medicine', 'therapy', 'diet', 'exercise', 'symptom', 'diagnosis'],
      education: ['education', 'learning', 'student', 'school', 'teacher', 'academic', 'course', 'training',
                'university', 'college', 'degree', 'study', 'knowledge', 'teaching', 'curriculum', 'classroom'],
      environment: ['environment', 'climate', 'sustainable', 'energy', 'green', 'nature', 'pollution', 'conservation',
                  'environmental', 'renewable', 'sustainability', 'eco', 'planet', 'earth', 'recycle', 'waste'],
      politics: ['political', 'government', 'policy', 'election', 'democracy', 'law', 'rights', 'social',
               'president', 'minister', 'vote', 'party', 'legislation', 'reform', 'congress', 'regulation'],
      lifestyle: ['lifestyle', 'food', 'travel', 'fashion', 'home', 'family', 'personal', 'hobby',
                'entertainment', 'leisure', 'design', 'art', 'culture', 'recipe', 'vacation', 'decoration'],
      science: ['science', 'research', 'scientific', 'study', 'experiment', 'theory', 'discovery', 'physics',
               'chemistry', 'biology', 'laboratory', 'scientist', 'analysis', 'evidence', 'hypothesis']
    };
    
    // Score content against each context
    const contextScores = {};
    
    for (const [context, keywords] of Object.entries(contextKeywords)) {
      contextScores[context] = 0;
      
      // Check single words
      topKeywords.forEach(({ word, count }) => {
        if (keywords.includes(word)) {
          contextScores[context] += count;
        } else {
          // Check partial matches
          for (const keyword of keywords) {
            if (word.includes(keyword) || keyword.includes(word)) {
              contextScores[context] += count * 0.5;
              break;
            }
          }
        }
      });
      
      // Check bigrams
      topBigrams.forEach(({ word, count }) => {
        const bigramWords = word.split(' ');
        for (const bigramWord of bigramWords) {
          if (keywords.includes(bigramWord)) {
            contextScores[context] += count * 1.5; // Give higher weight to bigram matches
            break;
          }
        }
      });
    }
    
    // Find top context
    const topContextEntries = Object.entries(contextScores)
      .sort((a, b) => b[1] - a[1]);
    
    const topContext = topContextEntries[0][0];
    const topScore = topContextEntries[0][1];
    
    // Check if we have a strong context signal or mixed contexts
    const secondScore = topContextEntries.length > 1 ? topContextEntries[1][1] : 0;
    const isStrongContext = topScore > 0 && topScore > secondScore * 1.5;
    
    return {
      topKeywords: [...topKeywords.slice(0, 10), ...topBigrams],
      primaryKeyword,
      context: topContext,
      contextScore: topScore,
      isStrongContext
    };
  }
  
  // Calculate keyword relevance score
  function calculateKeywordRelevance(textContent, htmlContent, keyword) {
    if (!keyword) return { score: 0, keyword: '', occurrences: 0 };
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const words = textContent.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    
    // Count keyword occurrences
    const keywordRegex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    const occurrences = (textContent.match(keywordRegex) || []).length;
    
    // Check for keyword in headings (higher weight)
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    let headingMatches = 0;
    let h1Match = false;
    let h2Match = false;
    
    headings.forEach(heading => {
      if (heading.textContent.toLowerCase().includes(keyword)) {
        headingMatches++;
        
        if (heading.tagName === 'H1') {
          h1Match = true;
        } else if (heading.tagName === 'H2') {
          h2Match = true;
        }
      }
    });
    
    // Check for keyword in important elements
    const titleMatch = doc.querySelector('title')?.textContent.toLowerCase().includes(keyword) || false;
    
    // Check for keyword in first 100 words (higher weight)
    const firstWords = words.slice(0, 100).join(' ');
    const inFirstWords = firstWords.includes(keyword);
    
    // Check for keyword in URL (if source is a URL)
    const urlElement = doc.querySelector('meta[property="og:url"]');
    const url = urlElement ? urlElement.getAttribute('content') : '';
    const inUrl = url && url.toLowerCase().includes(keyword.replace(/\s+/g, '-'));
    
    // Check keyword density
    const keywordDensity = totalWords > 0 ? occurrences / totalWords : 0;
    
    // Calculate relevance score (0-100)
    let relevanceScore = 0;
    
    // Base score from density (max 40 points)
    // Optimal density is 1-3%
    let densityScore = 0;
    if (keywordDensity > 0 && keywordDensity <= 0.03) {
      densityScore = Math.min(40, 40 * (keywordDensity / 0.02));
    } else if (keywordDensity > 0.03) {
      // Penalize for keyword stuffing
      densityScore = Math.max(0, 40 - ((keywordDensity - 0.03) * 200));
    }
    
    // Heading bonus (max 30 points)
    let headingScore = 0;
    if (h1Match) headingScore += 15;
    if (h2Match) headingScore += 10;
    headingScore += Math.min(5, (headingMatches - 2) * 2.5); // Additional heading matches
    
    // Title match bonus (10 points)
    const titleScore = titleMatch ? 10 : 0;
    
    // First paragraph bonus (10 points)
    const firstContentScore = inFirstWords ? 10 : 0;
    
    // URL bonus (10 points)
    const urlScore = inUrl ? 10 : 0;
    
    // Combine scores
    relevanceScore = Math.round(densityScore + headingScore + titleScore + firstContentScore + urlScore);
    
    // Ensure score is between 0-100
    relevanceScore = Math.max(0, Math.min(100, relevanceScore));
    
    return {
      score: relevanceScore,
      keyword,
      occurrences,
      density: (keywordDensity * 100).toFixed(2) + '%',
      inHeadings: headingMatches > 0,
      inH1: h1Match,
      inFirstWords,
      inTitle: titleMatch,
      inUrl
    };
  }
  
  // Display sentiment results
  function displaySentimentResults(sentimentScores) {
    document.getElementById('sentiment-results').innerHTML = `
      <h3>Sentiment Analysis Results</h3>
      <div class="sentiment-score">
        <div class="label">Overall Sentiment:</div>
        <div class="score">${sentimentScores.overall}</div>
      </div>
      <div class="sentiment-score">
        <div class="label">Sentiment Category:</div>
        <div class="score">${sentimentScores.category}</div>
      </div>
      <div class="sentiment-score">
        <div class="label">Positive Sentiment:</div>
        <div class="score">${sentimentScores.positive}%</div>
      </div>
      <div class="sentiment-score">
        <div class="label">Negative Sentiment:</div>
        <div class="score">${sentimentScores.negative}%</div>
      </div>
      <div class="sentiment-score">
        <div class="label">Neutral Sentiment:</div>
        <div class="score">${sentimentScores.neutral}%</div>
      </div>
    `;
  }
  
  // Display heading analysis results
  function displayHeadingAnalysis(headingAnalysis) {
    const headingResults = document.getElementById('heading-analysis');
    
    if (headingAnalysis.total === 0) {
      headingResults.innerHTML = '<p>No headings found in the content.</p>';
    } else {
      headingResults.innerHTML = `
        <h3>Heading Analysis Results</h3>
        <p>Total Headings: ${headingAnalysis.total}</p>
        <p>Heading Structure: ${headingAnalysis.hasProperStructure ? 'Proper' : 'Improper'}</p>
        <ul>
          ${Object.keys(headingAnalysis.counts).map(level => `<li>${level}: ${headingAnalysis.counts[level]}</li>`).join('')}
        </ul>
      `;
    }
  }
  
  // Display context analysis results
  function displayContextAnalysis(contextAnalysis) {
    const contextResults = document.getElementById('context-analysis');
    
    contextResults.innerHTML = `
      <h3>Context Analysis Results</h3>
      <p>Primary Keyword: ${contextAnalysis.primaryKeyword}</p>
      <p>Context: ${contextAnalysis.context}</p>
      <p>Top Keywords:</p>
      <ul>
        ${contextAnalysis.topKeywords.map(keyword => `<li>${keyword.word} (${keyword.count} occurrences, ${keyword.frequency})</li>`).join('')}
      </ul>
    `;
  }
  
  // Display keyword relevance score
  function displayKeywordRelevance(keywordRelevance) {
    const relevanceElement = document.getElementById('keyword-relevance');
    
    if (!keywordRelevance || !keywordRelevance.keyword) {
      relevanceElement.innerHTML = `<p>No primary keyword detected</p>`;
      return;
    }
    
    const score = keywordRelevance.score;
    const percentage = score > 0 ? score : 0; // Ensure we don't have negative percentages
    
    relevanceElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center;">
        <div class="relevance-circle" style="background: conic-gradient(#2575fc ${percentage}%, #f0f2f5 0%);">
          <div class="inner-circle">${percentage}%</div>
        </div>
        
        <div class="keyword-container">
          <div class="keyword-title">Primary Keyword: "${keywordRelevance.keyword}"</div>
          <div>Occurrences: ${keywordRelevance.occurrences}</div>
          <div>Density: ${keywordRelevance.density}</div>
          <div>Found in: ${[
            keywordRelevance.inH1 ? 'H1 Heading' : '',
            keywordRelevance.inHeadings ? 'Other Headings' : '',
            keywordRelevance.inFirstWords ? 'First Paragraph' : '',
            keywordRelevance.inTitle ? 'Title Tag' : '',
            keywordRelevance.inUrl ? 'URL' : ''
          ].filter(Boolean).join(', ') || 'Body text only'}</div>
        </div>
      </div>
    `;
  }
}

// AI Assistant Chatbot
function setupChatbot() {
  const chatButton = document.getElementById('chat-button');
  const chatContainer = document.getElementById('chat-container');
  const closeChat = document.getElementById('close-chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  
  // Track conversation history
  let conversationHistory = [];
  
  // Toggle chat visibility
  chatButton.addEventListener('click', () => {
    chatContainer.classList.toggle('open');
    chatButton.classList.toggle('hidden');
    if (chatContainer.classList.contains('open')) {
      chatInput.focus();
    }
  });
  
  closeChat.addEventListener('click', () => {
    chatContainer.classList.remove('open');
    chatButton.classList.remove('hidden');
  });
  
  // Handle sending messages
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage('user', message);
    chatInput.value = '';
    
    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message assistant-message typing-indicator';
    typingIndicator.innerHTML = '<div class="chat-avatar"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div><div class="chat-content">Thinking...</div>';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
      // Add message to conversation history
      conversationHistory.push({
        role: "user",
        content: message
      });
      
      // Only keep the last 10 messages to prevent token limits
      conversationHistory = conversationHistory.slice(-10);
      
      // Get AI response
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful SEO assistant who helps users with SEO tools. Keep responses concise and helpful. The user is working with tools including HTML Analyzer, Keyword Density, TF-IDF Analysis, Readability Score, Meta Tags Generator, and Schema Generator. Provide useful tips for these tools when requested."
          },
          ...conversationHistory
        ]
      });
      
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);
      
      // Add AI response to chat
      const aiResponse = completion.content;
      addMessage('assistant', aiResponse);
      
      // Add to conversation history
      conversationHistory.push({
        role: "assistant",
        content: aiResponse
      });
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);
      // Show error message
      addMessage('assistant', "Sorry, I'm having trouble connecting to the AI service. Please try again later.");
    }
  }
  
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  // Add message to chat
  function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.innerHTML = sender === 'user' ? 
      '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' : 
      '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
    
    const content = document.createElement('div');
    content.className = 'chat-content';
    content.textContent = text;
    
    messageElement.appendChild(avatar);
    messageElement.appendChild(content);
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Add initial greeting
  setTimeout(async () => {
    try {
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful SEO assistant. Provide a brief, welcoming greeting message in 1-2 sentences, introducing yourself and offering to help with SEO tools."
          }
        ]
      });
      
      const greeting = completion.content;
      addMessage('assistant', greeting);
      
      // Add to conversation history
      conversationHistory.push({
        role: "assistant",
        content: greeting
      });
    } catch (error) {
      console.error("Error getting AI greeting:", error);
      addMessage('assistant', "👋 Hi! I'm your SEO assistant. How can I help you with the SEO tools today?");
    }
  }, 1000);
}

// Mock Google Natural Language API client for demo purposes
const websim = {
  chat: {
    completions: {
      create: async function(params) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { content: "I'm your SEO assistant. How can I help you with the SEO tools today?" };
      }
    }
  }
};

// Theme Switcher
function setupThemeSwitcher() {
  const themes = [
    { name: 'Default', class: '' },
    { name: 'Diamond Reflections', class: 'theme-diamond' },
    { name: 'Luxury', class: 'theme-luxury' },
    { name: 'Cyberpunk 2077', class: 'theme-cyberpunk' },
    { name: 'Neomorphism', class: 'theme-neomorphism' }
  ];
  
  // Create theme switcher HTML
  const themeSwitcher = document.createElement('div');
  themeSwitcher.className = 'theme-switcher';
  
  // Add theme buttons
  themes.forEach(theme => {
    const button = document.createElement('button');
    button.className = 'theme-button';
    button.textContent = theme.name;
    button.dataset.theme = theme.class;
    
    // Set active state for default theme
    if (theme.class === '') {
      button.classList.add('active');
    }
    
    button.addEventListener('click', () => {
      // Remove all theme classes from body
      document.body.className = '';
      
      // Add new theme class if not default
      if (theme.class) {
        document.body.classList.add(theme.class);
      }
      
      // Update active button
      document.querySelectorAll('.theme-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      
      // Save user preference
      localStorage.setItem('selectedTheme', theme.class);
    });
    
    themeSwitcher.appendChild(button);
  });
  
  // Add theme switcher to API manager panel if it exists, otherwise add to body
  const apiManagerPanel = document.querySelector('.api-manager-panel');
  if (apiManagerPanel) {
    apiManagerPanel.appendChild(themeSwitcher);
  } else {
    document.body.appendChild(themeSwitcher);
  }
  
  // Load saved theme preference
  const savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme) {
    document.body.className = savedTheme;
    
    // Update active button
    const activeButton = document.querySelector(`.theme-button[data-theme="${savedTheme}"]`);
    if (activeButton) {
      document.querySelectorAll('.theme-button').forEach(btn => {
        btn.classList.remove('active');
      });
      activeButton.classList.add('active');
    }
  }
}

// Setup API Management System
function setupApiManagement() {
  // Create API Manager container
  const apiManager = document.createElement('div');
  apiManager.className = 'api-manager';
  apiManager.innerHTML = `
    <div class="api-manager-toggle">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
      </svg>
    </div>
    <div class="api-manager-panel">
      <h3>API Endpoints</h3>
      <p>Configure up to 4 API endpoints for your tools</p>
      
      <div class="api-form">
        <div class="api-endpoint">
          <label>OpenAI API</label>
          <input type="text" id="openai-api" placeholder="Enter API key">
          <div class="api-status" data-status="disconnected">Disconnected</div>
        </div>
        
        <div class="api-endpoint">
          <label>Keywords Everywhere API</label>
          <input type="text" id="keywords-api" placeholder="Enter API key">
          <div class="api-status" data-status="disconnected">Disconnected</div>
        </div>
        
        <div class="api-endpoint">
          <label>Google Natural Language API</label>
          <input type="text" id="google-api" placeholder="Enter API key">
          <div class="api-status" data-status="disconnected">Disconnected</div>
        </div>
        
        <div class="api-endpoint">
          <label>Custom API Endpoint</label>
          <input type="text" id="custom-api" placeholder="Enter API URL">
          <input type="text" id="custom-api-key" placeholder="Enter API key (optional)">
          <div class="api-status" data-status="disconnected">Disconnected</div>
        </div>
      </div>
      
      <div class="api-actions">
        <button id="save-api-keys" class="analyze-btn">Save API Keys</button>
        <button id="test-connections" class="nav-btn">Test Connections</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(apiManager);
  
  // Toggle API manager panel
  const apiToggle = apiManager.querySelector('.api-manager-toggle');
  const apiPanel = apiManager.querySelector('.api-manager-panel');
  
  apiToggle.addEventListener('click', () => {
    apiPanel.classList.toggle('open');
  });
  
  // Setup API key saving
  const saveButton = document.getElementById('save-api-keys');
  const testButton = document.getElementById('test-connections');
  
  saveButton.addEventListener('click', () => {
    const openaiKey = document.getElementById('openai-api').value.trim();
    const keywordsKey = document.getElementById('keywords-api').value.trim();
    const googleKey = document.getElementById('google-api').value.trim();
    const customApiUrl = document.getElementById('custom-api').value.trim();
    const customApiKey = document.getElementById('custom-api-key').value.trim();
    
    // Save to localStorage (encrypted in a real app)
    if (openaiKey) localStorage.setItem('openai-api-key', openaiKey);
    if (keywordsKey) localStorage.setItem('keywords-api-key', keywordsKey);
    if (googleKey) localStorage.setItem('google-api-key', googleKey);
    if (customApiUrl) localStorage.setItem('custom-api-url', customApiUrl);
    if (customApiKey) localStorage.setItem('custom-api-key', customApiKey);
    
    updateApiStatus();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'api-save-success';
    successMsg.textContent = 'API keys saved successfully!';
    apiPanel.appendChild(successMsg);
    
    setTimeout(() => {
      apiPanel.removeChild(successMsg);
    }, 3000);
  });
  
  testButton.addEventListener('click', async () => {
    const statusElements = document.querySelectorAll('.api-status');
    statusElements.forEach(element => {
      element.textContent = 'Testing...';
      element.dataset.status = 'testing';
    });
    
    await testApiConnections();
  });
  
  // Load saved API keys
  loadSavedApiKeys();
  updateApiStatus();
}

// Load saved API keys
function loadSavedApiKeys() {
  const openaiKey = localStorage.getItem('openai-api-key');
  const keywordsKey = localStorage.getItem('keywords-api-key');
  const googleKey = localStorage.getItem('google-api-key');
  const customApiUrl = localStorage.getItem('custom-api-url');
  const customApiKey = localStorage.getItem('custom-api-key');
  
  if (openaiKey) document.getElementById('openai-api').value = openaiKey;
  if (keywordsKey) document.getElementById('keywords-api').value = keywordsKey;
  if (googleKey) document.getElementById('google-api').value = googleKey;
  if (customApiUrl) document.getElementById('custom-api').value = customApiUrl;
  if (customApiKey) document.getElementById('custom-api-key').value = customApiKey;
}

// Update API status indicators
function updateApiStatus() {
  const openaiKey = localStorage.getItem('openai-api-key');
  const keywordsKey = localStorage.getItem('keywords-api-key');
  const googleKey = localStorage.getItem('google-api-key');
  const customApiUrl = localStorage.getItem('custom-api-url');
  
  const statusElements = document.querySelectorAll('.api-status');
  
  if (openaiKey) {
    statusElements[0].textContent = 'Connected';
    statusElements[0].dataset.status = 'connected';
  }
  
  if (keywordsKey) {
    statusElements[1].textContent = 'Connected';
    statusElements[1].dataset.status = 'connected';
  }
  
  if (googleKey) {
    statusElements[2].textContent = 'Connected';
    statusElements[2].dataset.status = 'connected';
  }
  
  if (customApiUrl) {
    statusElements[3].textContent = 'Connected';
    statusElements[3].dataset.status = 'connected';
  }
}

// Test API connections
async function testApiConnections() {
  const openaiKey = localStorage.getItem('openai-api-key');
  const keywordsKey = localStorage.getItem('keywords-api-key');
  const googleKey = localStorage.getItem('google-api-key');
  const customApiUrl = localStorage.getItem('custom-api-url');
  const customApiKey = localStorage.getItem('custom-api-key');
  
  const statusElements = document.querySelectorAll('.api-status');
  
  // Test OpenAI connection
  if (openaiKey) {
    try {
      // In a real app, you would use a proper test endpoint
      const response = await fetch('https://api.openai.com/v1/engines', {
        headers: {
          'Authorization': `Bearer ${openaiKey}`
        }
      });
      
      if (response.ok) {
        statusElements[0].textContent = 'Connected';
        statusElements[0].dataset.status = 'connected';
      } else {
        statusElements[0].textContent = 'Invalid API Key';
        statusElements[0].dataset.status = 'error';
      }
    } catch (error) {
      statusElements[0].textContent = 'Connection Error';
      statusElements[0].dataset.status = 'error';
    }
  } else {
    statusElements[0].textContent = 'Disconnected';
    statusElements[0].dataset.status = 'disconnected';
  }
  
  // Similarly test other API connections...
  // Keywords Everywhere
  if (keywordsKey) {
    statusElements[1].textContent = 'Connected';  // For demo purposes
    statusElements[1].dataset.status = 'connected';
  } else {
    statusElements[1].textContent = 'Disconnected';
    statusElements[1].dataset.status = 'disconnected';
  }
  
  // Google Natural Language
  if (googleKey) {
    statusElements[2].textContent = 'Connected';  // For demo purposes
    statusElements[2].dataset.status = 'connected';
  } else {
    statusElements[2].textContent = 'Disconnected';
    statusElements[2].dataset.status = 'disconnected';
  }
  
  // Custom API
  if (customApiUrl) {
    statusElements[3].textContent = 'Connected';  // For demo purposes
    statusElements[3].dataset.status = 'connected';
  } else {
    statusElements[3].textContent = 'Disconnected';
    statusElements[3].dataset.status = 'disconnected';
  }
}

// Get API Key for a specific service
function getApiKey(service) {
  switch (service) {
    case 'openai':
      return localStorage.getItem('openai-api-key');
    case 'keywords':
      return localStorage.getItem('keywords-api-key');
    case 'google':
      return localStorage.getItem('google-api-key');
    case 'custom':
      return {
        url: localStorage.getItem('custom-api-url'),
        key: localStorage.getItem('custom-api-key')
      };
    default:
      return null;
  }
}

// Update document ready function
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...
  
  // Set up the tools
  setupHtmlAnalyzer();
  setupKeywordDensity();
  setupTfIdf();
  setupReadability();
  setupMetaTags();
  setupSchemaGenerator();
  setupKeywordDatabase(); 
  setupSentimentAnalysis();
  setupContentEditor(); // Add this line
  setupChatbot();
  setupThemeSwitcher();
  setupApiManagement();
});

// Content Editor Tool
function setupContentEditor() {
  // Load required libraries
  loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js')
    .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.5/purify.min.js'))
    .then(() => loadScript('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js'))
    .then(() => loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js'))
    .then(() => {
      // Initialize content editor after all scripts are loaded
      initializeContentEditor();
    })
    .catch(error => console.error('Error loading content editor scripts:', error));
    
  // Load Font Awesome if not already loaded
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }
  
  // Load highlight.js styles if not already loaded
  if (!document.querySelector('link[href*="highlight.js"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css';
    document.head.appendChild(link);
  }
}

// Helper function to dynamically load scripts
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function initializeContentEditor() {
  // Markdown Editor Functionality
  const markdownEditor = document.getElementById('markdownEditor');
  const markdownPreview = document.getElementById('markdownPreview');
  let mermaidInitialized = false;
  
  if (typeof marked !== 'undefined') {
    marked.setOptions({
      breaks: true,
      highlight: function(code) {
        return hljs.highlightAuto(code).value;
      }
    });
  
    const updateMarkdownPreview = () => {
      if (markdownEditor && markdownPreview) {
        const clean = DOMPurify.sanitize(marked.parse(markdownEditor.value));
        markdownPreview.innerHTML = clean;
      }
    };
  
    if (markdownEditor) {
      markdownEditor.addEventListener('input', updateMarkdownPreview);
      updateMarkdownPreview(); // Initial preview
    }
  }
  
  // Mermaid Editor Functionality
  const mermaidEditor = document.getElementById('mermaidEditor');
  const mermaidPreview = document.getElementById('mermaidPreview');
  
  async function renderMermaid() {
    if (!mermaidInitialized && typeof mermaid !== 'undefined') {
      await mermaid.initialize({ startOnLoad: false, theme: 'neutral' });
      mermaidInitialized = true;
    }
    
    if (mermaidEditor && mermaidPreview && typeof mermaid !== 'undefined') {
      try {
        mermaidPreview.innerHTML = '';
        const { svg } = await mermaid.render('mermaidChart', mermaidEditor.value);
        mermaidPreview.innerHTML = svg;
      } catch (error) {
        mermaidPreview.innerHTML = `<div class="error">${error.message}</div>`;
      }
    }
  }
  
  if (mermaidEditor) {
    mermaidEditor.addEventListener('input', renderMermaid);
    setTimeout(renderMermaid, 1000); // Initial render with delay to ensure mermaid is loaded
  }
  
  // Toolbar button functionality
  const toolbarButtons = document.querySelectorAll('.toolbar button[data-command]');
  toolbarButtons.forEach(button => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');
      
      if (!markdownEditor) return;
      
      const start = markdownEditor.selectionStart;
      const end = markdownEditor.selectionEnd;
      const selectedText = markdownEditor.value.substring(start, end);
      
      let replacement = '';
      
      switch (command) {
        case 'bold':
          replacement = `**${selectedText || 'bold text'}**`;
          break;
        case 'italic':
          replacement = `*${selectedText || 'italic text'}*`;
          break;
        case 'link':
          replacement = `[${selectedText || 'link text'}](https://example.com)`;
          break;
        case 'code':
          replacement = `\`${selectedText || 'code'}\``;
          break;
        case 'image':
          replacement = `![${selectedText || 'alt text'}](https://example.com/image.jpg)`;
          break;
        case 'table':
          replacement = `| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |`;
          break;
      }
      
      markdownEditor.value = 
        markdownEditor.value.substring(0, start) + 
        replacement + 
        markdownEditor.value.substring(end);
      
      // Update the preview
      updateMarkdownPreview();
      
      // Focus back on the editor
      markdownEditor.focus();
    });
  });
  
  // Export Functionality
  const exportMermaid = document.getElementById('exportMermaid');
  if (exportMermaid) {
    exportMermaid.addEventListener('click', () => {
      const svg = mermaidPreview?.querySelector('svg');
      if (svg) {
        const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'diagram.svg';
        a.href = url;
        a.click();
      }
    });
  }
  
  // Template Handling
  const mermaidTemplates = document.getElementById('mermaidTemplates');
  if (mermaidTemplates) {
    mermaidTemplates.addEventListener('change', function() {
      const templates = {
        flowchart: `graph TD\n    A[Start] --> B{Decision}\n    B --> C[Result]\n    B --> D[Alternative]`,
        sequence: `sequenceDiagram\n    participant A\n    participant B\n    A->>B: Message`,
        gantt: `gantt\n    title Project Timeline\n    section Phase 1\n    Task 1 :a1, 2023-10-01, 7d`
      };
      
      if (templates[this.value] && mermaidEditor) {
        mermaidEditor.value = templates[this.value];
        renderMermaid();
      }
      this.value = '';
    });
  }
}
