function Support(st, rl) {
	
	this.states = st;
	this.rule=rl;
	this.previousModel;
}	
	
	Support.prototype.startSupport = function(){
		this.previousModel=currentModel;
		GenerateState();
		//alert(this.states.toSource());
		if (currentModel.initial_model.length==this.rule) {
			var distances=this.calculateEuclideanDistances(currentModel);
			if (distances.length>0) {
				this.getEuclideanSupport(distances);
			}
		}
	};
	
	Support.prototype.calculateEuclideanDistancesBasedOnRule= function(cm) {
		var comparator=[];
		if (cm.initial_model.length==this.rule) {
			var distances=[];
			for(var k = 0; k < cm.initial_model.length; k++){
				var dist=[];
				for (var j = 0; j < this.states[0][j].stObject.initial_model.length; j++){ //Comparamos cada estado con el del usuario
					cmp=(cm.initial_model[k].numerator/cm.initial_model[k].denominator)-(this.states[0][j].stObject.initial_model[j].numerator/this.states[i].stObject.initial_model[j].denominator)
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
	
	Support.prototype.calculateEuclideanDistances= function(cm) {
		var comparator=[];
		//alert(this.states.tip[0].rules.toSource());
		//alert(cm.toSource());
		if (cm.initial_model.length==this.rule) {
			//alert(this.states[0].length);
			for(var i = 0; i < this.states[0].length; i++) {
				var distances=[];
				for(var k = 0; k < cm.initial_model.length; k++){
					var dist=[];
					for (var j = 0; j < this.states[0][i].stObject.initial_model.length; j++){ //Comparamos cada estado con el del usuario
						cmp=(cm.initial_model[k].numerator/cm.initial_model[k].denominator)-(this.states[0][i].stObject.initial_model[j].numerator/this.states[0][i].stObject.initial_model[j].denominator)
						dist.push(cmp);
					}
					distances.push(this.averageDistances(dist));
				}
				if (distances.length > 0) {
					var distFinal={
							state : i,
							distance: distances
						};
					comparator.push(distFinal);
				}
			}
		}
		return comparator;
	};
	
	Support.prototype.getEuclideanSupport= function(dt) {
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
			if (this.states[0][sAux].fState==true && fin==0) { //At the moment only shows the final exact state
				if (!this.isEmpty(this.states[0][sAux].socratic))
					Alert.render(this.states[0][sAux].socratic);
				else {
					Alert.render("Well done! You finished the exercise");
				}
			} else if (fin == 0){
				if (!this.isEmpty(this.states[0][sAux].guidance))
					Alert.render(this.states[0][sAux].guidance);
				else {
					Alert.render("The teacher should provide Guidance feedback for: state "+ sAux+" in rule"+ this.rule);
				}
			} else if (this.previousModel.initial_model.length!=this.rule) {
				if (!this.isEmpty(this.states[0][sAux].didactic))
					Alert.render(this.states[0][sAux].didactic);
				else {
					Alert.render("The teacher should provide Didactic feedbackfor: state "+ sAux+" in rule"+ this.rule);
				}
			} else {
				if (!this.isEmpty(this.states[0][sAux].socratic))
					Alert.render(this.states[0][sAux].socratic);
				else {
					Alert.render("The teacher should provide Socratic feedbackfor: state "+ sAux+" in rule"+ this.rule);
				}
			}	
		}	
	};
	
	Support.prototype.isEmpty= function(str) {
		return (!str || 0 === str.length);
		
	}
	
		//Calculate Hamming distance using 2 strings
	Support.prototype.naiveHammerDistance= function(str1, str2) {
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

	Support.prototype.getSupportKNear= function(){
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


	Support.prototype.generateVectorForKNearCalculation= function(model){
		var vector=[];
		for(var i = 0; i < model.length; i++){
			vector.push(model[i].numerator);
			vector.push(model[i].denominator);
		}
		return vector;
	};

	Support.prototype.calculateHammingDistance= function(cm){
	};

	Support.prototype.calculateJaccardDistance= function(cm){
	};

	Support.prototype.calculateMinor= function(ds) {
		var fDistance=10000;
		for(var i = 0; i < ds.length; i++){
			if (Math.abs(fDistance)>Math.abs(ds[i])){
				fDistance=ds[i];
			}
		}
		return fDistance;
	};

	Support.prototype.averageDistances= function(ds) {
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
