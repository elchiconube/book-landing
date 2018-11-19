
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  grunt.initConfig({
    watch: {
      sass: {
        files: ['sass/{,*/}*.{scss,sass}'],
        tasks: ['sass', 'postcss'],
      },
      js: {
        files: ['js/{,*/}*.js'],
        tasks: ['concat', 'uglify'],
      },
    },
    sass: {
      dist: {
        options: {
          style: 'expanded', // For compressed use 'compressed'
          sourcemap: 'none',
        },
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['style.scss', 'book.scss'],
          dest: 'css',
          ext: '.css',
        },],
      },
    },
    postcss: {
      options: {
        map: {
          inline: false,
          annotation: 'sass/maps/',
        },
        processors: [
          require('pixrem')(),
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')({ zindex: false, calc: false}),
        ],
      },
      dist: {
        src: 'css/style.css',
      },
    },
    concat: {
      js: {
        options: { separator: ';' },
        files: {
          'js/dist/book.js': [
            'js/lib/TweenMax.min.js',
            'js/lib/EasePack.min.js',
            'js/lib/mo.min.js',
            'js/lib/jquery-3.3.1.min.js',
            'js/book.js',
          ],
        },
      },
    },
    uglify: {
      target: {
        files: {
          'js/dist/book.min.js': ['js/dist/book.js']
        },
      },
    },
  })

  /* Load plugins  */

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  /* Tasks  */

  grunt.registerTask('default', ['sass', 'postcss', 'concat', 'uglify', 'watch' ]);

};
