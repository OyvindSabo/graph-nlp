const getPromptToReply = id => [
  {
    prompt: 'Hello there', replyString: 'Hello, yourself'
  },{
    prompt: 'Goodbye', replyString: 'Goodbye yourself'
  }, {
    prompt: 'Hello, my name is <name>', replyFunction: ({ name }) => `Hello, ${name}!`, replyString: 'Hello.'
  }
];

module.exports = {
  getPromptToReply,
}