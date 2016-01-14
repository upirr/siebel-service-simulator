app.controller('SettingsCtrl', ['$scope', 'model', 'api', 'requestExecutor', 'toasty', '$cookies', function ($scope, model, api, requestExecutor, toasty, $cookies) {
    $scope.model = model;

    var REPOSITORY = 'settings';

    api.findAll("settings").then(function (result) {
        model.set(REPOSITORY, result || []);

        //loading selected settings from cookies
        var selectedSettingsUri = $cookies.get('settingsUri');
        if (selectedSettingsUri) {
            var selectedSettings = _.find(model[REPOSITORY], function (item) {
                return item._uri == selectedSettingsUri;
            });
            if (selectedSettings) {
                $scope.selectItem(selectedSettings);
            }
        }
    });

    $scope.addItem = function () {
        var item = api.new({
            "uri": "Siebel://HOST:2321/ENTERPRISE/EAIObjMgr_enu",
            username: "SADMIN",
            "password": "SADMIN",
            language: "enu"
        }, true);
        item.changed = true;

        !model[REPOSITORY] && model.set(REPOSITORY, []);
        model[REPOSITORY].push(item);
        model.set("selectedSettings", item);
    };

    $scope.selectItem = function (item) {
        model.set("selectedSettings", item);
        if (item._uri)
            $cookies.put('settingsUri', item._uri);
    };

    $scope.saveItem = function (item) {
        api.save(item, REPOSITORY).then(function () {
            item.changed = false;
            $cookies.put('settingsUri', item._uri);
        });
    };

    $scope.rollbackItem = function (item) {
        item.reset();
    };

    $scope.deleteItem = function (item) {
        api.delete(item, REPOSITORY).then(function () {
            model.settings = _.without(model.settings, item);
            model.unset("selectedSettings");
        });
    };

    $scope.testConnect = function (connection) {
        if (model.selectedSettings) {
			
			toasty.info("Connecting");
            requestExecutor.login(connection).then(function () {
                toasty.success("Connected");
            }, function (response) {
                toasty.error({
                    title: response.data.error,
                    msg: response.data.message,
                });
            });
		}
        else
            toasty.warning({
                title: "Pending Action",
                msg: "Select connection first",
            });
    };
}]);