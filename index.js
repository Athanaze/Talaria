/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////
/*
  Mainly json parsing and editing, to act like a database.
  We use json files instead of a "real" database so the user can easily transfert
  his conversations, contacts and key to another device.
  The user is fully responsible for the security of these json files.
*/
var express = require('express');
var fs = require('fs');
var url = require('url');
var app = express();
var figlet = require('figlet');
//Serves static files from web folder; i.e. all UI COMPONENTS
app.use(express.static('web'));

function getJsonFromFile(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}
////////////////////////////////////////////////
//Contact
const CONTACTS_FILE = "contacts.json"

// WRITE
app.get('/c/:theAddress/:prettyName', function (req, res){
        writeContact(req.params.theAddress.toString(), req.params.prettyName.toString());
        res.send(JSON.stringify({ "succeed":true}));
        }
);

function writeContact(address, prettyName) {
    var jObj;
    try {
        jObj = getJsonFromFile(CONTACTS_FILE);
    }
    catch (e) {
        console.log(e);
    }
    jObj.push({"address":address, "name":prettyName});
    fs.writeFile(CONTACTS_FILE, JSON.stringify(jObj), function (err) {
        if (err) throw err;
    });
}

//GET
app.get('/getName/:theAddress', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "name":getName(req.params.theAddress)}));
});
function getName(address){
    var name = address;
    var jsonContent = getJsonFromFile(CONTACTS_FILE);

    for (var i = 0; i < jsonContent.length; i++) {
        if(jsonContent[i].address == address){
            name = jsonContent[i].name;
        }
    }
    return name;
}

////////////////////////////////////////////////
//Key
const KEYS_FILE = "keys.json"

// WRITE
app.get('/addKey/:convId/:key', function (req, res){
        writeKey(req.params.convId.toString(), req.params.key.toString());
        res.send(JSON.stringify({ "succeed":true}));
        }
);
function writeKey(convId, key) {
    var jObj;
    try {
        jObj = getJsonFromFile(KEYS_FILE);
    }
    catch (e) {
        console.log(e);
    }
    jObj.push({"convId":convId, "key":key});
    fs.writeFile(KEYS_FILE, JSON.stringify(jObj), function (err) {
        if (err) throw err;
    });
}

// GET
app.get('/getKey/:id', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "key":getKey(req.params.id)}));
});

// Returns the key for the given conversation
function getKey(id){
  var jsonContent = getJsonFromFile(KEYS_FILE);
  var key = "";
  for (var i = 0; i < jsonContent.length; i++) {
      if(jsonContent[i].convId == id){
          key = jsonContent[i].key;
      }
  }
  return key;
}

////////////////////////////////////////////////
//Conversation
const CONVS_FILE = "convs.json";
app.get('/d/:id/:prettyName', function (req, res){
        writeConv(req.params.id.toString(), req.params.prettyName.toString());
        res.send(JSON.stringify({"succeed":true}));
        }
);
function writeConv(id, prettyName) {
    var jObj;
    try {
        jObj = getJsonFromFile(CONVS_FILE);
    }
    catch (e) {
      console.log(e);
    }
    jObj.push({"id":id, "name":prettyName});
    fs.writeFile(CONVS_FILE, JSON.stringify(jObj), function (err) {
        if (err) throw err;
    });
}
app.get('/getConvName/:id', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "name":getConvName(req.params.id)}));
});
function getConvName(id){
    var name = id;
    var jsonContent = getJsonFromFile(CONVS_FILE);

    for (var i = 0; i < jsonContent.length; i++) {
        if(jsonContent[i].id == id){
            name = jsonContent[i].name;
        }
    }
    return name;
}
/////////////////////////////////////////////////
// GET THE WHOLE JSON OBJECT AND SEND IT
/////////////////////////////////////////////////

////////////////////////////////////////////////
//Conversation
app.get('/getWholeObjConv/', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(fs.readFileSync('convs.json', 'utf8'));
});

figlet.text('Talaria',{
        font: 'Standard',
        horizontalLayout: 'fitted',
        verticalLayout: 'fitted'
    },
    function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        const BAR = '===========================================\n===========================================';
        console.log(BAR);
        console.log('\x1b[1m','');
        console.log(data);
        console.log(' ');
        console.log(BAR);
        console.log('\x1b[36m%s\x1b[0m','\nOfficial Website : http://arsent.ch/talaria \nServer is listening on port 5000');
    }
);


var server = app.listen(5000);
