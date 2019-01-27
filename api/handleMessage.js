const { handleSentence } = require('./assistant');
const { parseResponse } = require('./parseUtils');
const { getPromptsToReplies } = require('../database/database');

const handleMessage = (message, id) => {
  // promptToReply should be retrieved from a database based on id.
  const promptsToReplies = getPromptsToReplies(id);
  const perfectMatchReplies = promptsToReplies
    .map(promptToReply => parseResponse(message, promptToReply))
    .filter(reply => !!reply);
  if (perfectMatchReplies.length) {
    return {answer: perfectMatchReplies[0], certainty: 1};
  }
  // Check if any pattern matching sentences matches the input sentence
    // Then extract the keywords and return the result of the replyFunction
  // Else find the best matching promptString and return the corresponding return string o function.

  const reply = handleSentence(message, promptsToReplies);
  return reply;
}

module.exports = {
  handleMessage,
}