angular.module('app')
	.service('sqlLogReplacer', [function () {
		this.replace = function (input) {
			var  vars = findParseAndExecute(input) || findObjMgrSqlLog(input);
			
			if (vars && vars.length) {
				_.each(vars, function(varr) {
					input = input.replace(varr[0], "");
				})
				
				_.each(vars, function(varr) {
					input = input.replace(new RegExp("([\\s,\(]{1})(:" + varr[1] + ")([\\s,\)]{1})", "g"), "$1'" + varr[2] + "'$3")
				})
			}
			
			return input;
		}
			
		var findParseAndExecute = function(input) {
			var match, result = [];
			var re = new RegExp('^SQLParseAndExecute\\tBind\\sVars\\t4\\t[0-9a-f]{16}:0\\t\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\t(\\d{1,3}):\\s(.*)$', "gm");
			while((match = re.exec(input)) != null) {
				result.push(match);
			}
			return result.length ? result : null;
		}
		
		var findObjMgrSqlLog = function(input) {
			var match, result = [];
			var re = new RegExp('^ObjMgrSqlLog\\tDetail\\t4\\t[0-9a-f]{16}:0\\t\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\tBind\\svariable\\s(\\d{1,3}):\\s(.*)$', "gm");
			while((match = re.exec(input)) != null) {
				result.push(match);
			}
			return result.length ? result : null;
		}
}])