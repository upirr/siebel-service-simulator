app.service('requestExecutor', function ($log, $http, model, $q, psEncoder, psDecoder) {

	this.login = function (connection) {

		var deferred = $q.defer();
		$http({
				method: "POST",
				"url": "/execute/login",
				data: connection._values || connection
			})
			.then(function (response) {
				$log.debug("request-executor: connection established");
			
				var targetConnectionInstance = _.find(model.connections, function(item) {
					return item.uri == connection.uri && item.username == connection.username && item.password == connection.password && item.language == connection.language;
				})
				if (!targetConnectionInstance) {
					!model.connections && (model.connections = []);
					var connectionInstance = _.clone(connection._values);
					connectionInstance.status = "Connected";
					model.connections.push(connectionInstance);
					model.selectedConnection = connectionInstance;
				} else {
					targetConnectionInstance.status = "Connected";
					model.selectedConnection = targetConnectionInstance;
				}
				
				deferred.resolve(response);
			}, function (response) {
				$log.warn("request-executor: failed to connect", response);
				deferred.reject(response);
			})
		return deferred.promise;
	};


	this.execute = function (request, connection) {
		var deferred = $q.defer();

		var encodedXml = psEncoder.encode(request.request);

		$http({
				method: "POST",
				"url": "/execute/service",
				data: {
					request: encodedXml,
					serviceName: request.serviceName,
					methodName: request.serviceMethod,
					settings: connection
				}
			})
			.then(function (response) {
				$log.debug("request-executor: execution successful");
				if (response.data && response.data.response)
					deferred.resolve(psDecoder.decode(response.data.response));
				else
					deferred.reject({
						data: {
							exception: "empty.response",
							response: response
						}
					});
			}, function (response) {
				$log.warn("request-executor: execution failed", response);
				deferred.reject(response);
			});
		return deferred.promise;
	};

	this.getConnectionList = function () {
		var deferred = $q.defer();
		$log.debug("request-executor: getting connection list for user")
		$http({
			method: "GET",
			"url": "/execute/connections",
			data: {}
		}).then(function(response) {
			$log.debug("request-executor: received connection list", response );
			deferred.resolve(response.data);
		}, function(error) {
			$log.warn("request-executor: connection list retrieval failure", error );
			deferred.reject(error);
		})
		
		return deferred.promise;
	}
	
	this.checkConnection = function(settings) {
		var deferred = $q.defer();
		$log.debug("request-executor: checking connection", settings);
		
		$http({
			method: "POST",
			"url": "/execute/check",
			data: settings
		}).then(function() {
			$log.debug("request-executor: connection OK");
			deferred.resolve();
		}, function(error) {
			$log.warn("request-executor: connection check failed", error);
			deferred.reject(error);
		});
		
		return deferred.promise;
	}
	
	this.disconnect = function(settings) {
		var deferred = $q.defer();
		$log.debug("request-executor: disconnecting", settings);
		
		$http({
			method: "POST",
			"url": "/execute/logout",
			data: settings
		}).then(function() {
			$log.debug("request-executor: disconnected");
			deferred.resolve();
		}, function(error) {
			$log.warn("request-executor: error disconnecting", error);
			deferred.reject(error);
		});
		
		return deferred.promise;
	}

});