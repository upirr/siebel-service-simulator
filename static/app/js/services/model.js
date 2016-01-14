app.service('model', function ($log) {
	this.set = function (name, value, options) {
		this[name] = value;
		$log.info("model: selecting", name, "as", value);
		if (options) {
			options.reset && this.deselect(options.reset);
		}
	};

	this.unset = function (name) {
		$log.info("model: deselecting", name);
		Array.isArray(name) ? _.each(name, function (entry) {
			delete this[entry]
		}) : (delete this[name]);
	};
});
