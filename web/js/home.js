// use the variable 'contract' from connectionSC.js

//Functions used at multiple places
async function addKey(id, key){
    const response = await fetch('http://localhost:5000/addKey/'+id+'/'+key);
    const rj = await response.json(); //extract JSON from the http response
    if (rj.succeed){
        console.log("New key added !");
    }
    else{
        alert("Something went wrong");
    }
}

async function addConvToList(id, name){
    const response = await fetch('http://localhost:5000/d/'+id+'/'+name);
    const rj = await response.json(); //extract JSON from the http response
    if (rj.succeed){
        console.log("New conversation added !");
    }
    else{
        alert("something went wrong");
    }
}
////////////////////////////////////////////////////
// Conversation

document.getElementById("NCoBtn").addEventListener("click", function(){
    //Create a new conversation on the blockchain
    var initialMsg = document.getElementById("NCoMsg").value;
    var encryMsg = CryptoJS.AES.encrypt(initialMsg, document.getElementById("NCoKey").value).toString();
    var nowTimeStamp = Math.floor(Date.now() / 1000);

    contract.createConv.sendTransaction(nowTimeStamp,encryMsg,{from:web3.eth.coinbase}, function(error, result){
        if(!error) {
        }
        else {
            alert(error);
        }
    });

    //Save the key locally
    contract.getLatestConvId(function (error, result) {
      if(!error){
       var key = document.getElementById("NCoKey").value;
       addKey(result, key);
       addConvToList(result, initialMsg);
       location.reload();
       alert("Dont forget to validate the transaction with MetaMask !")
      }
      else{
        alert("Error");
      }
    });
  });

//AAC
document.getElementById("AACBtn").addEventListener("click", function(){
    //Add an address to an existing conversation
    var convId = document.getElementById("AACId").value;
    var address = document.getElementById("AACAddress").value;
    if(isAddress(address)){
        contract.addAddressToConv.sendTransaction(convId,address,{from:web3.eth.coinbase}, function(error, result){
            if(!error) {
                alert("Address added !");
            }
            else {
                alert(error);
            }
        });
    }
    else{
        alert("Enter a valid address");
    }
});
//ACL
//add conversation to the local list
document.getElementById("ACLBtn").addEventListener("click", function(){
    addConvToList(document.getElementById("ACLId").value, document.getElementById("ACLName").value);
    addKey(document.getElementById("ACLId").value, document.getElementById("ACLKey").value);
});
///////////////////////////////////////////////////
// New Contact (NC)
//Get the user's input, then call the async createNewContact
document.getElementById("NCBtn").addEventListener("click", function(){
    var address = document.getElementById("NCAddress").value.toUpperCase();
    var name = document.getElementById("NCName").value;
    if(isAddress(address)){

        createNewContact(address, name);
    }
    else{
        alert("Enter a valid address");
    }
});
async function createNewContact(address, name) {
    const response = await fetch('http://localhost:5000/c/'+address+'/'+name);
    const rj = await response.json(); //extract JSON from the http response
    if (rj.succeed){
        alert("New contact added !");
    }
    else{
        alert("something went wrong");
    }
}

///////////////////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////////////////

function dropDown(imgId, formId) {
    var form = document.getElementById(formId);
    var imgNco = document.getElementById(imgId);
    if(form.style.display == 'none'){
        form.style.display = 'block';
        //Change direction of the arrow
        imgNco.src = "img/upArrow.png"
    }
    else{
        form.style.display = 'none';
        //Change direction of the arrow
        imgNco.src = "img/downArrow.png"
    }

}

///////////////////////////////////////////////////////////////
// TOOLS
//////////////////////////////////////////////////////////////

//Source : https://ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        return true;
    }
};
