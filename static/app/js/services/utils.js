app.service('utils', function (toasty) {
    this.showException = function (exception) {
        if (exception && exception.data && exception.data.error && exception.data.message)
            toasty.error({
                title: exception.data.error,
                msg: exception.data.message
            });
        else toasty.error({
            title: "Unknown error",
            msg: "Unrecognized error, contact Valera"
        });
    };
});