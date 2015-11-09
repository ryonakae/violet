var autoprefixer = require('autoprefixer-stylus');

module.exports = function(grunt) {

  grunt.config.set('stylus', {
    dev: {
      files: [{
        expand: true,
        cwd: 'assets/styles/',
        src: ['importer.styl'],
        dest: '.tmp/public/styles/',
        ext: '.css'
      }],
      options: {
        use: [function(){
          return autoprefixer('last 2 versions');
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
};