/**
 * JLF: The controller set the initial data model and observe the data tree in case it needs to call the statesInterpreter API.
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
					stObject : null,
					socratic : "",
					guidance : "",
					didactic : "",
					fState : false,
					end : false,
					exact : false
				}, {
					type : "rule",
					id : 1,
					maxDistance : "2",
					rules : [ [] ]
				} ],
				dropzones : {
					"tip" : [ ]
				}
			};
			$scope.st = null;
			$scope.rl = null;
			$scope.$watch('models.dropzones', function(model) {
				saveModel(model);
				$scope.modelAsJson = angular.toJson(model, true);
			}, true);
			$scope.$watch('models.selected', function(model) {
				if ($scope.models.selected.type=="state") {
					activateHandlerStatesPanel(true);
					handleState($scope.models.selected.id);
					$scope.st=getSelectedState($scope.models.selected.id);
					$scope.models.selected.isValid=$scope.st.isValid;
					$scope.models.selected.stObject=$scope.st.stObject;
					$scope.models.selected.socratic=$scope.st.socratic;
					$scope.models.selected.guidance=$scope.st.guidance;
					$scope.models.selected.didactic=$scope.st.didactic;
					$scope.models.selected.fstate=$scope.st.fstate;
					$scope.models.selected.end=$scope.st.end;
					$scope.models.selected.exact=$scope.st.exact;
				} else {
					activateHandlerStatesPanel(false);
					handleRule($scope.models.selected.id);
					$scope.rl=getSelectedRule($scope.models.selected.id);
					$scope.models.selected.maxDistance=$scope.rl.maxDistance;
				}
			}, true);
			$scope.$watch('models.drop', function(model) {
				if ($scope.models.drop!=null && $scope.models.drop.type!="rule")
					handleNewTask(model);
				else if ($scope.models.drop!=null) {
					handleNewRule(model);
				}
			}, true);
		});
