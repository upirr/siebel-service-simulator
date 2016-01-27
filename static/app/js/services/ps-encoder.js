app.service('psEncoder', function () {

	this.encode = function (xmlString) {
		if (!xmlString)
			return "";

		var xml = $($.parseXML(this.escape(xmlString))).children()[0];
		var write = function (value) {
			r += value + "*";
		}

		var writePs = function (target) {

			write(target.attributes.length);
			write(target.children.length);
			writeString(target.nodeName);
			var textValue = _.find(target.childNodes, function (node) {
				return node.data;
			});
			writeValue(textValue && textValue.data);

			for (var i = 0; i < target.attributes.length; i++) {
				writeString(target.attributes[i].name);
				writeString(target.attributes[i].value);
			}

			for (var i = 0; i < target.children.length; i++) {
				writePs(target.children[i]);
			}
		}

		var writeString = function (value) {
			var v = value || "";
			write(v.length);
			r += v;
		}

		var writeValue = function (value) { //meaning ps <Value>, tut eshe dolzhna bytj realizacija base64, no mne lenj
			write(3);
			writeString(value);
		}

		var r = "@";
		//header
		write(0);
		write(0);

		//ps
		writePs(xml);

		return r;
	};
        
	this.escape = function (str) {
		try {
			str = str.replace(/(\r\n|\n|\r)/gm," ")
			//find all attributes
			var attrs = [];
			var processed = "";
			var match;
			var re = /=\".*\"/igm;

			while ((match = re.exec(str)) != null) {
				attrs.push({
					index: match.index,
					value: match[0]
				});
			}
			
			var pos = 0;

			//replace ampersant with &quot;
			_.each(attrs, function (attr) {
				processed += str.substr(pos, attr.index - pos);
				processed += attr.value.replace(/\&(?!amp;|quot;)/gim, "&amp;");
				pos = attr.index + attr.value.length;
			});
			
			processed += str.substr(pos);
			
		} catch (e) {
			throw e;
		}
		
		return processed;
	}
});