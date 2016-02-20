(function (ko, _) {
    //returns the properties of the object value of an observable as
    //writable computeds which mutate the parent observable on change
    ko.utils.propsAsObservables = function(observable) {
        if (!ko.isObservable(observable)) {
            return observable;
        }
        var value = ko.utils.unwrapObservable(observable);
        if (!_.isObject(value)) {
            return observable;
        }
        var result = {};
        var keys;
        if (typeof value.getType === "function") {
            var type = value.getType();
            keys = type.getFieldNames();
        } else {
            keys = Object.keys(value);
        }
        keys.forEach(function(key) {
            if (ko.isObservable(value[key])) {
                result[key] = value[key];
                return;
            }
            result[key] = ko.pureComputed({
                read: function() {
                    return value[key];
                },
                write: function(val) {
                    value[key] = val;
                    observable.valueHasMutated();
                }
            });
        })
        return result;
    }
})(window.ko, window._)
