var torrents = angular.module('torrents', []);

torrents.controller('TorrentListCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/torrents').success(function(data) {
		$scope.torrents = data;
	});
}]);