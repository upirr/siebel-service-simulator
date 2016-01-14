angular.module('app').directive('mdlUpgrade', function ($timeout) {
	return {
		restrict: 'A',
		compile: function () {
			return {
				post: function (scope, element) {
					$timeout(function () { componentHandler.upgradeElements(element[0]); }, 0);
				}
			};
		},
	};
});
