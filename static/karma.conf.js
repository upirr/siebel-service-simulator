// Karma configuration
// Generated on Wed Jan 20 2016 08:38:51 GMT+0200 (FLE Standard Time)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '.',


		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine-jquery', 'jasmine'],


		// list of files / patterns to load in the browser
		files: [
			"bower_components/angular/angular.js",
			"bower_components/jquery/dist/jquery.min.js",
			'bower_components/angular-mocks/angular-mocks.js',
			"bower_components/angular-ui-router/release/angular-ui-router.js",
			'bower_components/angular-animate/angular-animate.min.js',
			'bower_components/angular-toasty/dist/angular-toasty.min.js',
			'bower_components/angular-cookies/angular-cookies.min.js',
			'bower_components/codemirror/lib/codemirror.js',
			'bower_components/codemirror/mode/xml/xml.js',
			'bower_components/codemirror/mode/htmlmixed/htmlmixed.js',
			'bower_components/jquery/dist/jquery.js',
			'bower_components/lodash/lodash.js',
			'bower_components/ng-dialog/js/ngDialog.js',
			'bower_components/angular-ui-codemirror/ui-codemirror.js',
			'app/js/**/!(formatting).js',
      		'tests/**/*.js',
			{pattern: 'tests/**/*.json', watched: true, served: true, included: false}
    ],


		// list of files to exclude
		exclude: [
    ],


		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {},


		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress'],


		// web server port
		port: 9876,

		runnerPort: 9100,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DEBUG,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],


		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,


	})
}