//JLF: This will create special support for each rule
function ExtendedSupport(st, rl, ex) {
	Support.call(this, st, rl);
	this.extended=ex;
}

ExtendedSupport.prototype = Object.create(Support.prototype);

ExtendedSupport.prototype.constructor = ExtendedSupport;

//Calculate Hamming distance using 2 strings
ExtendedSupport.prototype.naiveHammerDistance= function(str1, str2) {
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
};

ExtendedSupport.prototype.getSupportKNear= function(){
	GenerateState();
	//var generator = require('knear'); 
	var machines =[];
	for(var i = 0; i < this.states.length; i++){
		for(var j = 0; j < this.states[i].stObject.initial_model.length; j++){
			var positions=(this.states[i].stObject.initial_model.length*2);
			if (machines[i]==null) { //JLF: Only checking numerators an denominators
				var machine = new generator.kNear(positions);
				machine.learn(generateVectorForKNearCalculation(this.states[i].stObject.initial_model), i);
				machines[i]=machine;
			}
			else {
				machines[i].learn(generateVectorForKNearCalculation(this.states[i].stObject.initial_model), i);
			}
		}		
	}
	machines[currentModel.initial_model.length].classify(generateVectorForKNearCalculation(currentModel.initial_model));
};


ExtendedSupport.prototype.generateVectorForKNearCalculation= function(model){
	var vector=[];
	for(var i = 0; i < model.length; i++){
		vector.push(model[i].numerator);
		vector.push(model[i].denominator);
	}
	return vector;
};

ExtendedSupport.prototype.calculateHammingDistance= function(cm){
};

ExtendedSupport.prototype.calculateJaccardDistance= function(cm){
};

ExtendedSupport.prototype.averageDistances= function(){
};

ExtendedSupport.prototype.calculateMinor= function(ds) {
	var fDistance=10000;
	for(var i = 0; i < ds.length; i++){
		if (Math.abs(fDistance)>Math.abs(ds[i])){
			fDistance=ds[i];
		}
	}
	return fDistance;
};