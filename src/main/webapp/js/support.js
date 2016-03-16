// Singleton variable
var equivalente=false;


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
	};
	
	Support.prototype.getSupport = function(){
		GenerateState();
		if (currentModel.initial_model.length==this.rule){
			this.previousModel=currentModel;
			equivalente=false;
			var estado=this.calculateMinimal(this.getCurrentStates());
			if (estado!=null)
				this.triggerSupport(estado.pos, estado.distance, equivalente);
		}
	};
	
	//JLF: Get all possible points of the tip file associated to a concrete rule in put into an stucture  
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
	};
	
	//Funcion para calcular la distancia entre a y b 
	Support.prototype.calculateDistanceUsingWeights= function(a, b){
		//alert(a.toSource()); //[{num:5, den:8}, {num:6, den:3}]
		//alert("A ="+a.toSource()+ " B ="+b.toSource()); //[{num:1, den:2}]
		var ecWeight=0.4;
		var resWeight=0.3;
		var repWeight=0.3;
		var distance=0;
		var aux=0; //Calcula euclidea conceptual
		var aux2=0; //Calcula el valor real
		var aux3=0; //Calcula la distancia entre las representaciones
		for (var i = 0; i < a.state.length; i++){
			aux+=Math.pow(a.state[i].num - b.state[i].num, 2) +  Math.pow(a.state[i].den - b.state[i].den, 2);
			aux2+=Math.abs((a.state[i].num / a.state[i].den)-(b.state[i].num / b.state[i].den));
			if (a.state[i].rep.localeCompare(b.state[i].rep)!=0) {
				aux3+=1;
			}
		}
		if (equivalente==false) {
			equivalente=(aux2==0);
		}
		distance=(ecWeight* (1/1+Math.sqrt(aux)) + resWeight*(1/1+(aux2/a.state.length)) + repWeight*(1/1+aux3));
		return distance;
	};
	
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
	};
	
	
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
	};
	
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
			//alert("end complete = "+end.toSource() + "equivalente = "+ equivalente);
			var result={
					pos:end[0].state[0].pos,
					distance:(distance==1)
			};
			return result;//Devuelve la pos del estado mas cercano
		}
	};	
	
	Support.prototype.triggerSupport= function(sAux, fin, equi) {
		// Fin es true cuando la distancia es cero
		//alert("state = "+sAux+ "distancia0 = "+ fin + "equivalente = "+equi);
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
		
	};

	
	Support.prototype.isEmpty= function(str) {
		return (!str || 0 === str.length);
		
	};
