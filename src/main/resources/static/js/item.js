var app = angular.module('item', []);

var csrf = function() {
	var csrf_token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
	var csrf_pname = document.querySelector('meta[name="csrf_parameter"]').getAttribute('content');
	var header = {}
	header[csrf_pname] = csrf_token;
	return header;
}

app.controller('all', function($scope, $http) {
	$scope.item_list = {
			content: [],
			next_page: 0
	}
	$scope.load = function() {
		if($scope.item_list.next_page < 0) {
			return;
		}
		$http.get('http://localhost:8080/get/all/' + $scope.item_list.next_page).
		then(
			function(response) {
				$scope.item_list.content = $scope.item_list.content.concat(response.data.content);
				$scope.item_list.next_page =
					response.data.last
					? -1
					: $scope.item_list.next_page + 1;
			}
		);		
	}
	$scope.load();
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

app.controller('del', function($scope, $http, $window, $q) {
	$scope.del = function() {
		$q.when($window.confirm('Are you sure ?'))
			.then((confirm) => {
				if(confirm) {
					$http.delete('http://localhost:8080/del/' + $scope.$parent.it.id, {
						headers: csrf()
					} ).
						success(
								function(response) {
								}
						);
				}
        });
		
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

app.controller('check', function($scope, $http) {
	$scope.check = function() {
		var data = $scope.it.checked;
		$http.patch('http://localhost:8080/check/' + $scope.$parent.it.id, data, {
				headers: csrf()
		} ).
			success(
				function(response) {
				}
			);
	};
});