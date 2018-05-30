var app = angular.module('item', []);

var csrf = function() {
	var csrf_token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
	var csrf_pname = document.querySelector('meta[name="csrf_parameter"]').getAttribute('content');
	var header = {}
	header[csrf_pname] = csrf_token;
	return header;
}

var merge = function(list, items) {
	items.forEach(
		function(item) {
			if(list.findIndex(
				function(present) {
					return present.id == item.id;
				}) > 0) {
				return;
			}
			list.push(item);
		}
	);
	return list;
}

var purge = function(list, id) {
	idx = list.findIndex(
		function(present) {
			return present.id == id;
		}
	);
	if(idx > 0) {
		list.splice(idx, 1);
	}
	return list;
}


var root = 'http://localhost:8080';

app.directive(
	"scrollBottom",
	function() {
		return {
			restrict: 'A',
			link:
				function(scope, elem, attrs) {
					first = elem[0];
					elem.bind(
						"scroll",
						function() {
							if(first.scrollTop + first.offsetHeight + 5 >= first.scrollHeight) {
								scope.$apply(attrs.scrollBottom);
							}
						}
					);
				}
		}
	}
);

app.controller('list', function($scope, $http) {
	$scope.itemList = {
			content: [],
			next_page: 0
	}
	$scope.loading = false;
	$scope.load = function() {
		if($scope.loading) {
			return;
		}
		$scope.loading = true;
		var page = Math.floor($scope.itemList.content.length / 5);
		$http
			.get(root + '/get/all/' + page + '/5')
			.success(
				(response) => {
					$scope.itemList.content =
						merge($scope.itemList.content, response.content);
				}
			)
			.finally(
					() => {
						// do not reload too fast
						setTimeout(() => { $scope.loading = false; }, 1000);
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
	$scope.toDelete = false;
	$scope.setItem = { title: '', description: '' };
	$scope.del = function() {
		$scope.$parent.$parent.loading = true;
		$http
			.delete(
				root + '/del/' + $scope.it.id,
				{ headers: csrf() }
			)
			.success(
				() => {
					purge($scope.$parent.$parent.itemList.content, $scope.it.id);
				}
			)
			.finally(
					() => {
						// do not reload too fast
						setTimeout(() => { $scope.$parent.$parent.loading = false; }, 1000);
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
	$scope.remove = function() {
		$scope.toDelete = true;
	};
	$scope.cancel = function() {
		$scope.toDelete = false;
		$scope.editable = false;
	};
	$scope.check = function(ch) {
		if(ch == undefined) {
			ch = $scope.it.checked;
		}
		$http
			.patch(
				root + '/check/' + $scope.$parent.it.id,
				ch,
				{ headers: csrf() }
			)
			.success(
				() => { $scope.it.checked = ch; }
			)
	};
});
