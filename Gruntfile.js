module.exports = function (grunt) {


    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8888,
                    base: './src',
                    debug: true,
                    keepalive: true
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/*.js']
        },
        uglify: {
            dist: {
                files: {
                    'dist/bootcomplete.min.js': ['src/bootcomplete.js']
                }
            }
        }
    });

    grunt.registerTask('listen', ['connect']);
    grunt.registerTask('dist', ['jshint','uglify']);
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

};