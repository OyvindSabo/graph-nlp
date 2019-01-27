const containsVariable = prompt => {
  const startIndex = prompt.indexOf('<');
  const endIndex = prompt.indexOf('>');
  return startIndex !== -1 && startIndex < endIndex;
}

// {message: 'Hello, my name is Øyvind', prompt: '<greeting>, my name is <name>.'
// 'Jumping over a rock is difficult.', 'Jumping over a <thing> is <adjective>.'
// 'Hello, my name is Øyvind.', 'Jumping over a <thing> is <adjective>.
const extractVariables = (message, prompt, variables = {}) => {
  if (containsVariable(prompt)) { //True
    if (message.indexOf(prompt.substring(0, prompt.indexOf('<'))) !== 0) return null;
    const variableName = prompt.substring(prompt.indexOf('<') + 1, prompt.indexOf('>')); // 'greeting' //'thing'
    const restOfPrompt = prompt.substring(prompt.indexOf('>') + 1); // ', my name is <name>.' // ' is <adjective>'
    let promptSubstring;
    let restOfMessage;
    let value;
    if (containsVariable(restOfPrompt)) { // true
      promptSubstring = restOfPrompt.substring(0, restOfPrompt.indexOf('<')); // ', my name is '
      value = message.substring(prompt.indexOf('<'), message.indexOf(promptSubstring)) // 'Hello'
      restOfMessage = message.substring(message.indexOf(promptSubstring)); // ', my name is Øyvind'
      variables[variableName] = value;
      return extractVariables(restOfMessage, restOfPrompt, variables);
    }
    restOfMessage = message.substring(message.indexOf(restOfPrompt));
    value = message.substring(prompt.indexOf('<'), message.indexOf(restOfPrompt))
    variables[variableName] = value;
    if (restOfMessage === restOfPrompt) {
      return variables;
    }
  }
  return null;
}

/*console.log(extractVariables('Hello, my name is Øyvind.', '<greeting>, my name is <name>.'));
console.log('-----------------------------------------------------------------')
console.log(extractVariables('Jumping over a rock is difficult.', 'Jumping over a <thing> is <adjective>.'));
console.log('-----------------------------------------------------------------')
console.log(extractVariables('For every book you read, you will get wiser.', 'For every <noun> you <verb>, <person> will get <adjective>.'));*/

const parseResponse = (message, { prompt, replyFunction }) => {
  const variables = extractVariables(message, prompt);
  console.log('extractVariables(' + message + ', ' + prompt + ');');
  console.log('parseUtils: prompt: ', prompt);
  console.log('parseUtils: variables: ', variables);
  if (!variables) return null;
  const getReply = new Function(replyFunction.arguments, replyFunction.body);
  console.log('parseUtils: getReply: ', getReply);
  console.log('parseUtils: ', getReply(variables));
  return getReply(variables);
}

module.exports = {
  parseResponse,
}