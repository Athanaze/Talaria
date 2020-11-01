pragma solidity ^0.4.20;
contract Chatty{

    struct Conv{
        address[] addresses;
        address[] authors;
        uint[] timestamps;
        string[] messages;
    }
    Conv[] convs;

    function createConv(uint timestamp, string message) public returns (uint){
        Conv memory conv = Conv(new address[](0), new address[](0), new uint[](0), new string[](0));
        convs.push(conv);
        convs[convs.length-1].addresses.push(msg.sender);
        convs[convs.length-1].authors.push(msg.sender);
        convs[convs.length-1].timestamps.push(timestamp);
        convs[convs.length-1].messages.push(message);
        return (convs.length-1);
    }
    function getConv(uint index) public view returns (address, string){
        return(convs[index].addresses[0], convs[index].messages[0]);
    }
    function getMessage(uint index, uint messageIndex) public view returns(address, uint, string){
        return (convs[index].authors[messageIndex], convs[index].timestamps[messageIndex], convs[index].messages[messageIndex]);
    }

    function getConvLength(uint index) public view returns (uint) {
        return(convs[index].authors.length);
    }

    function getLatestConvId() public view returns (uint){
      return (convs.length);
    }

    function addMessage(uint index, uint timestamp, string message) public{
        if(isInConv(index, msg.sender)){
            convs[index].authors.push(msg.sender);
            convs[index].timestamps.push(timestamp);
            convs[index].messages.push(message);
        }
    }
    function addAddressToConv(uint index, address addressToAdd) public {
        if(msg.sender == convs[index].addresses[0]){
            convs[index].addresses.push(addressToAdd);
        }
    }
    function isInConv(uint index, address a) public view returns (bool){
        bool inConv = false;
        for(uint i = 0; i < convs[index].addresses.length; i++){
            if(convs[index].addresses[i] == a){
                inConv = true;
            }
        }
        return (inConv);
    }

}
