// use the variable 'contract' from connectionSC.js
function createNewConv() {
    var initialMsg = prompt("Initial message");
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

function addAddressToExistingConv(){
    contract.addAddressToConv.sendTransaction(prompt("Conversation id (number)"),prompt("Address to add (starts with 0x)"),{from:web3.eth.coinbase}, function(error, result){
        if(!error) {
            alert("Address added !");
        }
        else {
            alert(error);
        }
    });
}

function addNewContact(){
    var address = prompt("Address (starts with 0x)");
    var name = prompt("Name");
    createNewContact(address, name);
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
