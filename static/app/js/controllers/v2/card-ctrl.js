app.controller('CardCtrl', ['$scope', 'model', 'ngDialog', 'toasty', function ($scope, model, ngDialog, toasty) {

	$scope.model = model;

	

	$scope.editorOptions = {
		lineWrapping: true,
		lineNumbers: true,
		theme: "eclipse",
		mode: 'xml',
	};

	$scope.openItem = function (entry) {
		model.set('selectedRequest', entry);
		ngDialog.open({
			template: "/app/fragments/v2/open-request.html",
			controller: ["$scope", "model", function ($scope, model) {
				$scope.model = model;
				$scope.viewMode = 'request';
				
				$scope.viewItem = function (item) {
					$scope.viewMode = $scope.viewMode == 'request' ? 'response' : 'request';
				}
			}]
		});

	}

	$scope.getDate = function (value) {
		if (value) {
			if (value instanceof Date) {
				return value.toISOString().slice(0, 10);
			} else {
				return new Date(value).toISOString().slice(0, 19);
			}
		} else {
			return value;
		}
	}

	$scope.getColor = function (request) {
		return "hsla(" + getHueFromEntityKey(hashCode(request.serviceName + request.serviceMethod)) + ", 50%, 45%, .5)";
	}

	var getHueFromEntityKey = function (stringHashCode) {
		var randomness = Math.abs(stringHashCode * stringHashCode | 5) % 10000;
		return Math.ceil(randomness * 100 / 255);
	};

	var hashCode = function (value) {
		var hash = 0,
			i, chr, len;
		if (value.length == 0) return hash;
		for (i = 0, len = value.length; i < len; i++) {
			chr = value.charCodeAt(i);
			hash = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};
}]);