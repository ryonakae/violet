module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
    'browserify',
		'jst:dev',
		'stylus:dev',
		'sync:dev',
		'coffee:dev'
	]);
};
