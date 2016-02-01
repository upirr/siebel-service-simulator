angular.module('app')
.controller('SQLLogReplCtrl', ['$scope', 'sqlLogReplacer', 'toasty', function ($scope, sqlLogReplacer, toasty) {
	
	$scope.model = {
		input: ""
	}

	$scope.replace = function(input) {
		var output = sqlLogReplacer.replace(input);
		
		if (input != output)
			toasty.success("Done");
		else 
			toasty.warning({title: "Oops, something went wrong", msg: "Contact developer, attach test sql log text"});
		
		$scope.model.input = output;
	}

	$scope.editorOptions = {
		lineWrapping: true,
		lineNumbers: true,
		theme: "eclipse",
		mode: 'sql',
	};

}])