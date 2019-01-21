const containsVariable = prompt => {
  console.log('prompt: ', prompt);
  const startIndex = prompt.indexOf('<');
  console.log('startIndex = ', startIndex);
  const endIndex = prompt.indexOf('>');
  console.log('endIndex = ', endIndex);
  return startIndex !== -1 && startIndex < endIndex;
}

// {message: 'Hello, my name is Øyvind', prompt: '<greeting>, my name is <name>.'
// 'Jumping over a rock is difficult.', 'Jumping over a <thing> is <adjective>.'
const extractVariables = (message, prompt, variables = {}) => {
  if (containsVariable(prompt)) { //True
    const variableName = prompt.substring(prompt.indexOf('<') + 1, prompt.indexOf('>')); // 'greeting'
    console.log(`variableName (should be greeting) = '${variableName}'`);
    const restOfPrompt = prompt.substring(prompt.indexOf('>') + 1); // ', my name is <name>.'
    console.log(`restOfPrompt (should be ', my name is <name>') = '${restOfPrompt}'`);
    let promptSubstring;
    let restOfMessage;
    let value;
    console.log(`containsVariable(restOfPrompt) (should be true) = ${containsVariable(restOfPrompt)}`);
    if (containsVariable(restOfPrompt)) { // true
      console.log('The rest of the prompt contans a variable');
      promptSubstring = restOfPrompt.substring(0, restOfPrompt.indexOf('<')); // ', my name is '
      value = message.substring(prompt.indexOf('<'), message.indexOf(promptSubstring)) // 'Hello'
      console.log(`In if loop: value = '${value}`);
      restOfMessage = message.substring(message.indexOf(promptSubstring)); // ', my name is Øyvind'
      variables[variableName] = value;
      console.log('variables: ', variables);
      return extractVariables(restOfMessage, restOfPrompt, variables);
    }
    restOfMessage = message.substring(message.indexOf(restOfPrompt));
    value = message.substring(prompt.indexOf('<'), message.indexOf(restOfPrompt))
    variables[variableName] = value;
    if (restOfMessage === restOfPrompt) {
      return variables;
    }
  }
  return false;
}

console.log(extractVariables('Hello, my name is Øyvind.', '<greeting>, my name is <name>.'));
console.log('-----------------------------------------------------------------')
console.log(extractVariables('Jumping over a rock is difficult.', 'Jumping over a <thing> is <adjective>.'));
console.log('-----------------------------------------------------------------')
console.log(extractVariables('For every book you read, you will get wiser.', 'For every <noun> you <verb>, <person> will get <adjective>.'));

const parsePromptToResponse = (message, { prompt, replyFunction, replyString }) => {
  
}

module.exports = {
  parsePromptToResponse,
}