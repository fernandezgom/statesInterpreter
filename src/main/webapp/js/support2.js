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
	Support.prototype.calculateHammingDistance= function(cm){
	};
	
	
	//JLF Get the final state of all states
	Support.prototype.getFinalState= function(){
		for (var j = 0; j < this.states[0][i].stObject.initial_model.length; j++){ //Comparamos cada estado con el del usuario
			if (this.states[0][i].fState == true)
				return i;
		}
	}
	
	
	//Calcula las distancias euclideas con respecto al estado final, recibe como variable la posicion de donde se encuentra el estado final de la regla
//	Support.prototype.calculateEuclideanDistancesToFinalState= function(fin) {
//			var comparator=[];
//			for(var i = 0; i < this.states[0].length; i++) { //Recorre todos los estados
//				var checked=[];//Comprueba si esa fraccion ya fue comparada y obtuvo distancia minima para no tener que volver a compararla	
//				for (var k = 0; k < this.states[0][i].stObject.initial_model.length; k++){ //recorre todas las fracciones de un estado i
//						var dist=[];
//						var cmp=100000;
//						var top;
//						var ch=0;
//						for(var j = 0; j < this.states[0][fin].stObject.initial_model.length; j++){ // recorre todas las fracciones del estado final
//							kcheck=false;
//							for (r = 0; r < checked.length; r++){ //Comprobamos si ya ha sido chequeado
//								if (checked[r] == k) {
//									kcheck=true;
//								}
//							}
//							if (!kcheck){
//								top=(this.states[0][fin].stObject.initial_model[j].numerator/this.states[0][fin].stObject.initial_model[j].denominator)-
//									(this.states[0][i].stObject.initial_model[k].numerator/this.states[0][i].stObject.initial_model[k].denominator)
//								if (cmp>top){
//									var cmp2=100000;
//									var top2;
//									//Hemos encontrado un candidato pero hay que comprobar ahora si los demas son mejores candidatos
//									for (var x = 0; x < this.states[0][i].stObject.initial_model.length; x++) {
//										top2=(this.states[0][fin].stObject.initial_model[j].numerator/this.states[0][fin].stObject.initial_model[j].denominator)-
//										(this.states[0][i].stObject.initial_model[x].numerator/this.states[0][i].stObject.initial_model[x].denominator)
//											if (cmp2>top2){
//												cmp=top;
//												ch=k;
//											}
//									}
//									cmp=top;
//									ch=k;
//								}
//							}
//						}
//						checked.pusk(ch);
//						dist.push(cmp);
//					}
//					distances.push(this.averageDistances(dist));
////				if (distances.length > 0) {
////					var distFinal={
////							state : i,
////							distance: distances
////						};
////					comparator.push(distFinal);
////				}
//			}
//		return comparator;
//		
//	}
	
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
