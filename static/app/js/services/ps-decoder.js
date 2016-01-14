app.service('psDecoder', function () {
    var SEPARATOR = "*"
    var readInteger = function (data) {
        var i = data.s.indexOf(SEPARATOR, data.pos);
        var j = parseInt(data.s.substring(data.pos, i), 10);
        data.pos = i + 1;
        return j;
    }
    
    var readPs = function(data, parent) {
        var propertyCount = readInteger(data);
        var childCount = readInteger(data);
        var elementName = readString(data);
        var value = readValue(data);
        var xmlString = "<" + elementName + ">" + value + "</" + elementName + ">";
        var root, newNode;
        
        if (!elementName)
            return "";
        
        parent && parent.append(xmlString) || (root = $.parseXML(xmlString));
        
        parent && (newNode = $(parent).find(":last-child")) || (newNode = $(root).find(":last-child"));
        
        for (var i=0; i<propertyCount; i++) {
            var propName = readString(data);
            var propValue = readString(data);
            newNode.attr(propName, propValue);
        }
        
        for (i=0; i<childCount; i++) {
            readPs(data, newNode);
        }
        return root;
    }
    
    var readString = function(data) {
        var strSize = readInteger(data);
        if (strSize == 0)
            return "";
        var result = data.s.substring(data.pos, data.pos + strSize);
        data.pos += strSize;
        return result;
    }
    
    var readValue = function(data) {
        var t = readInteger(data);
        switch(t) {
            case 0:
                return "";
            case 1:
                return readInteger(data);
            case 3:
            case 6:
                return readString(data);
        }
        
        throw "Unexpected propertyset value type"
    }

    //eto ebuchaja kopija govnokoda iz propertySeta JDB
    this.decode = function (str) {
        var data = {s: str, pos: 0, result: $.parseXML("")};
        //header
        readInteger(data);
        readInteger(data);
        //body
        return readPs(data);
    }
});