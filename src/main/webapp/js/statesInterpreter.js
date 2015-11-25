var states = [];
var pos = 1;
var currentState = 0;
var newState;
var role;
var currentModel;

$(document).ready(function() {
	// hackWebGLKeyboard();
	cleanHandleStatePanel();
	$("#handlerStates").hide();
	role = getUrlVars()["role"];
	if (role == "teacher") {
		$("#saveInterpreter").show();
		$("#loadInterpreter").hide();
	} else {
		$("#handlerStates").hide();
		$("#lista").hide();
		$("#saveInterpreter").hide();
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
			 alert("File parsed correctly");
			 //setInterval(function(){getSupport()},5000);
			 setInterval(function(){getSupportKNear()},5000);
		  }
		  r.readAsText(f);
		}

	}, false);

	control.addEventListener('click', function() {
	    this.value = '';
	}, false);

});

function removeButtonHandler() {
	if (currentState > 0) {
		$("#st" + currentState).remove();
		cleanHandleStatePanel();
		var po = currentState - 1;
		states[po].isValid=false;
	}
}

function saveButtonHandler() {
	if (currentState > 0) {
		newState = false;
		var po = currentState - 1;
		states[po].socratic = $("#is").val();
		states[po].guidance = $("#ig").val();
		states[po].didactic = $("#idi").val();
		states[po].exact = $("#cb1").prop('checked');
		states[po].include = $("#cb2").prop('checked');
		states[po].sbu = $("#cb3").prop('checked');
		states[po].fState = $("#cbState").prop('checked');
		GenerateState();
	}
}

function makeAlert(text){
	if (typeof text != 'undefined') {
		alert(text);
	}
}

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

function handleNewTask() { 
	var txt;
	var r = confirm("Do you want to create a new state?");
	if (r == true) {
		newState = true;
		SendMessage("Interface", "CleanWorkspaceByBrowser");
		GenerateState();
		confirmState();
		cleanHandleStatePanel();
	}
}	


function confirmState() {
	hackWebGLKeyboard();
	var state = {
		type : "Init State",
		st : [],
		feedback : []
	};
	var clone = $("#stateModal").clone();
	clone.attr('id', pos);
	$("#modals").append(clone);
	$("#" + pos + " #headModal").html("State " + pos);
	$("ol").append(
			"<li><a id='st" + pos + "' href='javascript:handleState(" + pos
					+ ");' class='customfont' style='display: initial;'" + pos
					+ "'>State " + pos + "</a></li>");
	pos++;
	$("#handlerStates").show();
}

function handleState(e) {
	currentState = e;
	var po = e - 1;
	var aux = states[po];
	$("#headModal").html("State " + e);
	$("#is").val(aux.socratic);
	$("#ig").val(aux.guidance);
	$("#idi").val(aux.didactic);
	$("#cb1").prop('checked', aux.exact);
	$("#cb2").prop('checked', aux.include);
	$("#cb3").prop('checked', aux.sbu);
	$("#cbState").prop('checked', aux.fState);
	LoadState(po);
}

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

function GenerateState() {
	SendMessage("Interface", "SaveTaskTip");
}

function SaveBlob(jsonString) {
	if (role == "teacher") {
		if (newState == true) {
			var stApp = {
				id : pos - 1,
				isValid: true,
				st : jsonString,
				stObject : JSON.parse(jsonString),
				socratic : "",
				guidance : "",
				didactic : "",
				fState : false,
				exact : false,
				include : false,
				sbu : false
			};
			states.push(stApp);
		} else {
			var po = currentState - 1;
			states[po].st= jsonString;
			states[po].stObject= JSON.parse(jsonString);
		}
	} else {
		currentModel=JSON.parse(jsonString);
	}
}

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
		var clone = $("#fsChild").clone();
		$("#lista").empty();
		$("#lista").append(clone);
	}
}

function LoadState(p) {
	SendMessage("TaskManager", "LoadJsonString", states[p].st);
}

