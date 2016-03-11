function Support(st, rl) {
	
	this.states = st;
	this.rule=rl;
	this.previousModel;
}	
	
	Support.prototype.startSupport = function(){
		var points=this.calculatePoints();
		//alert(points.length);
		
		var tree = new kdTree(points, this.calculateDistance, ["state"]);
		
		var state=[];
		state.push({num:1, den:3}, {num:1, den:2});
		var nearest = tree.nearest({state}, points.length);
		//alert(nearest.toSource());
		
//		alert(test.toSource());
//		this.previousModel=currentModel;
//		GenerateState();
//		//alert(this.states.toSource());
//		if (currentModel.initial_model.length==this.rule) {
//			var distances=this.calculateEuclideanDistances(currentModel);
//			if (distances.length>0) {
//				this.getEuclideanSupport(distances);
//			}
//		}
	};
	
	//JLF: This algorithm only calcultates mathematical distances
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
	
	//JLF: Calculate the distances
//	 Example [[{num:1, den:3},{num:1, den:2}],
//	 [{num:1, den:2}, {num:1, den:3}], 
//	 [{num:5, den:8}, {num:6, den:3}], 
//	 [{num:6, den:3}, {num:5, den:8}]]
	Support.prototype.calculatePoints= function(){
		var allPoints =[];
		for(var i = 0; i < this.states[0].length; i++){
			var points =[];
			for (var k = 0; k < this.states[0][i].stObject.initial_model.length; k++){ //recorre todas las fracciones de un estado i
				var point = {
						num : this.states[0][i].stObject.initial_model[k].numerator,
						den : this.states[0][i].stObject.initial_model[k].denominator
				}
				points.push(point);
			}
			var result = [];
			permutate(points, function(a) {
				var state ={
						state : a.slice(0)
				};
				allPoints.push(state); //Guardamos un objeto con todas las posibles permutaciones de ese modelo
			});
		}
		return allPoints;
	};
	
	//Funcion para calcular la distancia entre a y b donde a y b tienen un 
	Support.prototype.calculateDistance= function(a, b){
		//alert(a.toSource()); //[{num:5, den:8}, {num:6, den:3}]
		//alert("A ="+a.toSource()+ " B ="+b.toSource()); //[{num:1, den:2}]
		var mean=0;
		//alert("tam="+a.state.length);
		for (var i = 0; i < a.state.length; i++){
			//alert("test1="+a.state[i].num);
			//alert("test2="+b.state[i].num);
			mean+=Math.sqrt(Math.pow(a.state[i].num - b.state[i].num, 2) +  Math.pow(a.state[i].den - b.state[i].den, 2));
			//alert(mean);
		}
		//alert(mean);
		return mean;
	}
	
	//JLF Get the final state of all states
	Support.prototype.getFinalState= function(){
		for (var j = 0; j < this.states[0][i].stObject.initial_model.length; j++){ //Comparamos cada estado con el del usuario
			if (this.states[0][i].fState == true)
				return i;
		}
	}
	
	
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
					Alert.render("The teacher should provide Guidance feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			} else if (this.previousModel.initial_model.length!=this.rule) {
				if (!this.isEmpty(this.states[0][sAux].didactic))
					Alert.render(this.states[0][sAux].didactic);
				else {
					Alert.render("The teacher should provide Didactic feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			} else {
				if (!this.isEmpty(this.states[0][sAux].socratic))
					Alert.render(this.states[0][sAux].socratic);
				else {
					Alert.render("The teacher should provide Socratic feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			}	
		}	
	};
	
	Support.prototype.isEmpty= function(str) {
		return (!str || 0 === str.length);
		
	}
	

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
