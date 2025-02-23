/**
 * Portfolio - main.js
 * by Tyler Darby
 * This file contains the core JavaScript code required to run
 * the portfolio site.
 */

// Executing this AJAX request first to load values faster.
fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
        var ip = data.ip;
        var location = data.region + ", " + data.region_code;

        document.getElementById("ip").textContent = ip;
        document.getElementById("location").textContent = location;
    });

/* Global Variables */
var inputCount = 0;
var input = document.getElementById("clinput");

/**
 * This object contains the code for the various commands that can
 * be called from the main page.
 */
var commands = {
    viewpage: function(text) {
        fetch("pages/" + text)
            .then(response => response.text())
            .then(res => {
                if (res == "") {
                    document.getElementById("cloutputcontainer").innerHTML += "<p class='cmdResult'>Error: The page you have requested cannot be found!</p>";
                } else {
                    document.getElementById("cloutputcontainer").innerHTML += "<p class='cmdResult'>" + res + "</p>";
                }
            })
            .catch(() => {
                document.getElementById("cloutputcontainer").innerHTML += "<p class='cmdResult'>Error: The page you have requested cannot be found!</p>";
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
        return "Still on the to-do list!";
    },
    email: function(text) {
        window.location.href = "mailto:tyler@tylerdarby.me";
        return "Opening email client...";
    },
    secret: function(text) {
        return "You found the easter egg! 🥚";
    },
    clear: function(text) {
        document.getElementById("cloutputcontainer").innerHTML = "";
        return "";
    },
    listpages: function(text) {
        var str = "";
        pageList.forEach(element => {
            str += "<b>" + element[0] + "</b> - " + element[1] + "<br>";
        });
        return str;
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
        "viewblog",
        "redirects to the blog portion of the site."
    ],
    [
        "viewpage <page>",
        "view the specified page's contents."
    ]
];

var pageList = [
    [
        "about.html",
        ""
    ],
    [
        "experience.html",
        ""
    ],
    [
        "projects.html",
        ""
    ],
    [
        "welcome.html",
        ""
    ]
]

/* Event Handlers */

input.focus();
window.addEventListener('focus', focusInput);
window.addEventListener('click', focusInput);

document.addEventListener('keypress', function(e){
    if (e.which == 13) {
        addInputLine(input.value);
        input.value = '';
    }
});

var typerFinish = new Event('typerFinished');

/* Functions */

function addInputLine(text) {
    var cloutputcontainer = document.getElementById("cloutputcontainer");
    cloutputcontainer.innerHTML += '<p id="inputLine' + inputCount + '"><span class="braces">[</span><span class="uname">visitor</span>@<span class="hostname">tylerdarby.me</span><span class="braces">]</span>~$ </label>';
    document.getElementById("inputLine" + inputCount).innerHTML += text;
    document.getElementById("inputLine" + inputCount).style.wordWrap = "break-word";
    executeCommand(text, inputCount);
    window.scrollTo(0, document.body.scrollHeight);
    inputCount++;
}

function focusInput() {
    input.focus();
    window.scrollTo(0, document.body.scrollHeight);
}

function typeCommand(text) {
    var typerCount = 0;
    var interval = setInterval(function(){
        if (typerCount == text.length) {
            clearInterval(interval);
            addInputLine(text);
            input.value = '';
            dispatchEvent(typerFinish);
            return;
        }
        var c = text.charAt(typerCount);
        input.value += c;
        typerCount++;
    }, 50);
}

function executeCommand(text) {
    var cmd = text.substring(0, text.search(" "));
    var args = text.substring(text.search(" ") + 1, text.length);
    if (text.search(" ") == -1) {
        cmd = text;
        args = "";
    }
    if (commands[cmd]) {
        var result = commands[cmd](args);
        // Handle commands that produce their own output vs commands that rely on
        // executeCommand() to handle the output of the result.
        if (result != "") {
            document.getElementById("cloutputcontainer").innerHTML += "<p class='cmdResult'>" + result + "</p>";
        }
    } else {
        document.getElementById("cloutputcontainer").innerHTML += "<p class='cmdResult'>Error: The specified command was not found.</p>";
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