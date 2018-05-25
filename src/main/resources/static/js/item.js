var app = angular.module('item', []);

var csrf = function() {
	var csrf_token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
	var csrf_pname = document.querySelector('meta[name="csrf_parameter"]').getAttribute('content');
	var header = {}
	header[csrf_pname] = csrf_token;
	return header;
}

app.controller('all', function($scope, $http) {
	$http.get('http://localhost:8080/get/all').
		then(
			function(response) {
				$scope.items = response.data;
			}
		);
});

app.controller('add', function($scope, $http) {
	$scope.add = function() {
		var data = {
			title: $scope.item.title,
			description: $scope.item.description,
		}
		$http.post('http://localhost:8080/add', data, {
				headers: csrf()
		} ).success(
				function(response) {
				}
			);
	};
});

app.controller('del', function($scope, $http) {
	$scope.del = function() {
		$http.delete('http://localhost:8080/del/' + $scope.$parent.it.id, {
				headers: csrf()
		} ).
			success(
				function(response) {
				}
			);
	};
});

app.controller('set', function($scope, $http) {
	$scope.set = function() {
		var data = {
				id: $scope.$parent.it.id,
				title: $scope.it.title,
				description: $scope.it.description,
			}
		$http.put('http://localhost:8080/set/', data, {
				headers: csrf()
		} ).
			success(
				function(response) {
				}
			);
	};
});