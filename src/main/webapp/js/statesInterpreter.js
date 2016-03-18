//JLF: Variable que contiene todos los valores para incluir en el tip file
var states = [];
var rules=[];
// Guardamos la posicion para anyadir id's
var pos = 1;
var posRule = 1;
var currentState = 0;
var currentRule = 0;
var newState;
var newRule;
var role;
var finalModel;
var currentModel;
var teacherHelp=false;

$(document).ready(function() {
	// hackWebGLKeyboard();
	cleanHandleStatePanel();
	$("#handlerStates").hide();
	role = getUrlVars()["role"];
	if (role == "teacher") {
		$("#saveInterpreter").show();
		$("#loadInterpreter").hide();
		$("#exercisePrompt").hide();
		$("#taskFiller").hide();
		$("#distancePanel").hide();
	} else if (role == "student"){
		$("#handlerStates").hide();
		$("#taskFiller").hide();
		$("#distancePanel").hide();
		$("#lista").hide();
		$("#saveInterpreter").hide();
		$("#new").hide();
		$("#loadInterpreter").show();
	} else if (role == "tdebug"){
		var teacherHelp=true;	
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
			 var allSupport=[];
			 for(var i = 0; i < states.tip.length; i++) {
				 allSupport[i]=new Support(states.tip[i].rules,i+1,states.tip[i].maxDistance);
				 allSupport[i].startSupport();
			 }
			 //JLF:Fix this patch
			 if (allSupport.length==1){
				 setInterval(function(){allSupport[0].getSupport()},5000);
			 } else if (allSupport.length==2){
				 setInterval(function(){allSupport[0].getSupport()},5000);
				 setInterval(function(){allSupport[1].getSupport()},5000);
			 } else if (allSupport.length==3){
				 setInterval(function(){allSupport[0].getSupport()},5000);
				 setInterval(function(){allSupport[1].getSupport()},5000);
				 setInterval(function(){allSupport[2].getSupport()},5000);
			 } else if (allSupport.length==4){
				 setInterval(function(){allSupport[0].getSupport()},5000);
				 setInterval(function(){allSupport[1].getSupport()},5000);
				 setInterval(function(){allSupport[2].getSupport()},5000);
				 setInterval(function(){allSupport[3].getSupport()},5000);
			 } else if (allSupport.length==5){
				 setInterval(function(){allSupport[0].getSupport()},5000);
				 setInterval(function(){allSupport[1].getSupport()},5000);
				 setInterval(function(){allSupport[2].getSupport()},5000);
				 setInterval(function(){allSupport[3].getSupport()},5000);
				 setInterval(function(){allSupport[4].getSupport()},5000);
			 } else if (allSupport.length==6){
				 setInterval(function(){allSupport[0].getSupport()},5000);
				 setInterval(function(){allSupport[1].getSupport()},5000);
				 setInterval(function(){allSupport[2].getSupport()},5000);
				 setInterval(function(){allSupport[3].getSupport()},5000);
				 setInterval(function(){allSupport[4].getSupport()},5000);
				 setInterval(function(){allSupport[5].getSupport()},5000);
			 }
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

function cleanHandleRulePanel() {
	$("#headModalRule").html("");
	$("#mDistance").val("");
}

$("#menu-toggle").click(function(e) {
	e.preventDefault();
	$("#wrapper").toggleClass("toggled");
});

//This creates a new state inside the tree of states
function handleNewTask(model) { 
	finalModel=model;
	newState = true;
	SendMessage("Interface", "CleanWorkspaceByBrowser");
	GenerateState();
	confirmState();
	cleanHandleStatePanel();
}

function handleNewRule(model) { 
	//finalModel=model;
	newRule = true;
	SendMessage("Interface", "CleanWorkspaceByBrowser");
	confirmRule();
	LoadRule();
	cleanHandleRulePanel();
}

function saveModel(model){
	finalModel=model;
}	


function confirmState() {
	$("#taskFiller").show();
	hackWebGLKeyboard();
	pos++;
}

function confirmRule() {
	$("#taskFiller").show();
	hackWebGLKeyboard();
	posRule++;
}

function activateHandlerStatesPanel(enable){
	if (enable){
		$("#handlerStates").show();
		$("#distancePanel").hide();
	
	} else {
		$("#handlerStates").hide();
		$("#distancePanel").show();
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
	$("#cbFinal").prop('checked', aux.end);
	LoadState(po);
}

function handleRule(e) {
	currentRule = e;
	var po = e - 1;
	var aux = rules[po];
	$("#headModalRule").html("Rule " + e);
	$("#mDistance").val(aux.maxDistance);
	SendMessage("Interface", "CleanWorkspaceByBrowser");
	LoadRule(po);
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
		states[po].end = $("#cbFinal").prop('checked');

		for (var i=0; i<finalModel.tip.length; i++) {
			for (var j=0; j<finalModel.tip[i].rules.length; j++) {
				if (finalModel.tip[i].rules[0][j].id==currentState){
					finalModel.tip[i].rules[0][j].socratic = $("#is").val();
					finalModel.tip[i].rules[0][j].guidance = $("#ig").val();
					finalModel.tip[i].rules[0][j].didactic = $("#idi").val();
					finalModel.tip[i].rules[0][j].exact = $("#cb1").prop('checked');
					finalModel.tip[i].rules[0][j].fState = $("#cbState").prop('checked');
					finalModel.tip[i].rules[0][j].end = $("#cbFinal").prop('checked');
				}

			}	
		}
		GenerateState();
	}
}

//JLF: Save the current state
function saveButtonHandlerDistance() {
	if (currentRule > 0 && finalModel != null && isInt($("#mDistance").val())) { //Indica que por lo menos hay un estado
		newRule = false;
		var po = currentRule - 1;
		rules[po].maxDistance = $("#mDistance").val();
		for (var i=0; i<finalModel.tip.length; i++) {
			if (finalModel.tip[i].id==currentRule){
				finalModel.tip[i].maxDistance = $("#mDistance").val();
			}

		}
	} else {
		Alert.render("You have to introduce an integer");
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
				exact : false,
				end : false
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

function LoadRule(jsonString) {
	if (role == "teacher") {
		if (newRule == true) {
			var rlApp = {
				type : "rule",
				id : posRule - 1,
				maxDistance : 2
			};
			rules.push(rlApp);
		} else {
			var po = currentRule - 1;
			for (var i=0; i<finalModel.tip.length; i++) {
				if (finalModel.tip[i].id==currentRule){
					finalModel.tip[i].maxDistance= $("#mDistance").val();
				}
			}
		}
	} 
}

function getSelectedState(pos){
	return states[pos-1];
}

function getSelectedRule(pos){
	return rules[pos-1];
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
		rules=[];
		pos = 1;
		currentState = 0;
		currentRule = 0;
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
	if ($("#tName").val().length>0 && $("#tDescription").val().length>0) {
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
	} else {
		Alert.render("Task name and task description cannot be empty");
	}
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

function isInt(value) {
	  return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}