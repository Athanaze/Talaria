var sideBar = document.getElementById('sideBar');


/*
Get the whole conversation JSON object, so we can iterate over it, and generate
the list containing all the user's conversations
*/
async function getWholeObjConv() {
    const response = await fetch('http://localhost:5000/getWholeObjConv/');
    const js = await response.json(); //extract JSON from the http response
    return js;
}


function generateSideBar(refId){
    getWholeObjConv().then(function(result){
        for (var i = 0; i < result.length; i++) {
            var s = '<a class="convLink" href="conv.html?i='+result[i].id.toString()+'">'+result[i].name+'</a>';
            sideBar.insertAdjacentHTML('beforeend',s);
        }
    });
    //Set sideBarHeight
    sideBar.style.height = document.getElementById(refId).offsetHeight+"px";
}
