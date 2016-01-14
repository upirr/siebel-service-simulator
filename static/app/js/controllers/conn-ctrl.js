app.controller('ConnCtrl', ['$scope', 'model', 'api', 'requestExecutor', 'toasty', '$cookies', function ($scope, model, api, requestExecutor, toasty, $cookies) {

	$scope.model = model;

	var REPOSITORY = 'connections';
	var SELECTED_ITEM = 'selectedConnection';

	$scope.refresh = function () {
		requestExecutor.getConnectionList().then(function (result) {
			model.set(REPOSITORY, result || []);
			_.each(model[REPOSITORY], function (item) {
				item.status = "Connected";
				requestExecutor.checkConnection(item).catch(function () {
					requestExecutor.disconnect(item);
					item.status = "Disconnected";
				});
			});
			if (model[REPOSITORY].length) {
				model[SELECTED_ITEM] = model[REPOSITORY][0];
			}
		});
	}

	$scope.checkConnection = function (item) {
		requestExecutor.checkConnection(item).then(
			function () {
				toasty.success("Connection OK")
			},
			function () {
				toasty.error("Disconnected");
				item.status = "Disconnected";
			});
	}

	$scope.selectItem = function (item) {
		model[SELECTED_ITEM] = item;
		requestExecutor.checkConnection(item).catch(function () {
			requestExecutor.disconnect(item);
			toasty.error("Selected connection disconnected");
			item.status = "Disconnected";
		});
	}

	$scope.toURI = function (item) {
		return item && (item.uri + ":" + item.username + ":" + item.language) || "";
	};
	
	$scope.disconnect = function(item) {
		requestExecutor.disconnect(item).then(function() {
			toasty.info("Disconnected");
			item.status = "Disconnected";
		}, function(error) {
			toasty.error({title: "Disconnect attempt", msg: "Error occured while trying to disconnect"});
		});
	}
	
	$scope.reconnect = function(item) {
		requestExecutor.login(item).then(function() {
			toasty.success("Reconnected");
		}, function(error) {
			toasty.error("Failed to reconnect");
		})
	}

	$scope.refresh();
}]);