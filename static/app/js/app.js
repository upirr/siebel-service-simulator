var app = angular.module('app', [
	'ui.router',
    'ngAnimate',
    'angular-toasty',
    'ngCookies',
    'ui.codemirror',
	'ngDialog'
])
	.config(function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise(function ($injector, $location) {
			return "";
		});

		$urlRouterProvider.when('/v2', '/v2/main');

		$stateProvider
			.state('home', {
				url: "",
				templateUrl: '/app/fragments/v1/v1.html'
			})
			.state('v2', {
				url: "/v2",
				abstract: true,
				templateUrl: '/app/fragments/v2/v2.html'
			})
			.state('v2.main', {
				url: '/main',
				templateUrl: '/app/fragments/v2/main.html',
				controller: "MainCtrl"
			})
			.state('v2.settings', {
				url: '/settings',
				templateUrl: '/app/fragments/v2/settings.html',
				controller: "MainCtrl"
			})
	})
	.config(function (toastyConfigProvider) {
		toastyConfigProvider.setConfig({
			showClose: true,
			clickToClose: false,
			timeout: 5000,
			sound: true,
			html: false,
			shake: false,
			theme: "material"
		});
	})
	.run(function ($rootScope, $timeout, $state) {
		$rootScope.$on("$stateChangeError", function () {
			console.log("huj");
		});

		$rootScope.$on('$viewContentLoaded', function () {
			$timeout(function () {
				componentHandler.upgradeAllRegistered();
			})
		})
	});