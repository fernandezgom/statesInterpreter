function Support(st, rl) {
	
	this.states = st;
	this.rule=rl;
	this.previousModel;
	this.points;
	this.tree;
	this.equivalent=false;
}	
	
	Support.prototype.startSupport = function(){
		this.points=this.calculatePoints();
		this.tree = new kdTree(this.points, this.calculateDistanceUsingWeights, ["state"]);
//		var state=[];
//		state.push({pos: -1, num:1, den:3}, {pos: -1, num:1, den:2});
		//var nearest = tree.getFinal({state}, points.length); // Obtiene el estado mas cercano al estado actual del ejercicio
		var fs=this.getFinalStates();
		//var nearFinal = tree.getFinal({fs}, points.length); 
		
//		alert(nearest.toSource());
		//alert("Estado mas cercano al estado final ="+ nearFinal.toSource());
		
//		alert(test.toSource());
		this.previousModel=currentModel;
		GenerateState();
		this.equivalent=false;
		var estado=this.calculateMinimal(this.getCurrentStates());
		this.triggerSupport(estado.pos, estado.distance, this.equivalent);
		//var nearCurrent = tree.getFinal({cs}, points.length); 
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
						pos : i, //State what it belongs this fraction
						num : this.states[0][i].stObject.initial_model[k].numerator, // Fraction numerator
						den : this.states[0][i].stObject.initial_model[k].denominator, // Fraction denominator
						rep : this.states[0][i].stObject.initial_model[k].type
				}
				points.push(point);
			}
			var result = [];
			permutate(points, function(a) { // Permuting all possible fractions to get a whole state 
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
	
	//Funcion para calcular la distancia entre a y b donde a y b tienen un 
	Support.prototype.calculateDistanceUsingWeights= function(a, b){
		//alert(a.toSource()); //[{num:5, den:8}, {num:6, den:3}]
		//alert("A ="+a.toSource()+ " B ="+b.toSource()); //[{num:1, den:2}]
		var ecWeight=2;
		var resWeight=1;
		var mean=0;
		var aux=0; //Calcula euclidea conceptual
		var aux2=0; //Calcula resultado
		for (var i = 0; i < a.state.length; i++){
			aux+=Math.pow(a.state[i].num - b.state[i].num, 2) +  Math.pow(a.state[i].den - b.state[i].den, 2);
			aux2+=Math.abs((a.state[i].num - a.state[i].den)-(b.state[i].num - b.state[i].den))
		}
		if (this.equivalent==false) {
			this.equivalent=(aux2==0);
		}
		mean= (ecWeight* Math.sqrt(aux) + resWeight*(aux2/a.state.length))/2;
		return mean;
	}
	
	//JLF Get the final states of all states. Tiene que haber uno si no es que ha habido un error
	Support.prototype.getFinalStates= function(){
		var points=[];
		var allPoints =[];
		for(var i = 0; i < this.states[0].length; i++) {//recorre todos los estados
			for (var k = 0; k < this.states[0][i].stObject.initial_model.length; k++){//recorre todas las fracciones de un estado i
				if (this.states[0][i].fState == true)
					points.push({pos: i, num: this.states[0][i].stObject.initial_model[k].numerator, den:this.states[0][i].stObject.initial_model[k].denominator, rep:this.states[0][i].stObject.initial_model[k].type});
			}
		}
		permutate(points, function(a) { // Permuting all possible fractions to get a whole state 
			var st ={
					state : a.slice(0)
			};
			allPoints.push(st); //Guardamos un objeto con todas las posibles permutaciones de ese estado final
		});
		//alert("Estados finales = " + allPoints.toSource());
		return allPoints;
	}
	
	
	//JLF Get the current states. Si devuelve vacio es pq no aplica a esta regla
	Support.prototype.getCurrentStates= function() {
		var allPoints =[];
		if (currentModel.initial_model.length==this.rule) {
			var points=[];
			for (var k = 0; k < currentModel.initial_model.length; k++){
				var point = {
						pos : -1, //this means that it is the current state
						num : currentModel.initial_model[k].numerator, // Fraction numerator
						den : currentModel.initial_model[k].denominator, // Fraction denominator
						rep : currentModel.initial_model[k].type // Representacion de la fraccion
				}
				points.push(point);
			
			}
			permutate(points, function(a) { // Permuting all possible fractions to get a whole state 
				var state ={
						state : a.slice(0)
				};
				allPoints.push(state); //Guardamos un objeto con todas las posibles permutaciones de ese modelo
			});
		}
		//alert("Estados actuales = " + allPoints.toSource());
		return allPoints;
	}
	
	Support.prototype.calculateMinimal= function(cs){
		var distance=10000;
		var end;
		for (var i = 0; i < cs.length; i++) {//recorre todos los estados
			var state=cs[i].state;
			var nearFinal = this.tree.getFinal({state}, this.points.length);
			if (distance > nearFinal[1]){
				distance = nearFinal[1];
				end=nearFinal;
			}
		}
		if (end!= null) {
			alert("end complete = "+end.toSource());
			var result;
			result.pos=end[0].state[0].pos;
			result.distance=(distance==0);
			return result;//Devuelve la pos del estado mas cercano
		}
	}	
	
	Support.prototype.triggerSupport= function(sAux, fin, equi) {
		// Fin es true cuando la distancia es cero
		if (sAux !=null){
			if (this.states[0][sAux].end==true && this.states[0][sAux].exact==true && fin==true) { //Esto significa que es estado final total y la distancia es 0
				Alert.render("Well done! You finished the exercise");
				return;
			} else if (this.states[0][sAux].end==true && this.states[0][sAux].exact==false && fin==true){
				// Aqui habra que comprobar si es equivalente
				//Comprobar la no equivalencia de resultado y si es correcta ha terminado si no guidance
				if (equi){
					Alert.render("Well done! You finished the exercise");
					return;
				} else {
					if (!this.isEmpty(this.states[0][sAux].guidance))
						Alert.render(this.states[0][sAux].guidance);
					else {
						Alert.render("The teacher should provide Guidance feedback for: state "+ sAux+" in rule "+ this.rule);
					}
				}
			} else if (this.states[0][sAux].fState==true && this.states[0][sAux].exact==true && fin==true) { //Esto significa que es estado final de regla pero no total y es equivalente
				if (!this.isEmpty(this.states[0][sAux].socratic)){
					Alert.render(this.states[0][sAux].socratic);
				}
				else {
					Alert.render("Well done! You finished the exercise");
				}
			} else	if (this.states[0][sAux].fState==true && this.states[0][sAux].exact==false && fin==true) { //Esto significa que es estado final de regla pero no total y no es equivalente
				//Comprobar la no equivalencia de resultado y si es correcta socratico y si no guidance
				if (equi){
					if (!this.isEmpty(this.states[0][sAux].socratic)) {
						Alert.render(this.states[0][sAux].socratic);
					}
					else {
						Alert.render("The teacher should provide socratic feedback for: state "+ sAux+" in rule "+ this.rule);
					}
					return;
				} else {
					if (!this.isEmpty(this.states[0][sAux].guidance))
						Alert.render(this.states[0][sAux].guidance);
					else {
						Alert.render("The teacher should provide Guidance feedback for: state "+ sAux+" in rule "+ this.rule);
					}
				}
				//Anyadir reglas tb para comprobar el tipo de representacion que se ha hecho para la fraccion
			} else if (this.states[0][sAux].exact==true && fin==true) { // Si el estado es equivalente y exacto pero no es final
				if (!this.isEmpty(this.states[0][sAux].socratic)) {
					Alert.render(this.states[0][sAux].socratic);
				}
				else {
					Alert.render("The teacher should provide socratic feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			} else if (this.states[0][sAux].exact==true && fin==false) { // Si el estado es equivalente pero no exacto
				if (!this.isEmpty(this.states[0][sAux].didactic)) {
					Alert.render(this.states[0][sAux].didactic);
				}
				else {
					Alert.render("The teacher should provide didactic feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			} else if (this.previousModel.initial_model.length!=this.rule) {
				if (!this.isEmpty(this.states[0][sAux].didactic))
					Alert.render(this.states[0][sAux].didactic);
				else {
					Alert.render("The teacher should provide didactic feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			} else if (this.states[0][sAux].exact==false && fin==false) {
				if (!this.isEmpty(this.states[0][sAux].guidance))
					Alert.render(this.states[0][sAux].guidance);
				else {
					Alert.render("The teacher should provide Guidance feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			} else {
				if (!this.isEmpty(this.states[0][sAux].guidance))
					Alert.render(this.states[0][sAux].guidance);
				else {
					Alert.render("The teacher should provide Guidance feedback for: state "+ sAux+" in rule "+ this.rule);
				}
			}	
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
