const express = require('express')
http = require('http'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  app = express(),
  mongoClient = require('mongodb').MongoClient;

//const url = 'mongodb://localhost:27017';
const url = 'mongodb://172.18.200.11:27017';
const dbName = 'orgmethod';

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, enctype, outdate_cache");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app
  .use(bodyParser.json({ limit: '10mb', type: 'application/json' }))
  .use(bodyParser.urlencoded({ limit: '10mb', extended: true, type: 'application/x-www-form-urlencoding' }))

mongoClient.connect(url,{ useNewUrlParser: true }, function (err, client) {
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  app.db = db;
});
var org_bank = require('./mongo/org.bank');
var org_branchwork = require('./mongo/org.branchwork');
var org_state = require('./mongo/org.state');
var org_dep = require('./mongo/org.dep');
//---------------------------------------------------------------
app.get('/currentDate', (req, res) => {
  res.json(new Date());
})
//---------------------------------------------------------------
app.use('/api/org_bank', org_bank);
app.use('/api/org_branchwork', org_branchwork);
app.use('/api/org_state', org_state);
app.use('/api/org_state', org_dep);
//===============================================================
const port = process.env.PORT || '443';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));




