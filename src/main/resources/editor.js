"use strict";
//get the caret position
function getSelectionStart() {
    var node = document.getSelection().anchorNode;
    return (node.nodeType == 3 ? node.parentNode : node);
}

//deletes the context menu from the DOM
function deleteContextMenu(){
    var parent = document.getElementById('editor');
    var child = document.getElementById('contextMenu');
    parent.removeChild(child);
}

function createContextMenu(menuElements,coordinates,aSpan){
    var menuContainer = document.createElement('nav');
    menuContainer.id = "contextMenu";
    var menu = document.createElement('ul');

    //Add elements to conext menu
    for(var menuElement of menuElements)
        //because of the problem of clojures and loops
        //see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Creating_closures_in_loops_A_common_mistake
        //a immediate function is used to correct it, so that when the user
        //clicks an option of the context menu the word is replaced correclty.
        (function(i){
            var element = document.createElement('li');
            element.innerHTML = menuElement;
            //add a click event to replace the word in the span with a word of the context menu
            element.onclick = function() {aSpan.innerHTML = i;deleteContextMenu();}
            menu.appendChild(element);
        }(menuElement));

    menuContainer.appendChild(menu);
    //set the position of the menu;
    menuContainer.style.left = coordinates.x + "px";
    menuContainer.style.top = coordinates.y + "px";

    return menuContainer;
}

window.onload = function(){
    //delete the context menu if the user clicks anywhere in the page
    window.onclick = function(){deleteContextMenu();}
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
            newSpan.onclick = function(evt){
                //checks if the contextMenu is active in the page if it is
                //this two line will delete it
                if (document.getElementById("contextMenu"))
                        deleteContextMenu();

                //add the context menu to the editor if the word is misspelled
                if (JSON.parse(checker.words())[this.innerHTML.replace(" ","")] === undefined){
                    //checker.suggestions returns the spell correction suggestions as a json array
                    var suggestions = checker.suggestions(this.innerHTML);
                    document.getElementById("editor").appendChild(createContextMenu(JSON.parse(suggestions),{x: evt.clientX, y: evt.clientY},this));
                }
                evt.stopPropagation();
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
                //division (when the user separate a word inside the spans the span will
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
    });
}
