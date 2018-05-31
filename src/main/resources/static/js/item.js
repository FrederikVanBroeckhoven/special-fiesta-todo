var app = angular.module('item', []);

var csrf = function() {
	var csrf_token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
	var csrf_pname = document.querySelector('meta[name="csrf_parameter"]').getAttribute('content');
	var header = {}
	header[csrf_pname] = csrf_token;
	return header;
}

var merge = function(list, items) {
	for(i in items) {
		if(list.findIndex(
			function(present) {
				return present.id == items[i].id;
			}) >= 0) {
			break;
		}
		list.push(items[i]);
	}
	return list;
}

var purge = function(list, id) {
	idx = list.findIndex(
		function(present) {
			return present.id == id;
		}
	);
	if(idx >= 0) {
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
	$scope.newItem = { title: '', description: '' };
	$scope.inserting = false;
	$scope.loading = false;

	$scope.cancel = function() {
		$scope.newItem.title = '';
		$scope.newItem.description = '';
		$scope.inserting = false;
	}
	$scope.insert = function() {
		$scope.inserting = true;
	}
	$scope.in_insert = function() {
		return $scope.inserting && !$scope.loading;
	}

	$scope.description_rows = function() {
		return ($scope.newItem.description.match(/\r\n|\r|\n/g) || [0]).length + 1;
	}

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
						$scope.loading = false;
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
								 $scope.itemList.content.unshift(response);
							}
						)
				}
			)
			.finally(
				() => {
					// reset insert procedure
					$scope.cancel();
				}
			);
	};
	$scope.load();
});

app.controller('item', function($scope, $http, $window, $q) {
	$scope.editable = false;
	$scope.toDelete = false;
	$scope.itemCopy = { title: $scope.it.title, description: $scope.it.description };

	$scope.in_edit = function() {
		return $scope.editable && !$scope.toDelete;
	}
	$scope.in_remove = function() {
		return !$scope.editable && $scope.toDelete;
	}
	$scope.idle = function() {
		return !$scope.editable && !$scope.toDelete;
	}

	$scope.description_rows = function() {
		return ($scope.it.description.match(/\r\n|\r|\n/g) || [0]).length + 1;
	}
	
	$scope.del = function() {
		$http
			.delete(
				root + '/del/' + $scope.it.id,
				{ headers: csrf() }
			)
			.success(
				() => {
					purge($scope.$parent.$parent.itemList.content, $scope.it.id);
				}
			);		
	};
	$scope.set = function() {
		$http
			.put(
				root + '/set/',
				{
					id: $scope.$parent.it.id,
					title: $scope.it.title,
					description: $scope.it.description					
				},
				{ headers: csrf() }
			)
			.finally(
				() => {
					$scope.itemCopy = { title: $scope.it.title, description: $scope.it.description };
					$scope.editable = false;
				}
			);
	};
	$scope.edit = function() {
		$scope.editable = true;
	};
	$scope.remove = function() {
		$scope.toDelete = true;
	};
	$scope.cancel = function() {
		$scope.toDelete = false;
		$scope.editable = false;
		$scope.it.title = $scope.itemCopy.title;
		$scope.it.description = $scope.itemCopy.description;
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
