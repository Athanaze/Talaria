/////////////////////////////////////////////////
// Setting up PARAMETERS
/////////////////////////////////////////////////
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function(m,key,value) {
      vars[key] = value;
    });
    return vars;
}
var convIndex = getUrlVars()["i"];
var myAddress;

/////////////////////////////////////////////////
// UI
/////////////////////////////////////////////////

/////////////////////////////////////////////////
// GETTER
async function getNameViaContact(address) {
    const response = await fetch('http://localhost:5000/getName/'+address);
    const js = await response.json(); //extract JSON from the http response
    //Not in contacts
    if(js.name == address){
        //Display only the beginning of the address
        js.name = js.name.substring(0,6);
    }
    console.log(js.name);
    return js.name;
}
async function getNameViaConv(id) {
    const response = await fetch('http://localhost:5000/getConvName/'+id);
    const js = await response.json(); //extract JSON from the http response
    return js.name;
}

//Set conversation header
getNameViaConv(convIndex).then(function(result) {
    console.log("CONV INDEX : "+convIndex);
    document.getElementById('topBarHeader').innerHTML = result;
});


//Add msg to the DOM
var chatRoomElement = document.getElementById('chatRoom');
function addMessageToChatRoom(msg){
    if(msg[0].toString() == myAddress){
        chatRoomElement.insertAdjacentHTML('beforeend','<div class="msgContainerMe"><div class="msgMe">'+msg[2]+'<p class="infos">'+timeStampToPrettyStr(msg[1])+'</p></div></div>');
    }
    else{
        getNameViaContact(msg[0].toString()).then(function(result) {
            chatRoomElement.insertAdjacentHTML('beforeend','<div class="msgContainerOther"><div class="msgOther">'+'<p class="author">'+result+'</p>'+msg[2]+'<p class="infos">'+timeStampToPrettyStr(msg[1])+'</p></div></div>');
        });

    }
}

function timeStampToPrettyStr(timeStamp) {
    var date = new Date(timeStamp * 1000);
    var nowTimeStamp = Math.floor(Date.now() / 1000);
    var prettyHour = intTo2DigitsStr(date.getHours())+"h"+intTo2DigitsStr(date.getMinutes());
    if( (nowTimeStamp - timeStamp) < 86400 ){
        //Still today
        return prettyHour;
    }
    else{
        //Not today
        return intTo2DigitsStr(date.getDate())+ "/"+intTo2DigitsStr(date.getMonth())+" : "+prettyHour;
    }
}

function intTo2DigitsStr(i){
    //Only one digit
    if(i<10){
        return "0"+i.toString();
    }
    else{
        //Already two digits
        return i.toString();
    }
}

/////////////////////////////////////////////////
// Smart Contract
/////////////////////////////////////////////////
// Get the number of messages in the conversation and grab the user's address
contract.getConvLength(convIndex,function (error, result) {
        if(!error){
            myAddress = web3.eth.coinbase;
            readEntireConversation(result);
        }
        else {
            alert("Phew");
        }
    }
);

function readEntireConversation(len){
    for (var i = len+1; i >= 0; i--) {
        contract.getMessage(convIndex,i, function (error, result) {
            if(!error){
                addMessageToChatRoom(result);
            }
        });
    }
}

//write
function sendMsg() {
    var value = document.getElementById("textArea").value;
    if (value != '') {
        alert("sending message : "+value);
        var nowTimeStamp = Math.floor(Date.now() / 1000);
        contract.addMessage.sendTransaction(convIndex,nowTimeStamp,value,{from:web3.eth.coinbase}, function(error, result){
            if(!error) {
                console.log("#" + result + "#");
            } else {
                console.error(error);
            }
        });
    }
    else {
        alert("type something first !");
    }
}