function saveStatesInterpreter(){
	var myJsonString = JSON.stringify(states);
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

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function loadStatesInterpreter() {
    var r = confirm("Are you sure you want to do it?");
    if (r == true) {
        openfileDialog();
    }
}

function getSupport(){
	GenerateState();
	var distances=calculateEuclideanDistances(currentModel);
	if (distances.length>0) {
		getEuclideanSupport(distances);
	}
}

//Calculate Hamming distance using 2 strings
function naiveHammerDistance(str1, str2) {
    var dist = 0;
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();
     for(var i = 0; i < str1.length; i++) {
        if(str2[i] && str2[i] !== str1[i]) {
            dist += Math.abs(str1.charCodeAt(i) - str2.charCodeAt(i)) + Math.abs(str2.indexOf( str1[i] )) * 2;
        } 
        else if(!str2[i]) {
            //  If there's no letter in the comparing string
            dist += dist;
        }
    }
    return dist;
}

function getSupportKNear(){
	GenerateState();
	//var generator = require('knear'); 
	var machines =[];
	for(var i = 0; i < states.length; i++){
		for(var j = 0; j < states[i].stObject.initial_model.length; j++){
			var positions=(states[i].stObject.initial_model.length*2);
			if (machines[i]==null) { //JLF: Only checking numerators an denominators
				var machine = new generator.kNear(positions);
				machine.learn(generateVectorForKNearCalculation(states[i].stObject.initial_model), i);
				machines[i]=machine;
			}
			else {
				machines[i].learn(generateVectorForKNearCalculation(states[i].stObject.initial_model), i);
			}
		}		
	}
	machines[currentModel.initial_model.length].classify(generateVectorForKNearCalculation(currentModel.initial_model));
}


function generateVectorForKNearCalculation(model){
	var vector=[];
	for(var i = 0; i < model.length; i++){
		vector.push(model[i].numerator);
		vector.push(model[i].denominator);
	}
	return vector;
}

function calculateEuclideanDistances(cm){
	var comparator=[];
	for(var i = 0; i < states.length; i++){
		var distances=[];
		for(var k = 0; k < cm.initial_model.length; k++){
			var dist=[];
			for(var j = 0; j < states[i].stObject.initial_model.length; j++){ //Comparamos cada estado con el del usuario
				cmp=(cm.initial_model[k].numerator/cm.initial_model[k].denominator)-(states[i].stObject.initial_model[j].numerator/states[i].stObject.initial_model[j].denominator)
				dist.push(cmp);
			}
			distances.push(averageDistances(dist));
		}
		if (distances.length > 0) {
			var distFinal={
					state : i,
					distance: distances
				};
			comparator.push(distFinal);
		}
	}
	return comparator;
}

function getEuclideanSupport(dt) {
	var fin=10000;
	var sAux;
	for(var i = 0; i < dt.length; i++){
		var global=0;
		for (var j = 0; j < dt[i].distance.length; j++){
			global+=dt[i].distance[j];
		}
		console.log("State="+ i + " -- Distance="+ Math.abs(global));
		if (fin>Math.abs(global)){
			fin=Math.abs(global);
			sAux=i;
		}
	}
	if (sAux !=null){ //Devuelve el socratic feedback del estado mas cercano
		if (states[sAux].fState==true && fin==0) { //At the moment only shows the final exact state
			alert(states[sAux].socratic);
		}	
	}	
}

function calculateHammingDistance(cm){
}

function calculateJaccardDistance(cm){
}

function calculateMinor(ds) {
	var fDistance=10000;
	for(var i = 0; i < ds.length; i++){
		if (Math.abs(fDistance)>Math.abs(ds[i])){
			fDistance=ds[i];
		}
	}
	return fDistance;
}

function averageDistances(ds) {
	var avDistance=0;
	var cont=0;
	for(var i = 0; i < ds.length; i++){
		avDistance=avDistance+ds[i];
		cont++;
	}
	if (cont>0)
		return avDistance/cont;
	else 
		return null;
}

