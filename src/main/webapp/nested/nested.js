/**
 * JLF: The controller doesn't do much more than setting the initial data model
 */
angular.module("demo").controller("NestedListsDemoController",
		function($scope) {

			$scope.models = {
				selected : null,
				drop : null,
				templates : [ {
					type : "state",
					id : 1,
					isValid: true,
					//st : null,
					stObject : null,
					socratic : "",
					guidance : "",
					didactic : "",
					fState : false,
					exact : false
					//include : false,
					//sbu : false
				}, {
					type : "rule",
					id : 1,
					rules : [ [] ]
				} ],
				dropzones : {
					"tip" : [ ]
				}
			};
			$scope.st = null;
			$scope.$watch('models.dropzones', function(model) {
				saveModel(model);
				$scope.modelAsJson = angular.toJson(model, true);
			}, true);
			$scope.$watch('models.selected', function(model) {
				if ($scope.models.selected.type=="state") {
					activateHandlerStatesPanel(true);
					handleState($scope.models.selected.id);
					$scope.st=getSelectedState($scope.models.selected.id);
					//$scope.models.selected.type=$scope.st.type;
					//$scope.models.selected.id=$scope.st.id;
					$scope.models.selected.isValid=$scope.st.isValid;
					//$scope.models.selected.st=$scope.st.st;
					$scope.models.selected.stObject=$scope.st.stObject;
					$scope.models.selected.socratic=$scope.st.socratic;
					$scope.models.selected.guidance=$scope.st.guidance;
					$scope.models.selected.didactic=$scope.st.didactic;
					$scope.models.selected.fstate=$scope.st.fstate;
					$scope.models.selected.exact=$scope.st.exact;
					//saveModel(model);
					//$scope.models.selected.include=$scope.st.include;
					//$scope.models.selected.sbu=$scope.st.sbu;					
				} else {
					activateHandlerStatesPanel(false);
				}
			}, true);
			$scope.$watch('models.drop', function(model) {
				if ($scope.models.drop!=null && $scope.models.drop.type!="rule")
					handleNewTask(model);
			}, true);
		});
