//JLF: Variable que contiene todos los valores para incluir en el tip file
var states = [];
// Guardamos la posicion para anyadir id's
var pos = 1;
var currentState = 0;
var newState;
var role;
var finalModel;
var currentModel;

$(document).ready(function() {
	// hackWebGLKeyboard();
	cleanHandleStatePanel();
	$("#handlerStates").hide();
	role = getUrlVars()["role"];
	if (role == "teacher") {
		$("#saveInterpreter").show();
		$("#loadInterpreter").hide();
		$("#exercisePrompt").hide();
	} else {
		$("#handlerStates").hide();
		$("#taskFiller").hide();
		$("#lista").hide();
		$("#saveInterpreter").hide();
		$("#new").hide();
		$("#loadInterpreter").show();
	}
	var control = document.getElementById("fileLoader");
	control.addEventListener("change", function(event) {
	  var f = event.target.files[0];
		if (!f) {
			alert("Failed to load file");
		} else if (f.name.split('.').pop().toLowerCase() != 'tip') {
				alert(f.name + " is not a valid text file");
		} else {
		  var r = new FileReader();
		  r.onload = function(e) {
			 var contents = e.target.result;
			 console.log(contents);
			 states = JSON.parse(contents);
			 Alert.render("Support started");
			 $("#task1").html(states.tdescription);
			 var support= new Support(states.tip[0].rules,1);
			 setInterval(function(){support.startSupport()},5000);
		  }
		  r.readAsText(f);
		}

	}, false);

	control.addEventListener('click', function() {
	    this.value = '';
	}, false);

});

function hackWebGLKeyboard() {
	for ( var i in JSEvents.eventHandlers) {
		var event = JSEvents.eventHandlers[i];
		if (event.eventTypeString == 'keydown'
				|| event.eventTypeString == 'keypress'
				|| event.eventTypeString == 'keyup') {
			window.removeEventListener(event.eventTypeString,
					event.eventListenerFunc, event.useCapture);
		}
	}
}

function loadStatesInterpreter() {
    var r = confirm("Are you sure you want to do it?");
    if (r == true) {
        openfileDialog();
    }
}

//JLF:Clean the planel of states
function cleanHandleStatePanel() {
	$("#headModal").html("");
	$("#is").val("");
	$("#ig").val("");
	$("#idi").val("");
	$("#cb1").prop('checked', false);
	$("#cb2").prop('checked', false);
	$("#cb3").prop('checked', false);
	$("#cbState").prop('checked', false);
}

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});

//This creates a new state inside the tree of states
function handleNewTask(model) { 
	//var r = confirm("Do you want to create a new state?");
	//if (r == true) {
	finalModel=model;
	newState = true;
	SendMessage("Interface", "CleanWorkspaceByBrowser");
	GenerateState();
	confirmState();
	cleanHandleStatePanel();
	//}
}

function saveModel(model){
	finalModel=model;
}	


function confirmState() {
	hackWebGLKeyboard();
	pos++;
}

function activateHandlerStatesPanel(enable){
	if (enable){
		$("#handlerStates").show();
	} else {
		$("#handlerStates").hide();
	}
	
}


//JLF: This function shows in the right panel the guidance values
function handleState(e) {
	currentState = e;
	var po = e - 1;
	var aux = states[po];
	$("#headModal").html("State " + e);
	$("#is").val(aux.socratic);
	$("#ig").val(aux.guidance);
	$("#idi").val(aux.didactic);
	$("#cb1").prop('checked', aux.exact);
	//$("#cb2").prop('checked', aux.include);
	//$("#cb3").prop('checked', aux.sbu);
	$("#cbState").prop('checked', aux.fState);
	LoadState(po);
}

//JLF: Save the current state
function saveButtonHandler() {
	if (currentState > 0) {
		newState = false;
		var po = currentState - 1;
		states[po].socratic = $("#is").val();
		states[po].guidance = $("#ig").val();
		states[po].didactic = $("#idi").val();
		states[po].exact = $("#cb1").prop('checked');
		//states[po].include = $("#cb2").prop('checked');
		//states[po].sbu = $("#cb3").prop('checked');
		states[po].fState = $("#cbState").prop('checked');

		for (var i=0; i<finalModel.tip.length; i++) {
			for (var j=0; j<finalModel.tip[i].rules.length; j++) {
				if (finalModel.tip[i].rules[0][j].id==currentState){
					finalModel.tip[i].rules[0][j].socratic = $("#is").val();
					finalModel.tip[i].rules[0][j].guidance = $("#ig").val();
					finalModel.tip[i].rules[0][j].didactic = $("#idi").val();
					finalModel.tip[i].rules[0][j].exact = $("#cb1").prop('checked');
					finalModel.tip[i].rules[0][j].fState = $("#cbState").prop('checked');
				}

			}	
		}
		GenerateState();
	}
}

//JLF: Call Fractions Lab to get the current state of the exercise
function GenerateState() {
	SendMessage("Interface", "SaveTaskTip");
}

//JLF: This function i called by unity when it has the values inside the exercise
function SaveBlob(jsonString) {
	if (role == "teacher") {
		if (newState == true) {
			var stApp = {
				type : "state",
				id : pos - 1,
				isValid: true,
				//st : jsonString,
				stObject : JSON.parse(jsonString),
				socratic : "",
				guidance : "",
				didactic : "",
				fState : false,
				exact : false
				//include : false,
				//sbu : false
			};
			states.push(stApp);
		} else {
			var po = currentState - 1;
			//states[po].st= jsonString;
			states[po].stObject= JSON.parse(jsonString);
			for (var i=0; i<finalModel.tip.length; i++) {
				for (var j=0; j<finalModel.tip[i].rules.length; j++) {
					if (finalModel.tip[i].rules[0][j].id==currentState){
						finalModel.tip[i].rules[0][j].stObject= JSON.parse(jsonString);
					}

				}	
			}
		}
	} else {
		currentModel=JSON.parse(jsonString);
	}
}

function getSelectedState(pos){
	return states[pos-1];
}

//This cleans the whole workspace to re-generate the states tree again
function ConfirmNewTask() {
	var isHome = false;
	var r = confirm("Are you sure you want to do it?");
	if (r == true) {
		SendMessage("Interface", "CleanWorkspaceByBrowser");
		cleanHandleStatePanel();
		$("#handlerStates").hide();
		states= [];
		pos = 1;
		currentState = 0;
//		No longer needed these lines with the new component
//		var clone = $("#fsChild").clone();
//		$("#lista").empty();
//		$("#lista").append(clone);
	}
}

function LoadState(p) {
	SendMessage("TaskManager", "LoadJsonString",JSON.stringify(states[p].stObject));
}

//JLF: Saves the tip file to use in student mode
function saveStatesInterpreter(){
	var task = {
				tname : $("#tName").val(),
				tdescription : $("#tDescription").val(),
				tip : finalModel.tip
			};
	//finalModel.unshift(task);	
	var myJsonString = JSON.stringify(task);
	var blob = new Blob([myJsonString]);
	  if(Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0){
			uriContent = "data:attachment/csv;charset=utf-8," + encodeURI(jsonString);
			var downloadLink = document.createElement("a");
			downloadLink.href = uriContent;
			downloadLink.download = "statesInterpreter.tip";
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
	  }
	  else
			saveAs(blob, "statesInterpreter.tip");
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}