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
            element.onclick = function() {aSpan.innerHTML = i+' ';deleteContextMenu();}
            menu.appendChild(element);
        }(menuElement));

    menuContainer.appendChild(menu);
    //set the position of the menu;
    menuContainer.style.left = coordinates.x + "px";
    menuContainer.style.top = coordinates.y + "px";

    return menuContainer;
}

function textWrapper(text){
    var newSpan = document.createElement('span');
    newSpan.innerHTML = text;
    //sets a click event in the new created span
    newSpan.onclick = function(evt){
        //checks if the contextMenu is active in the page if it is
        //this two line will delete it
        if (document.getElementById("contextMenu"))
            deleteContextMenu();

        //add the context menu to the editor if the word is misspelled
        if (JSON.parse(checker.words())[text.replace(" ","")] === undefined){
            //checker.suggestions returns the spell correction suggestions as a json array
            alert(text);
            var suggestions = checker.suggestions(text);
            alert(suggestions);
            alert(checker.words());
            document.getElementById("editor").appendChild(createContextMenu(JSON.parse(suggestions),{x: evt.clientX, y: evt.clientY},this));
        }
        evt.stopPropagation();
    }
    return newSpan;
}

function lastWordMeta(text, op){
    //return the last word in the text or the index of the last word depending
    //of the value of the op parameter if op = 1 then the last word will be
    //returned, if m is any other value then the index of the last word will
    //be returned.
    var index = 0;
    var space = 0;
    for(var i= text.length-1; i>=0; --i){
        if(text[i] == " " || text[i] == "\t"){
            space++;
            if(space == 1)
                break;
        }
        index = i;
    }
    return op==1 ? text.substring(index,text.length) : index;
}

function divideSpan(aSpanElement){
    //wrap the words of a span in spans and return the wrapped words as an array of spans
    var words = aSpanElement.innerText.split(" ");
    return [textWrapper(words[0]+" "),textWrapper(words[1]+ " ")];
}

function wordsInsertionAndCarretControlAtTail(editor, aWordString){
    //appends to the editor div what was the last word wrappen in a span
    editor.appendChild(textWrapper(aWordString));

    //get the position of the carrent
    //which at this point is right at
    //the end of the new created span
    var sel = window.getSelection();
    //move the caret position 1 character ahead of it current position
    sel.collapse(editor.lastChild, 1);
}

window.onload = function(){
    //delete the context menu if the user clicks anywhere in the page
    window.onclick = function(){deleteContextMenu();}
    //content editable div where the user writes
    var d = document.getElementById("editor");
    var writing =""; //to save the words the user writes
    d.addEventListener("keypress",function(evt){
        if(evt.which == 32){
            //gets the last word of the editor div
            var lastWord = lastWordMeta(d.innerText,1);

            //if the carret is over a span element when the user press space
            //there will be two words in the span and each word shoulbe in a
            //individual span, so here the script will wrapp each word in it's
            //own individual span, then it will remove the span that has the two
            //words and finilly it will add the new the words wrapped in spans elements
            if (getSelectionStart().nodeName == "SPAN"){
                window.setTimeout(function(){
                    //takes a reference of the current Span element
                    var currentSpan = getSelectionStart();
                    console.log(currentSpan);
                    //get the words wrapped in spans
                    var newWrappedSpans = divideSpan(currentSpan);
                    d.insertBefore(newWrappedSpans[0],currentSpan);
                    d.insertBefore(newWrappedSpans[1],currentSpan);
                    d.removeChild(currentSpan);

                },200);
            }

            //deletes the last word in the editor div
            //when the user stat writing the first element in the editor div
            //after the user press space of tab or enter will always be a textNode
            else if (d.lastChild.nodeType == 3){
                d.lastChild.textContent = "";
                wordsInsertionAndCarretControlAtTail(d,lastWord);
            }
            else{
                //after the first word the last word will be in the last added span
                d.lastChild.textContent = d.lastChild.textContent.split(' ')[0]+' ';
                wordsInsertionAndCarretControlAtTail(d,lastWord);
            }
        }
    });
}
