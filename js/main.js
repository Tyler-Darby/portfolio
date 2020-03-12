/**
 * Portfolio - main.js
 * by Tyler Darby
 * This file contains the core JavaScript code required to run
 * the portfolio site. Written with jQuery. 
 */

// Executing this AJAX request first to load values faster.
$.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
    var ip = data.geoplugin_request;
    var location = data.geoplugin_city + ", " + data.geoplugin_regionCode;
  
    $("#ip").text(ip);
    $("#location").text(location);
});

/* Global Variables */
var inputCount = 0;
var input = $("#clinput");

var commands = {
    view: function(text) {

    },
    help: function(text) {
        var str = "";
        helpText.forEach(element => {
            str += element[0] + " - " + element[1] + "<br>";
        });
        return str;
    },
    viewblog: function(text) {

    },
    email: function(text) {

    },
    secret: function(text) {

    },
    clear: function(text) {
        $("#cloutputcontainer").empty();
        return "";
    }
}

var helpText = [
    [
        "view <page>",
        "view the specified page's contents."
    ],
    [
        "help",
        "prints a list of available commands and their usage."
    ],
    [
        "viewblog",
        "redirects to the blog portion of the site."
    ],
    [
        "email",
        "opens an email to me in your default mail client."
    ],
    [
        "secret",
        "it's an easter egg! :)"
    ],
    [
        "clear",
        "clears the current output history on the screen."
    ]
];

/* Event Handlers */

input.focus();
window.addEventListener('focus', focusInput);

$(document).keypress(function(e){
    if (e.which == 13) {
        addInputLine(input.val());
        input.val('');
    }
});

var typerFinish = new Event('typerFinished');

/* Functions */

function addInputLine(text) {
    $("#cloutputcontainer").append('<p id="inputLine' + inputCount + '"><span class="braces">[</span><span class="uname">visitor</span>@<span class="hostname">tylerdarby.me</span><span class="braces">]</span>~$ </label>');
    $("#inputLine"+inputCount).append(text);
    $("#inputLine"+inputCount).css("word-wrap", "break-word");
    executeCommand(text, inputCount);
    inputCount++;
}

function focusInput() {
    input.focus();
}

function typeCommand(text) {
    var typerCount = 0;
    var interval = setInterval(function(){
        if (typerCount == text.length) {
            clearInterval(interval);
            addInputLine(text);
            input.val('');
            dispatchEvent(typerFinish);
            return;
        }
        var c = text.charAt(typerCount);
        input.val(input.val() + c);
        typerCount++;
    }, 50);
}

function executeCommand(text) {
    var cmd = text.substring(0,text.search(" "));
    var args = text.substring(text.search(" ")+1, text.length);
    if (text.search(" ") == -1) {
        cmd = text;
        args = "";
    }
    if (commands[cmd]) {
        var result = commands[cmd](args);
        $("#cloutputcontainer").append("<p class='cmdResult'>" + result + "</p>");
    } else {
        $("#cloutputcontainer").append("<p class='cmdResult'>Error: The specified command was not found.</p>");
    }
    window.scroll(0, $(document).height());
}

/* Initializer Scripts */

var initCommands = ["view about.txt", "view education.txt", "view projects.txt"];
// An event listener to know when a command is done executing.
var initCommandCounter = 0;
window.addEventListener('typerFinished', function() {
    // Have we executed all the loading commands?
    if (initCommandCounter == initCommands.length) {
        input.focus();
        return;
    }
    typeCommand(initCommands[initCommandCounter]);
    initCommandCounter++;
});
// Manually execute the first command. 
typeCommand("view welcome.txt");