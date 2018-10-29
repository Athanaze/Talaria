/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////

var express = require('express');
var fs = require('fs');
var url = require('url');
var app = express();
//Serves static files from web folder; i.e. all UI COMPONENTS
app.use(express.static('web'));

/////////////////////////////////////////////////
// WRITE TO JSON
/////////////////////////////////////////////////

//Contact
app.get('/c/:theAddress/:prettyName', function (req, res){
        writeContact(req.params.theAddress.toString(), req.params.prettyName.toString());
        res.send(JSON.stringify({ "succeed":true}));
        }
);

function writeContact(address, prettyName) {
    var jObj;
    try {
        jObj = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));

    }
    // TODO : CHECK IF DAT BOII ACTUALLY DO something
    catch (e) {
        jObj = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));
    }
    jObj.push({"address":address, "name":prettyName});
    fs.writeFile("contacts.json", JSON.stringify(jObj), function (err) {
        if (err) throw err;
    });
}
////////////////////////////////////////////////
//Conversation
app.get('/d/:id/:prettyName', function (req, res){
        writeConv(req.params.id.toString(), req.params.prettyName.toString());
        res.send(JSON.stringify({ "succeed":true}));
        }
);
function writeConv(id, prettyName) {
    var jObj;
    try {
        jObj = JSON.parse(fs.readFileSync('convs.json', 'utf8'));

    }
    catch (e) {
        jObj = JSON.parse(fs.readFileSync('convs.json', 'utf8'));
    }
    jObj.push({"id":id, "name":prettyName});
    fs.writeFile("convs.json", JSON.stringify(jObj), function (err) {
        if (err) throw err;
    });
}
////////////////////////////////////////////////

/////////////////////////////////////////////////
// GET THE PRETTY NAME AND SEND IT
/////////////////////////////////////////////////

//Contact
app.get('/getName/:theAddress', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "name":getName(req.params.theAddress)}));
});
function getName(address){
    var name = address;
    var jsonContent = JSON.parse(fs.readFileSync('contacts.json', 'utf8'));

    for (var i = 0; i < jsonContent.length; i++) {
        if(jsonContent[i].address == address){
            name = jsonContent[i].name;
        }
    }
    return name;
}

////////////////////////////////////////////////
//Conversation
app.get('/getConvName/:id', function(req, res){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "name":getConvName(req.params.id)}));
});
function getConvName(id){
    var name = id;
    var jsonContent = JSON.parse(fs.readFileSync('convs.json', 'utf8'));

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

var server = app.listen(5000);
