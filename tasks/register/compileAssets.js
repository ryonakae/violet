module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'stylus:dev',
		'copy:dev',
    'browserify',
		'coffee:dev'
	]);
};
