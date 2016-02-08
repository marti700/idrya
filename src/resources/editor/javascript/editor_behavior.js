function getSelectionStart() {
    var node = document.getSelection().anchorNode;
    return (node.nodeType == 3 ? node.parentNode : node);
}

window.onload = function(){
    //content editable div where the user writes
    var d = document.getElementById("editor");
    var writing =""; //to save the words the user writes
    d.addEventListener("keypress",function(evt){
    var lastEl = d.lastChild;
    var carretControl = "";
    // if the user press backspace
    if(evt.which === 8){
        //delete the last word from the writing variable
        writing = writing.substring(0, writing.length-1);
    }
    else{
        writing += String.fromCharCode(evt.which);
    }

    //if the user press space
    if(evt.which == 32){
        //create a new span
        var newSpan = document.createElement('span');
        //set the innerHTML of the span to the value of writing (which has the word the user just wrote)
        newSpan.innerHTML = writing.substring(0,writing.length);
        //sets a click event in the new created span
        newSpan.onclick = function(){
            //the code inside this function handler is not relevant, just text code
            var thisContentWords = this.innerHTML.split(" ");
            var editorChilds = Array.prototype.slice.call(d.children);
            console.log(this);
            console.log(Array.prototype.indexOf.call(d.childNodes,this));
            //alert(document.body.innerHTML);
            alert(checker.suggestions(this.innerHTML)) //checker is a scala object from idrya.check.spell.SpellChecker
            //alert(checker.getSuggestions(checker.generateMisspellings(checker.dic),checker.dic,this.innerHTML)
            //alert(this.innerHTML);
        }

        //if the caret (the blinking thing from where the words suddenly appear)
        //is not over a span element
        if (getSelectionStart().nodeName != "SPAN"){
            //insert the word wraped in the new created span before the last child of the div
            d.insertBefore(newSpan, d.lastChild);
            //set the last child text to : '||'
            //by the way the las child of the content will always be a textNode
            d.lastChild.textContent = "||";

            //get the position of the carrent
            //which at this point is right at
            //the end of the new created span
            var sel = window.getSelection();
            //move the caret position 1 character ahead of it current position
            sel.collapse(d.lastChild, 1);
        }
        //if the caret (the blinking thing from where the words suddenly appear)
        //is over a span
        else if (getSelectionStart().nodeName == "SPAN"){
            var writingCopy = writing;
            //This is triggered when the caret is over a span and the user presses
            //the space key the timer here is essential because without it the spans
            //divition (when the user separate a word inside the spans the span will
            //break in two diferent spans) will happend after the function was executed
            //which wont allow the creation of span divition.
            window.setTimeout(function(){
                //get the text of the span over which the caret is and split it around the spaces
                var thisContentWords = getSelectionStart().innerHTML.split(" ");
                var currentSpan = getSelectionStart();  //the the span over which the caret is
                //var editorChilds = Array.prototype.slice.call(d.childNodes);
                //calls indexOf array function over the d.childNodes NodeLIst to get the index of the current span
                var wordIndex = Array.prototype.indexOf.call(d.childNodes,getSelectionStart());
                //since the user press the space bar in some place of the current span, the current span
                //now has two words. the current span will get the first part of the text and the newSpan
                //will take the second part of the text
                currentSpan.innerHTML = thisContentWords[0]+" ";
                newSpan.innerHTML = thisContentWords[1] + " ";
                //the newSpan will be inserted before the element that has the caret on it
                //at this point will be good to remember that the last element of the div will
                //always be a textNode.
                d.insertBefore(newSpan,d.childNodes[(Array.prototype.indexOf.call(d.childNodes,getSelectionStart())) + 1]);
                //alert("current: "+currentSpan.innerHTML);
                //alert("writing: "+writing);
                //alert("writing: "+writing.length);
                //alert("writingCopy: "+writingCopy);
                //alert("writingCopyleng: "+writingCopy.length);
                //alert("newSpan: "+newSpan.innerHTML);
                //alert("".length);

                if (writingCopy.length === 1)
                    window.getSelection().collapse(currentSpan, currentSpan.innerHTML.length - 1);
                else{
                    window.getSelection().collapse(newSpan, newSpan.innerHTML.length -1);
                    writingCopy = "";
                }
            },100);
        }
        writing = ""; //cleans the writing variable.
       }
        //alert(document.body.innerHTML);
        //alert("Cono pero porque no te imprimes");
    });
}
