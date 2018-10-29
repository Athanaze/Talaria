// use the variable 'contract' from connectionSC.js

////////////////////////////////////////////////////
// Conversation
//Create a new conversation on the blockchain
function createNewConv() {
    var initialMsg = document.getElementById("NCoMsg").value;
    var nowTimeStamp = Math.floor(Date.now() / 1000);

    contract.createConv.sendTransaction(nowTimeStamp,initialMsg,{from:web3.eth.coinbase}, function(error, result){
        if(!error) {
            alert("Conversation id : "+result);
        }
        else {
            alert(error);
        }
    });
}


//AAC
function addAddressToExistingConv(){
    var convId = document.getElementById("AACId").value;
    var address = document.getElementById("AACAddress").value;
    if(isAddress(address)){
        contract.addAddressToConv.sendTransaction(id,address,{from:web3.eth.coinbase}, function(error, result){
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

}
//ACL
async function addConvToList(){
    var id = document.getElementById("ACLId").value;
    var name = document.getElementById("ACLName").value;
    const response = await fetch('http://localhost:5000/d/'+id+'/'+name);
    const rj = await response.json(); //extract JSON from the http response
    if (rj.succeed){
        alert("New conversation added !");
    }
    else{
        alert("something went wrong");
    }
}

///////////////////////////////////////////////////
// New Contact (NC)
function onClickNcBtn() {
    var address = document.getElementById("NCAddress").value;
    var name = document.getElementById("NCName").value;
    if(isAddress(address)){
        createNewContact(address, name);
    }
    else{
        alert("Enter a valid address");
    }

}
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
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};
