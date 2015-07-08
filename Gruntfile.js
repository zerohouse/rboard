/**
 * Created by park on 15. 4. 23..
 */
module.exports = function (grunt) {

    grunt.file.defaultEncoding = "utf8";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //uglify 설정
        uglify: {
            options: {
                banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */ ' //파일의 맨처음 붙는 banner 설정
            },
            build: {
                src: 'client/js/js.js', //uglify할 대상 설정
                dest: 'client/js/js.min.js' //uglify 결과 파일 설정
            }
        },
        //concat 설정
        concat: {
            client: {
                src: [
                    'client/js/*.js',
                    'client/js/service/*.js',
                    'client/js/**/*.js',
                    '!client/js/js.js',
                    '!client/js/js.min.js',
                ],
                dest: 'client/js/js.js'
            },
            server: {
                src: [
                    'server/**/*.js',
                    '!server/express.js',
                    'server/express.js'
                ],
                dest: 'app.js'
            }
        },

        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    "client/**/*.css",
                    "!client/css/css.css"
                ],
                dest: "client/css/css.css"
            }
        },

        watch: {
            scripts: {
                files: [
                    'server/**/*.js',
                    'client/**/*.css',
                    '!client/css/css.css',
                    'client/**/*.js',
                    '!client/js/js.js',
                    '!client/js/js.min.js',
                ],
                tasks: ['concat', 'uglify', 'concat_css'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    // Load the plugin that provides the "uglify", "concat" tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify', 'concat_css']); //grunt 명령어로 실행할 작업

};