module.exports = function(grunt) {

  /** 
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-html-build');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks('grunt-uncss');

  /**
   * Load in our build configuration file.
   */
  var user_config = require('./build.config.js');

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var tasks = {

    clean: {
      build: [
        '<%= dir.build %>',
        '<%= dir.compile %>'
      ],
      validation: [
        'validation-status.json'
      ],
      vendor: ['vendor'],
      all: [
        '<%= clean.build %>',
        '<%= clean.validation %>',
        '<%= clean.vendor %>',
        'node_modules'
      ]
    },

    sass: {
      build: {
        options: {
          lineNumbers: true,
          style: 'expanded'
        },
        css_file: {
          src: ['<%= files.scss %>'],
          dest: '<%= dir.build %>/<%= dir.src %>/<%= output.css %>',
        },
        files: ['<%= sass.build.css_file %>']
      }
    },

    csslint: {
      src: {
        options: {
          'adjoining-classes': false,
          'box-sizing': false,
          'box-model': false,
          'compatible-vendor-prefixes': false,
          'floats': false,
          'font-sizes': false,
          'gradients': false,
          'important': false,
          'known-properties': false,
          'outline-none': false,
          'qualified-headings': false,
          'regex-selectors': false,
          'shorthand': false,
          'text-indent': false,
          'unique-headings': false,
          'universal-selector': false,
          'unqualified-attributes': false,
          'zero-units': false,
          'duplicate-properties': false
        },
        src: ['<%= sass.build.css_file.dest %>']
      }
    },

    coffeelint: {
      src: {
        files: {
          src: ['<%= files.coffee %>']
        },
        options: {
          arrow_spacing: {
            level: 'error'
          },
          max_line_length: {
            level: 'ignore'
          },
          line_endings: {
            level: 'warn'
          }
        }
      }
    },

    jshint: {
      src: [
        '<%= files.js %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },

    uglify: {
      compile: {
        src: '<%= concat.compile_js.dest %>',
        dest: '<%= concat.compile_js.dest %>'
      }
    },

    concat: {
      compile_js: {
        src: ['<%= files.vendor.js %>', 'module.prefix', '<%= dir.build %>/<%= dir.src %>/**/*.js', 'module.suffix'],
        dest: '<%= dir.compile %>/<%= output.js %>'
      },
      compile_css: {
        src: ['<%= files.vendor.css %>', '<%= sass.build.css_file.dest %>'],
        dest: '<%= dir.compile %>/<%= output.css %>'
      }
    },

    copy: {
      js: {
        files: [{
          expand: true,
          src: ['<%= files.js %>'],
          dest: '<%= dir.build %>'
        }]
      },
      assets: {
        files: [{
          expand: true,
          flatten: true,
          filter: 'isFile',
          src: ['<%= dir.assets %>/**/*'],
          dest: '<%= dir.build %>/<%= dir.src %>'
        }]
      },
      vendor_js: {
        files: [{
          expand: true,
          src: ['<%= files.vendor.js %>'],
          dest: '<%= dir.build %>'
        }]
      },
      vendor_assets: {
        files: [{
          expand: true,
          src: ['<%= files.vendor.assets %>'],
          dest: '<%= dir.build %>'
        }]
      },
      vendor_css: {
        files: [{
          expand: true,
          src: ['<%= files.vendor.css %>'],
          dest: '<%= dir.build %>'
        }]
      },
      compile_assets: {
        files: [{
          expand: true,
          filter: 'isFile',
          cwd: '<%= dir.build %>/<%= dir.src %>',
          src: ['**/*', '!**/*.js', '!**/*.css'],
          dest: '<%= dir.compile %>/<%= dir.src %>'
        }]
      }
    },

    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: ['<%= files.coffee %>'],
        dest: '<%= dir.build %>',
        ext: '.js'
      }
    },

    cssmin: {
      compile: {
        src: '<%= concat.compile_css.dest %>',
        dest: '<%= concat.compile_css.dest %>'
      }
    },

    htmlbuild: {
      build: {
        src: '<%= dir.src %>/index.html',
        dest: '<%= dir.build %>',
        options: {
          beautify: true,
          relative: false,
          styles: {
            vendor: ['<%= files.vendor.css %>'],
            main: {
              cwd: '<%= dir.build %>',
              files: ['<%= dir.src %>/<%= output.css %>']
            }
          },
          scripts: {
            vendor: {
              files: ['<%= files.vendor.js %>']
            },
            templates: {
              cwd: '<%= dir.build %>',
              files: include_templates()
            },
            main: {
              cwd: '<%= dir.build %>',
              files: [
              '<%= dir.src %>/js/**/*.js',
              '<%= dir.src %>/common/**/*.js',
              '<%= dir.app %>/**/*.js'
              ]
            }
          }
        }
      },
      compile: {
        src: '<%= dir.src %>/index.html',
        dest: '<%= dir.compile %>',
        relative: true,
        options: {
          styles: {
            vendor: [],
            main: ['<%= concat.compile_css.dest %>']
          },
          scripts: {
            vendor: [],
            main: ['<%= uglify.compile.dest %>'],
            templates: []
          }
        }
      }
    },

    validation: {
      options: {
        doctype: 'HTML5',
        charset: 'utf-8',
        reportpath: false,
        reset: true,
        relaxerror: ['<%= html_validation_ignored %>']
      },
      build: {
        files: {
          src: ['<%= dir.build %>/index.html']
        }
      }
    },

    imageoptim: {
      compile: {
        options: {
          imageAlpha: true,
          quitAfter: true
        },
        src: ['<%= dir.build %>']
      }
    },

    hashres: {
      compile: {
        options: {
          fileNameFormat: '${name}-${hash}.${ext}'
        },
        src: ['<%= cssmin.compile.dest %>', '<%= uglify.compile.dest %>'],
        dest: '<%= dir.compile %>/**/*.html'
      }
    },

    uncss: {
      compile: {
        files: {'<%= concat.compile_css.dest %>': ['<%= dir.compile %>/**/*.html']}
      }
    },

    compress: {
      compile: {
        options: {
          mode: 'gzip'
        },
        source: '<%= dir.compile %>',
        files:
        [{
          expand: true,
          cwd: '<%= compress.compile.source %>',
          src: ['*.js', '*.css'],
          dest: '<%= compress.compile.source %>'
        }]
      }
    },

    delta: {
      jssrc: {
        files: [
          '<%= files.js %>'
        ],
        tasks: ['jshint:src', 'copy:js', 'htmlbuild:build']
      },

      coffeesrc: {
        files: ['<%= files.coffee %>'],
        tasks: ['coffeelint:src', 'coffee:source', 'htmlbuild:build']
      },

      html: {
        files: ['<%= files.html %>'],
        tasks: ['htmlbuild:build', 'validation_decision']
      },

      scss: {
        files: ['<%= dir.src %>/**/*.scss'],
        tasks: ['sass:build','csslint:src']
      },
      
      assets: {
        files: ['<%= dir.assets %>/**/*'],
        tasks: ['copy:assets']
      },
      
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },
      
      tmpl_app: {
        files: ['<%= files.tmpl.app %>'],
        tasks: ['html2js:app']
      },
      
      tmpl_common: {
        files: ['<%= files.tmpl.common %>'],
        tasks: ['html2js:common']
      }
    },

    browser_sync: {
      watch: {
        bsFiles: {
          src: ['<%= dir.build %>/**/*']
        },
        options: {
          watchTask: true,
          host: 'localhost',
          ports: {
            min: '7000',
            max: '7003'
          },
          server: {
            baseDir: '<%= dir.build %>'
          }
        }
      }
    },
    
    html2js: {
      app: {
        options: {
          base: '<%= dir.app %>'
        },
        src: ['<%= files.tmpl.app %>'],
        dest: '<%= dir.build %>/<%= dir.src %>/<%= output.tmpl.app %>'
      },
      common: {
        options: {
          base: '<%= dir.common %>'
        },
        src: ['<%= files.tmpl.common %>'],
        dest: '<%= dir.build %>/<%= dir.src %>/<%= output.tmpl.common %>'
      }
    }
  };

  grunt.initConfig(grunt.util._.extend(tasks, user_config));

  grunt.renameTask('watch', 'delta');
  
  grunt.registerTask('watch', ['build', 'browser_sync:watch', 'delta']);
  
  grunt.registerTask('cleanup', ['clean:all']);

  grunt.registerTask('default', ['build', 'compile']);
  
  grunt.registerTask('build', [
    'clean:build', 'html2js_decision', 'jshint', 'coffeelint', 'coffee',
    'copy:vendor_js', 'copy:js', 'copy:vendor_css',
    'copy:vendor_assets', 'copy:assets', 'sass:build',
    'csslint:src', 'htmlbuild:build',
    'validation_decision'
  ]);

  grunt.registerTask('compile', [
    'concat:compile_css', 'concat:compile_js', 'uglify:compile', 'imageoptim:compile',
    'copy:compile_assets', 'htmlbuild:compile', 'uncss:compile', 'cssmin:compile',
    'hashres:compile', 'compress:compile'
  ]);
  
  grunt.registerTask('html2js_decision', 'Decides wheter to run html2js or not', function() {
    if (grunt.option('angular')) {
      grunt.task.run('html2js');
    }
  });
  
  grunt.registerTask('validation_decision', 'Decides wheter to run HTML validation or not', function() {
    if (!grunt.option('angular')) {
      grunt.task.run('validation:build');
      grunt.task.run('clean:validation');
    }
  });
  
  function include_templates() {
    if (grunt.option('angular')) {
      return ['<%= dir.src %>/<%= output.tmpl.app %>', '<%= dir.src %>/<%= output.tmpl.common %>'];
    } else {
      return [];
    }
  }
};
