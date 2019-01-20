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
//aka the id of the conversation
var convIndex = getUrlVars()["i"];
var myAddress;

//The conversation key is also a global variable.
var convKey;
async function getConvKey(){
  const response = await fetch('http://localhost:5000/getKey/'+convIndex);
  const js = await response.json(); //extract JSON from the http response
  return js.key;
}
getConvKey().then(function(result) {
  convKey = result;
});

/////////////////////////////////////////////////
// UI
/////////////////////////////////////////////////

/////////////////////////////////////////////////
// OVERLAY

//Called by "contract.isInConv"
function showOverlay() {
    let overlayDiv = document.getElementById("overlay");
    overlayDiv.style.display = "flex";
    overlayDiv.style.backgroundColor='rgba(255,0,0,0.5)';
}
//When the user press the ok button on the overlay
function overlayOK(){
  window.location = "index.html";
}

/////////////////////////////////////////////////
// GETTER
async function getNameViaContact(address) {
    address = address.toUpperCase();
    const response = await fetch('http://localhost:5000/getName/'+address);
    const resp = await response.json(); //extract JSON from the http response
    //Not in contacts
    if(resp.name == address){
        //Display only the beginning of the address
        resp.name = resp.name.substring(0,6);
    }
    return resp.name;
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
  //Normal behavior
  if(convIndex != 0){
    if(msg[0].toString() == myAddress){
        chatRoomElement.insertAdjacentHTML('beforeend','<div class="msgContainerMe"><div class="msgMe">'+decry(msg[2])+'<p class="infos">'+timeStampToPrettyStr(msg[1])+'</p></div></div>');
    }
    else{
        getNameViaContact(msg[0].toString()).then(function(result) {
            chatRoomElement.insertAdjacentHTML('beforeend','<div class="msgContainerOther"><div class="msgOther">'+'<p class="author">'+result+'</p>'+decry(msg[2])+'<p class="infos">'+timeStampToPrettyStr(msg[1])+'</p></div></div>');
        });
    }
  }
  // Just for the first conversation (#0)
  else{
    if(msg[0].toString() == myAddress){
        chatRoomElement.insertAdjacentHTML('beforeend','<div class="msgContainerMe"><div class="msgMe">'+msg[2]+'<p class="infos">'+timeStampToPrettyStr(msg[1])+'</p></div></div>');
    }
    else{
        getNameViaContact(msg[0].toString()).then(function(result) {
            chatRoomElement.insertAdjacentHTML('beforeend','<div class="msgContainerOther"><div class="msgOther">'+'<p class="author">'+result+'</p>'+msg[2]+'<p class="infos">'+timeStampToPrettyStr(msg[1])+'</p></div></div>');
        });
    }
    alert("Do not try to send a message here ! It's just an example.")
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
/////////////////////////////////////////////////////////////
// Cryptographic operations
// For these operations, we use the global variable convKey.
/////////////////////////////////////////////////////////////

//Encrypt the given message using the conversation key
function encry(msg){
  return CryptoJS.AES.encrypt(msg, convKey).toString();
}

//Decrypt the given message using the conversation key
function decry(msg){
  var bytes  = CryptoJS.AES.decrypt(msg, convKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/////////////////////////////////////////////////
// Smart Contract
/////////////////////////////////////////////////

function getConvInfoError(){
  alert("Talaria was not able to get informations about the conversation");
}

// Get the number of messages in the conversation and grab the user's address
contract.getConvLength(convIndex,function (error, result) {
        if(!error){
            myAddress = web3.eth.coinbase;
            isInConvWrapper();
            readEntireConversation(result);

        }
        else {
            getConvInfoError();
        }
    }
);
contract.getLatestConvId(function (error, result) {
  if(!error){
    console.log(result);
  }
  else{
    getConvInfoError();
  }
});
/*
    /!\ USE ONLY WHEN a value is already assigned to myAddress /!\
    This function checks if the user is in the conversation
*/
function isInConvWrapper(){
    contract.isInConv(convIndex, myAddress, function (error, result){
        if(!error){
            if(result){
                console.log("User in the conversation");
            }
            else{

                if(convIndex != 0){
                  //if he is not in this conversation, show the overlay
                    showOverlay();
                }
            }
        }
        else {
            getConvInfoError();
        }
    });
}

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
        console.log("sending message : "+value);
        var nowTimeStamp = Math.floor(Date.now() / 1000);
        contract.addMessage.sendTransaction(convIndex,nowTimeStamp,encry(value),{from:web3.eth.coinbase}, function(error, result){
            if(!error) {
                console.log("#" + result + "#");
            } else {
                console.error(error);
            }
        });
    }
    else {
        alert("Type something first !");
    }
}
