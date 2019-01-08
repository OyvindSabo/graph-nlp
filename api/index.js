const { isValidKey } = require('./authUtils');

let express = require('express');
let bodyParser = require('body-parser');
let app = express();

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// get all users
app.get('/api', function(req, res) {
  console.log("GET From SERVER");
  res.send('The API is working like it should :)');
});

// get specific user
app.get('/users/:userId', function(req, res) {
  console.log("GET From SERVER");
  console.log(req.params.userId);
  console.log(req.params.userId);
  res.send(getUserById(req.params.userId));
});

// post users
app.post('/api/validateKey', function(req, res) {
  let key = req.body;
  console.log(req.body);
  validity = checkValidity(key);
  res.status(200).send(validity);
});

app.listen(6069);