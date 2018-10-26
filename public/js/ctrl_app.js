// var app = angular.module('app', ['lumx', 'ngResource', 'ngDialog']);
var app = angular.module('app', ['lumx', 'ngResource']);

app.controller('AppCtrl', ['$scope', function($scope) {

	$scope.href = function(url) {
		window.location = url;
	}

	$scope.scrollTo = function(element) {
		var element_position = $(element).offset().top;
		$('body, html').animate({scrollTop: element_position}, {duration: 500, easing: 'swing'});
	}

	$scope.toggleNavigation = function() {
		$('.toolbar').toggleClass('open');
	}

	$scope.sortArrayBy = function (array, property) {

		array.sort(function(a, b) {
			if (a[property] > b[property]) {
				return 1;
			} else if (a[property] < b[property]) {
				return -1;
			} else {
				return 0;
			}
		});

		return array;
	}

}]);