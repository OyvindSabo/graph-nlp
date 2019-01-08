/**
 * TODO
 * For all sentences whch are given to the bot, the words of the sentence should
 * be analyzed to determine how significant each of the words were. for the
 * resulting resulting best match.
 */

class Assistant {
  constructor(promptToReply) {
    // Basic things
    this.sentences = [];
    this.insignificantWords = ['do', 'to', 'it']; // Later, we could add a dictionary where the significance of each word is a parameter
    this.questionWords = ['how', 'what', 'when', 'which', 'why'];
    this.imperativeWords = ['express', 'say', 'tell', 'write'];

    // User defined responses
    // A list of objects consisting of a prompt and a reply which may be a function of the response or simply just a string.
    this.promptToReply = promptToReply || [];
  }

  setPromptToReply({ prompt, replyFunction, replyString }) {
    this.promptToReply.push({prompt: prompt, replyFunction: replyFunction, replyString: replyString})
  }

  levenshtein(s, t) {
    console.log('s, t: ', s, t);
    if (s === t) {
        return 0;
    }
    let n = s.length, m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    let x = 0, y, a, b, c, d, g, h;
    let p = new Uint16Array(n);
    let u = new Uint32Array(n);
    for (y = 0; y < n;) {
        u[y] = s.charCodeAt(y);
        p[y] = ++y;
    }

    for (; (x + 3) < m; x += 4) {
      let e1 = t.charCodeAt(x);
      let e2 = t.charCodeAt(x + 1);
      let e3 = t.charCodeAt(x + 2);
      let e4 = t.charCodeAt(x + 3);
      c = x;
      b = x + 1;
      d = x + 2;
      g = x + 3;
      h = x + 4;
      for (y = 0; y < n; y++) {
        a = p[y];

        if (a < c || b < c) {
          c = (a > b ? b + 1 : a + 1);
        } else if (e1 !== u[y]) {
          c++;
        }

        if (c < b || d < b) {
          b = (c > d ? d + 1 : c + 1);
        } else if (e2 !== u[y]) {
          b++;
        }

        if (b < d || g < d) {
          d = (b > g ? g + 1 : b + 1);
        } else if (e3 !== u[y]) {
          d++;
        }

        if (d < g || h < g) {
          g = (d > h ? h + 1 : d + 1);
        } else if (e4 !== u[y]) {
          g++;
        }

        p[y] = h = g;
        g = d;
        d = b;
        b = c;
        c = a;
      }
    }

    for (; x < m;) {
      let e = t.charCodeAt(x);
      c = x;
      d = ++x;
      for (y = 0; y < n; y++) {
        a = p[y];
        if (a < c || d < c) {
          d = (a > d ? d + 1 : a + 1);
        } else if (e !== u[y]) {
          d = c + 1;
        } else {
          d = c;
        }
        p[y] = d;
        c = a;
      }
      h = d;
    }
    return h;
  }

  matchCertainty(string1, string2) {
    return 1 - this.levenshtein(string1, string2)/Math.max(string1.length, string2.length);
  }

  findBestMatch(questionSentence, potentialMatches) {
    return potentialMatches.map(sentence => ({sentence: sentence, score: this.matchCertainty(sentence, questionSentence)}))
      .reduce((a, b) => {
          if (a.score > b.score) {
            return a;
          }
          return b;
        }, {sentence: 'I don\'t know' , score: 0})
  }

  storeSentence(sentence) {
    // Remove all special characters
    // Split the sentence into words
    const sentenceArray = sentence.split(' ');
    // Add the words to the graph.
    /*
    const sentenceObject = sentenceArray.reduceRight(function (acc, word) {
        let graphObject = {};
        graphObject[word] = acc;
        return graphObject;
    }, 0);
    this.graph.push(sentenceObject);
    */
    this.sentences.push(sentence);
  }
  
  isWhQuestion(sentence) {
    return sentence.includes('?') &&
      this.questionWords
        .map(questionWord => sentence.toLowerCase().includes(questionWord))
        .reduce((a, b) => a || b);
  }

  isYesNoQuestion(sentence) {
    return sentence.includes('?') &&
      !this.questionWords
        .map(questionWord => sentence.toLowerCase().includes(questionWord))
        .reduce((a, b) => a || b);
  }

  isImperative(sentence) {
    return !sentence.includes('?') &&
      this.imperativeWords.includes(sentence.toLowerCase().split(' ')[0]);
  }

  // Answer as yes/no question
  searchForTruth(sentence) {
    sentenceArray = sentence.split(' ');
    
  }

  handleSentence(sentence) {
    // First, check if the prompt matches any user-defined prompts
    const bestMatch = this.findBestMatch(sentence, this.promptToReply.map(e => e.prompt));
    if (bestMatch.score > 0.5) {
      const promptToReply = this.promptToReply.filter(e => e.prompt === bestMatch.sentence)[0]; // Maybe add a default value here in case it for some reason doesn't work
      if (promptToReply.replyFunction) {
        return {answer: promptToReply.replyFunction(promptToReply.prompt), certainty: bestMatch.score};
      }
      return {answer: promptToReply.replyString, certainty: bestMatch.score};
    }

    // otherwise, return based on what the reader has already told the bot

    // Questions  with question words
    if (this.isWhQuestion(sentence)) {
      const bestMatch = this.findBestMatch(sentence, this.sentences);
      if (bestMatch.score > 0.5) {
        return {answer: bestMatch.sentence, certainty: bestMatch.score};
      }
      return {answer: 'I don\'t know', certainty: bestMatch.score};
    }
    
    // Yes/No questions
    if (this.isYesNoQuestion(sentence)) {
      const bestMatch = this.findBestMatch(sentence, sentences);
      if (bestMatch.score > 0.75) {
        return {answer: 'Yes', certainty: bestMatch.score};
      }
      if (bestMatch.score < 0.25) {
        return {answer: 'No', certainty: 1 - bestMatch.score};
      }
      // Certainty of uncertainty - LOL
      return {answer: 'I don\'t know', certainty: 1-Math.abs(0.5-bestMatch.score)};
    }

    // Commands
    if (this.isImperative(sentence)) {
      return {answer: 'this is a temporary response to imperativeSentence', certainty: 1};
    }
    
    // Statements
    this.storeSentence(sentence);
    return {answer: 'Okay.', certainty: 1};
  }
}

module.exports = {
  Assistant
}

/*const testGraph = new Assistant();
//testGraph.storeSentence('I like to travel by plane.');
console.log(JSON.stringify(testGraph.sentences));
console.log(testGraph.isWhQuestion('What time is it?'));
console.log(testGraph.isYesNoQuestion('Is it time?'));
console.log(testGraph.isImperative('Say hello'));
console.log(testGraph.levenshtein('hello', 'hello'))
console.log(testGraph.matchCertainty('How are you doing', 'How are you doing'))
console.log(testGraph.handleSentence('I like to bake brownies'));
console.log(testGraph.sentences);
console.log(testGraph.handleSentence('I like to do my homework in silence'));
console.log(testGraph.handleSentence('This is a sentence'));
//console.log(testGraph.findBestMatch('I like to bake brownies?', testGraph.sentences));
testGraph.setPromptToReply({ prompt: 'Hello', replyFunction: (a) => a+a+a, replyString: 'Goodbye'});
testGraph.setPromptToReply({ prompt: 'Goodbye', replyString: 'Goodbye'});
console.log('-----------------------')
console.log(testGraph.promptToReply);
console.log(testGraph.handleSentence('Hello'));*/