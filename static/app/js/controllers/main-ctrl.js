app.controller('MainCtrl', ['$scope', 'model', 'api', 'requestExecutor', 'toasty', '$q', 'utils', '$cookies', '$timeout', '$rootScope',
function ($scope, model, api, requestExecutor, toasty, $q, utils, $cookies, $timeout, $rootScope) {
		$scope.model = model;

		var REPOSITORY = 'requests';
		var SELECTED_ITEM_PROPERTY = "selectedRequest";

		$scope.data = {
			searchData: "",
			autoSaveOnExecute: $cookies.get("autoSaveOnExecute") || true
		};
	
		$scope.requests = [];

		$scope.autoSaveOnExecute = $cookies.get("autoSaveOnExecute") || true;

		$scope.$watch('data.autoSaveOnExecute', function (newvalue) {
			$cookies.put('autoSaveOnExecute', newvalue);
		});
	
		$scope.$watch("data.searchData", function (newvalue) {
			applySearchFilter(newvalue);
		}, true);

		$scope.$watch('model.requests', function (newvalue) {
			applySearchFilter($scope.searchString);
		});

		var applySearchFilter = function (newvalue) {
			if (!model[REPOSITORY] || model[REPOSITORY].length == 0)
				$scope.requests = [];
			else {
				if (!newvalue) {
					$scope.requests = model[REPOSITORY];
				} else
					$scope.requests = _.filter(model[REPOSITORY], function (item) {
						return item.serviceName.indexOf(newvalue) > -1 ||
							item.serviceMethod.indexOf(newvalue) > -1 ||
							item.request.indexOf(newvalue) > -1 ||
							item.response.indexOf(newvalue) > -1;
					})
			}
		}

		$scope.editorOptions = {
			lineWrapping: true,
			lineNumbers: true,
			theme: "eclipse",
			mode: 'xml',
		};
	
		$scope.onLeftEditorLoaded = function(editor) {
			$scope.leftEditor = editor;
		}
		
		$scope.onRightEditorLoaded = function(editor) {
			$scope.rightEditor = editor;
		}

		api.findAll(REPOSITORY).then(function (result) {
			model.set(REPOSITORY, result || []);
		});

		$scope.addItem = function () {
			var item = api.new({
				serviceName: "Workflow Utilities",
				serviceMethod: "Echo",
				"request": "<PropertySet>kokoko</PropertySet>",
				"response": "",
				"lastUpdated": new Date(),
				"comments": ""
			}, true);
			item.changed = true;

			!model[REPOSITORY] && model.set(REPOSITORY, []);
			model[REPOSITORY].push(item);
			$scope.requests !== model[REPOSITORY] && model.requests.push(item);
			model.set(SELECTED_ITEM_PROPERTY, item);
		};

		$scope.selectItem = function (item) {
			model.set(SELECTED_ITEM_PROPERTY, item);
		};

		$scope.saveItem = function (item) {
			api.save(item, REPOSITORY).then(function () {
				item.changed = false;
			});
		};

		$scope.rollbackItem = function (item) {
			item.reset();
		};

		$scope.deleteItem = function (item) {
			api.delete(item, REPOSITORY).then(function () {
				model[REPOSITORY] = _.without(model[REPOSITORY], item);
				model.unset(SELECTED_ITEM_PROPERTY);
			});
		};
	
		$scope.formatEditorContents = function() {
			$scope.rightEditor.autoFormatRange({line:0, ch:0}, {line:$scope.rightEditor.lineCount()});
			$scope.leftEditor.autoFormatRange({line:0, ch:0}, {line:$scope.leftEditor.lineCount()});
		}

		$scope.executeItem = function (item) {
			$scope.login().then(function () {
				requestExecutor.execute(item, model.selectedConnection).then(function (response) {
					if (response) {
						var xmlString;
						if (window.ActiveXObject) {
							xmlString = response.xml;
						}
						else {
							xmlString = (new XMLSerializer()).serializeToString(response);
						}
						item.response = xmlString;
					} else
						item.response = "";
					toasty.success("Executed");

					$timeout(function () {
						item.lastUpdated = new Date();
						api.save(item, REPOSITORY).then(function () {
							item.changed = false;
						});
					}, 15000);

					
					if ($scope.autoSaveOnExecute) {
						$scope.saveItem(item);
					}
					
					$timeout(function() {
						$scope.rightEditor.autoFormatRange({line:0, ch:0}, {line:$scope.rightEditor.lineCount()});
					});
				}, function (fault) {
					//bean is probably null and a relogin is required
					if (fault.data && (fault.data.exception == "java.lang.NullPointerException" || fault.data.message == "not.connected" || fault.data.message == "Not logged in.(SBL-JCA-00207)")) {
						$scope.login().then(function () {
							toasty.info("Please, run execute one more time");
						});
					} else if (fault.data && fault.data.exception == "empty.response")
						toasty.error({
							title: "Achtung",
							msg: "Unrecognized error, contact developer"
						});
					else
						utils.showException(fault);
				});
			});
		};

		$scope.login = function () {
			var deferred = $q.defer();

			if (!model.selectedConnection && !model.selectedSettings) {
				toasty.warning({
					title: "Not connected",
					msg: "Select connection profile first",
				});
				deferred.reject();
			}

			if (!model.selectedConnection || model.selectedConnection.status == "Disconnected") {
				toasty.info({
					title: model.selectedConnection && model.selectedConnection.status == "Disconnected" && "Reconnecting" || "Not connected",
					msg: "Connecting to: " + model.selectedSettings.uri
				});

				requestExecutor.login(model.selectedSettings).then(function () {
					toasty.success("Connected");
					deferred.resolve();
				}, function (response) {
					utils.showException(response);
					deferred.reject();
				});
			} else
				deferred.resolve();

			return deferred.promise;
		};

		$scope.copyItem = function (item) {
			if (item) {
				var copiedItem = api.new(item._values, true);
				model.requests.push(copiedItem);
				$scope.selectItem(copiedItem);
			}
		};
	
		$scope.formatDate = function(value) {
			if (value) {
				var dt = value instanceof Date ? value : new Date(value);
				return dt.toISOString().slice(0, 19);
			} else {
				return value;
			}
		}

}]);