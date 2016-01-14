var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
	lazy: false
});
var bowerFiles = require('main-bower-files');
var series = require('stream-series');

gulp.task('bower', function () {
	return plugins.bower();
});

gulp.task('index', function () {
	return gulp.src('./index.html')
		.pipe(plugins.inject(gulp.src(bowerFiles(), { read: false }), { name: 'bower', relative: true }))
		.pipe(plugins.inject(series(gulp.src('./app/js/app.js'), gulp.src(['./app/js/**/*.js', '!./app/js/app.js'])
		.pipe(plugins.angularFilesort())), { name: 'angular', relative: true }))
		.pipe(gulp.dest('./'));
});

gulp.task('sass', function () {
	gulp.src(['./scss/**/*.scss', '!./scss/**/_*.scss'])
		//.pipe(plugins.debug())
		.pipe(plugins.sass()).on('error', console.log.bind(console))
		.pipe(plugins.minifyCss({
			keepSpecialComments: 0
		}))
		.pipe(plugins.flatten())
		.pipe(plugins.concat('app.css'))
		.pipe(gulp.dest('./app/gen/'));
});

gulp.task('watch', function () {
	plugins.watch([
        'app/**/*.html',
        'app/**/*.js',
        'app/**/*.css'
    ], function (vynil) {
		return gulp.src(vynil.path)
			.pipe(plugins.connect.reload());
	});

	gulp.watch('./scss/**/*.scss', ['sass']);

	plugins.watch(['./app/js/**/*.js'], ['add', 'unlink'], function (vinyl) {
		if (vinyl.event == "add" || vinyl.event == "unlink")
			gulp.start('index');
	});
});

gulp.task('connect', function () {
	plugins.connect.server({
		root: ['app'],
		port: 9000,
		livereload: true
	})
});

gulp.task('build', ['index', 'sass']);

gulp.task('default', ['index', 'sass', 'watch']);
