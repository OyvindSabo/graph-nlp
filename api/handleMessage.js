const { Assistant } = require('./assistant');
const { getPromptToReply } = require('./database');

const handleMessage = (message, id) => {
  
  // promptToReply should be retrieved from a database based on id.
  let promptToReply = getPromptToReply(id);
  const assistant = new Assistant(promptToReply);
  const reply = assistant.handleSentence(message);
  return reply;
}

module.exports = {
  handleMessage,
}