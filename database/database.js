const fs = require('fs');

const loadConversationData = (userId) => JSON.parse(fs.readFileSync(`${__dirname}/${userId}.json`));

// Transfrms the textual functions into actual functions
const getPromptsToReplies = (userId) => JSON.parse(fs.readFileSync(`${__dirname}/${userId}.json`));

const addPromptToReply = (userId, promptToReply) => {
  const promptsToReplies = getPromptsToReplies(userId);
  promptsToReplies.push(promptToReply);
  setPromptsToReplies(userId, promptsToReplies);
};

const setPromptsToReplies = (userId, promptsToReplies) => {
  try {
    fs.writeFileSync(`${__dirname}/${userId}.json`, JSON.stringify(promptsToReplies));
  } catch (err) {
    console.log(error);
  }
};

/*const samplePromptsToReplies = [
  {
    prompt: 'Jumping over a <thing> is <adjective>.', replyFunction: {arguments: '{ thing, adjective }', body: 'return `Yes, jumping over a ${thing} is indeed ${adjective}`'}
  }, {
    prompt: 'Hello there', replyFunction: {arguments:'', body: 'return `Hello, yourself`'}
  }, {
    prompt: 'Goodbye', replyFunction: {arguments: '', body: 'return `Goodbye yourself`'}
  }, {
    prompt: 'Hello, my name is <name>.', replyFunction: {arguments: '{ name }', body: 'return `Hello, ${name}!`'}
  }
];*/

module.exports = {
  getPromptsToReplies,
  addPromptToReply,
  setPromptsToReplies,
}

//setPromptsToReplies(1, samplePromptsToReplies);