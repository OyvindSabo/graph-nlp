const { isValidKey } = require('./authUtils');
const { handleMessage } = require('./handleMessage.js');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

//Allow all requests from all domains & localhost
app.all('/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// get all users
app.get('/api', (req, res) => {
  console.log("GET From SERVER");
  res.send('The API is working like it should :)');
});

// get specific user
app.get('/users/:userId', (req, res) => {
  console.log("GET From SERVER");
  console.log(req.params.userId);
  console.log(req.params.userId);
  res.send(getUserById(req.params.userId));
});

// Check if key is valid
app.post('/api/validateKey', (req, res) => {
  let key = req.body;
  console.log(req.body);
  validity = checkValidity(key);
  res.status(200).send(validity);
});

// Chat
app.post('/api/assistant/:id', (req, res) => {
  const id = req.params.id;
  const message = req.body.message;
  const response = handleMessage(message, id);
  res.status(200).send(response);
});

app.listen(6069);