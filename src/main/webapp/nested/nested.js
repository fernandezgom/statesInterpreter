/**
 * The controller doesn't do much more than setting the initial data model
 */
angular.module("demo").controller("NestedListsDemoController",
		function($scope) {

			$scope.models = {
				selected : null,
				templates : [ {
					type : "state",
					id : 2
				}, {
					type : "fractions",
					id : 1,
					columns : [ [] ]
				} ],
				dropzones : {
					"A" : [ ]
				}
			};

			$scope.$watch('models.dropzones', function(model) {
				$scope.modelAsJson = angular.toJson(model, true);
			}, true);
			$scope.$watch('models.selected', function(model) {
				makeAlert($scope.models.selected.type + " "+ $scope.models.selected.id);
			}, true);

		});
