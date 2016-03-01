function Support(st){
	
	var sp = this;
	this.states = st;
	
	this.startSupport = function(){
		GenerateState();
		//alert(sp.states.toSource());
		var distances=sp.calculateEuclideanDistances(currentModel);
		if (distances.length>0) {
			sp.getEuclideanSupport(distances);
		}
	};
	
	this.getEuclideanSupport= function(dt) {
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
			if (sp.states[sAux].fState==true && fin==0) { //At the moment only shows the final exact state
				Alert.render(sp.states[sAux].socratic);
			}	
		}	
	};
	
		//Calculate Hamming distance using 2 strings
	this.naiveHammerDistance= function(str1, str2) {
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

	this.getSupportKNear= function(){
		GenerateState();
		//var generator = require('knear'); 
		var machines =[];
		for(var i = 0; i < sp.states.length; i++){
			for(var j = 0; j < sp.states[i].stObject.initial_model.length; j++){
				var positions=(sp.states[i].stObject.initial_model.length*2);
				if (machines[i]==null) { //JLF: Only checking numerators an denominators
					var machine = new generator.kNear(positions);
					machine.learn(generateVectorForKNearCalculation(sp.states[i].stObject.initial_model), i);
					machines[i]=machine;
				}
				else {
					machines[i].learn(generateVectorForKNearCalculation(sp.states[i].stObject.initial_model), i);
				}
			}		
		}
		machines[currentModel.initial_model.length].classify(generateVectorForKNearCalculation(currentModel.initial_model));
	};


	this.generateVectorForKNearCalculation= function(model){
		var vector=[];
		for(var i = 0; i < model.length; i++){
			vector.push(model[i].numerator);
			vector.push(model[i].denominator);
		}
		return vector;
	};

	this.calculateEuclideanDistances= function(cm){
		var comparator=[];
		for(var i = 0; i < sp.states.length; i++){
			var distances=[];
			for(var k = 0; k < cm.initial_model.length; k++){
				var dist=[];
				for(var j = 0; j < sp.states[i].stObject.initial_model.length; j++){ //Comparamos cada estado con el del usuario
					cmp=(cm.initial_model[k].numerator/cm.initial_model[k].denominator)-(sp.states[i].stObject.initial_model[j].numerator/sp.states[i].stObject.initial_model[j].denominator)
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
	};
	
	this.calculateHammingDistance= function(cm){
	};

	this.calculateJaccardDistance= function(cm){
	};

	this.calculateMinor= function(ds) {
		var fDistance=10000;
		for(var i = 0; i < ds.length; i++){
			if (Math.abs(fDistance)>Math.abs(ds[i])){
				fDistance=ds[i];
			}
		}
		return fDistance;
	};

	this.averageDistances= function(ds) {
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
	};

}