/**
 * Portfolio - main.js
 * by Tyler Darby
 * This file contains the core JavaScript code required to run
 * the portfolio site. Written with jQuery. 
 */

// Executing this AJAX request first to load values faster.
$.getJSON('https://ipapi.co/json/', function(data) {
    var ip = data.ip;
    var location = data.region + ", " + data.region_code;
  
    $("#ip").text(ip);
    $("#location").text(location);
});

/* Global Variables */
var inputCount = 0;
var input = $("#clinput");

/**
 * This object contains the code for the various commands that can
 * be called from the main page.
 */
var commands = {
    viewpage: function(text) {
        $.ajax({
            url: "pages/" + text,
            dataType: 'text',
            method: 'GET',
            success: function(res) {
                if (res == "") {
                    $("#cloutputcontainer").append("<p class='cmdResult'>Error: The page you have requested cannot be found!</p>");
                } else {
                    $("#cloutputcontainer").append("<p class='cmdResult'>" + res + "</p>");
                }
            },
            error: function() {
                $("#cloutputcontainer").append("<p class='cmdResult'>Error: The page you have requested cannot be found!</p>");
            }
        });
        return "";
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
    },
    listpages: function(text) {

    }
}

var helpText = [
    [
        "clear",
        "clears the current output history on the screen."
    ],
    [
        "email",
        "opens an email to me in your default mail client."
    ],
    [
        "help",
        "prints a list of available commands and their usage."
    ],
    [
        "listpages",
        "prints a list of available pages."
    ],
    [
        "secret",
        "it's an easter egg! :)"
    ],
    [
        "viewblog",
        "redirects to the blog portion of the site."
    ],
    [
        "viewpage <page>",
        "view the specified page's contents."
    ]
];

/* Event Handlers */

input.focus();
window.addEventListener('focus', focusInput);
window.addEventListener('click', focusInput);

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
    window.scrollTo(0,document.body.scrollHeight);
    inputCount++;
}

function focusInput() {
    input.focus();
    window.scrollTo(0,document.body.scrollHeight);
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
        // Handle commands that produce their own output vs commands that rely on
        // executeCommand() to handle the output of the result.
        if (result != "") {
            $("#cloutputcontainer").append("<p class='cmdResult'>" + result + "</p>");
        }
    } else {
        $("#cloutputcontainer").append("<p class='cmdResult'>Error: The specified command was not found.</p>");
    }
    
}

/* Initializer Scripts */

var initCommands = ["viewpage about.html", "viewpage experience.html", "viewpage projects.html"];
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
typeCommand("viewpage welcome.html");