function getSelectionStart() {
    var node = document.getSelection().anchorNode;
    return (node.nodeType == 3 ? node.parentNode : node);
}
window.onload = function(){
    var d = document.getElementById("editor");
    var preLastIndex = 0;
    console.log(d.innerHTML);
    var writing ="";
    var count = 0;
    var cero = 0;
    d.addEventListener("keypress",function(evt){
    var lastEl = d.lastChild;
        if(evt.which === 8){
            writing = writing.substring(0, writing.length-1);
            //alert(writing);
        }
        else{
            writing += String.fromCharCode(evt.which);
           // alert(writing);
        }

    if(evt.which == 32){
        // alert("ok angtes de la vaina");
        var newSpan = document.createElement('span');
        newSpan.innerHTML = writing.substring(0,writing.length);
        //alert("este es el nuevo span con texto: "+newSpan.innerHTML);
        newSpan.onclick = function(){
            var thisContentWords = this.innerHTML.split(" ");
            var editorChilds = Array.prototype.slice.call(d.children);
            console.log(this);
            console.log(Array.prototype.indexOf.call(d.childNodes,this));
            //alert(document.body.innerHTML);
            alert(this.innerHTML);
        }

        if (getSelectionStart().nodeName != "SPAN"){
            //alert("nodo en lenghth -1: "+d.childNodes[d.childNodes.length - 2]);
            d.insertBefore(newSpan, d.lastChild);
            //alert("de first child: "+d.firstChild+" with text: "+d.firstChild.innerHTML);
            //alert("de last child: "+d.lastChild);
            d.lastChild.textContent = "||";
            //alert(window.focusNode);

            var char = 3; // character at which to place caret  content.focus();
            var sel = window.getSelection();
            sel.collapse(d.lastChild, 1);
        }
        else if (getSelectionStart().nodeName == "SPAN"){
            window.setTimeout(function(){
                var thisContentWords = getSelectionStart().innerHTML.split(" ");
                var currentSpan = getSelectionStart();
                var editorChilds = Array.prototype.slice.call(d.childNodes);
                var wordIndex = Array.prototype.indexOf.call(d.childNodes,getSelectionStart());
                currentSpan.innerHTML = thisContentWords[0]+" ";
                newSpan.innerHTML = thisContentWords[1] + " ";
                d.insertBefore(newSpan,d.childNodes[(Array.prototype.indexOf.call(d.childNodes,getSelectionStart())) + 1]);
                console.log(wordIndex);
            },200);
        }
        writing = "";
   }
        //alert(document.body.innerHTML);
        //alert("Cono pero porque no te imprimes");
    });
}
