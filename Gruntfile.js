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
                src: 'js/js.js', //uglify할 대상 설정
                dest: 'js/js.min.js' //uglify 결과 파일 설정
            }
        },
        //concat 설정
        concat: {
            basic: {
                src: [
                    'js/**/*.js',
                    '!js/js.js',
                    '!js/js.min.js',
                ],
                dest: 'js/js.js' //concat 결과 파일
            }
        },

        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    "css/**/*.css",
                    "!css/css.css"
                ],
                dest: "css/css.css"
            }
        },

        watch: {
            scripts: {
                files: [
                    'js/**/*.js',
                    'css/**/*.css',
                    '!js/js.js',
                    '!js/js.min.js',
                    '!css/css.css'
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