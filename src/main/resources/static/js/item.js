var app = angular.module('item', []);

var csrf = function() {
	var csrf_token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
	var csrf_pname = document.querySelector('meta[name="csrf_parameter"]').getAttribute('content');
	var header = {}
	header[csrf_pname] = csrf_token;
	return header;
}

var root = 'http://localhost:8080';

app.controller('list', function($scope, $http) {
	$scope.itemList = {
			content: [],
			next_page: 0
	}
	$scope.load = function() {
		if($scope.itemList.next_page < 0) {
			return;
		}
		$http
			.get(root + '/get/all/' + $scope.itemList.next_page + '/5')
			.success(
				(response) => {
					$scope.itemList.content = $scope.itemList.content.concat(response.content);
					$scope.itemList.next_page =
						response.last
						? -1
						: $scope.itemList.next_page + 1;
				}
			);		
	}
	$scope.add = function() {
		$http
			.post(
				root + '/add',
				{ title: $scope.newItem.title, description: $scope.newItem.description },
				{ headers: csrf() }
			)
			.success(
				(data, status, headers, config) => {
					$http
						.get(root + headers('Location'))
						.success(
							function(response) {
								 $scope.itemList.content.pop();
								 $scope.itemList.content.unshift(response);
							}
						)
				}
			)
			.finally(
				() => {
					$scope.newItem.title = '';
					$scope.newItem.description = '';					
				}
			);
	};
	$scope.load();
});

app.controller('item', function($scope, $http, $window, $q) {
	$scope.editable = false;
	$scope.setItem = { title: '', description: '' };
	$scope.del = function() {
		$q
			.when($window.confirm('Are you sure ?'))
			.then(
				(confirm) => {
					if(confirm) {
						$http
							.delete(
								root + '/del/' + $scope.it.id,
								{ headers: csrf() }
							)
							.success(
								(response) => {
									$http
									.get(root + '/get/all/' + $scope.$parent.$parent.itemList.content.length + '/1')
									.success(
										function(response) {
											// surely better done with scope-events,
											// but this is faster/lighter :)
											$scope.$parent.$parent.itemList.content.splice($scope.$parent.$index, 1);
											if(response.content.length > 0) {
												$scope.$parent.$parent.itemList.content.push(response.content[0]);
											}
										}
									)
								}
							);
					}
				}
			);
	};
	$scope.set = function() {
		$http
			.put(
				root + '/set/',
				{
					id: $scope.$parent.it.id,
					title: $scope.setItem.title,
					description: $scope.setItem.description					
				},
				{ headers: csrf() }
			)
			.finally(
				() => {
					$scope.it.title = $scope.setItem.title;
					$scope.it.description = $scope.setItem.description;
					$scope.editable = false;
				}
			);
	};
	$scope.edit = function() {
		$scope.setItem.title = $scope.it.title;
		$scope.setItem.description = $scope.it.description;
		$scope.editable = true;
	};
	$scope.check = function() {
		$http
			.patch(
				root + '/check/' + $scope.$parent.it.id,
				$scope.it.checked,
				{ headers: csrf() }
			);
	};
});
