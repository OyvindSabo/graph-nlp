const { Assistant } = require('./assistant');

const handleMessage = (message, id) => {
  
  // promptToReply should be retrieved from a database based on id.
  const promptToReply = [{prompt: 'Hello there', replyString: 'Hello, yourself'}, {prompt: 'Goodbye', replyString: 'Goodbye yourself'}];
  const assistant = new Assistant(promptToReply);
  const reply = assistant.handleSentence(message);
  return reply;
}

module.exports = {
  handleMessage
}