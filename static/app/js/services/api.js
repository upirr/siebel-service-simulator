app.provider('api', function () {
	
	this.$get = ['$log', '$http', '$q', function ($log, $http, $q) {
		var self = {

			findAll: function (repository, options) {
				$log.debug("findAll: ", arguments);
				var deferred = $q.defer();
			
				$http.get("/" + repository)
					.then(function (result) {
						$log.debug("findAll: result received", result);
						var items = [];
						if (result.data._embedded && result.data._embedded[repository]) {
							_.each(result.data._embedded[repository], function (value) {
								var item = self.new(value);
								items.push(item);
								item._uri = value._links.self.href;
							});
						}
						deferred.resolve(items);
					}, function (fault) {
						$log.warn("findAll: fault received", fault);
						deferred.reject(fault);
					});
				return deferred.promise;
			},

			new: function (fields, isNew) {
				var record = {
						_fallback: {},
						_values: {},
						_new: isNew == true,
						_guid: new Date().getTime(),

						reset: function () {
							_.extend(record, record._fallback);
							record._fallback = {};
							record.changed = false;
						}
					},
					_changed = false,
					_new = isNew;

				Object.defineProperty(record, "changed", {
					set: function (value) {
						if (value !== record.changed) {
							_changed = value;
						}
					},
					get: function () {
						return _changed;
					}
				});

				_.each(fields, function (defaultValue, key) {
					if (key.indexOf("_") != 0) {
						Object.defineProperty(record, key, {
							set: function (value) {
								if (record._values[key] !== value) {
									record._values[key] = value;
									!record._fallback[key] && (record._fallback[key] = record._values[key]);
									record.changed = true;
								}
							},
							get: function () {
								return record._values[key];
							}
						});
						record._values[key] = defaultValue;
					}
				});

				return record;
			},

			save: function (item, repository) {
				var promise = $http({
					method: item._new && "POST" || "PUT",
					url: item._uri || "/" + repository,
					data: item._values
				});

				promise.then(function (response) {
					$log.debug("api: save successful", item, response);
					item._new = false;
					item._uri = response.headers("Location");
				}, function (fault) {
					$log.warn("api: save failed", item, fault);
				});

				return promise;
			},

			/**
			 * Removes item from given repository.
			 * @param   {object}  item       Record created earlier using api.new() to be removed
			 * @param   {string}  repository Repository to remove item from, optional.
			 * @returns {Promise} 
			 */
			delete: function (item, repository) {

				if (item._new) {
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}

				var promise = $http({
					method: "DELETE",
					url: item._uri
				});

				promise.then(function (response) {
					$log.debug("api: delete successful", item, response);
				}, function (fault) {
					$log.warn("api: delete failed", item, fault);
				});

				return promise;
			}
		}
		return self;
	}];
});