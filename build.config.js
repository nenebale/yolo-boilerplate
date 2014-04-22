module.exports = {
  dir: {
    src: 'src',
    app: '<%= dir.src %>/app',
    build: 'build',
    compile: 'public',
    assets: '<%= dir.src %>/assets',
    common: '<%= dir.src %>/common'
  },

  files: {
    assets: ['<%= dir.src %>/assets/**/*'],
    scss: ['<%= dir.src %>/scss/application.scss'],
    js: ['<%= dir.src %>/app/**/*.js', '<%= dir.src %>/js/**/*.js'],
    coffee: ['<%= dir.src %>/app/**/*.coffee', '<%= dir.src %>/js/**/*.coffee'],
    html: ['<%= dir.src %>/index.html'],
    tmpl: {
      app: '<%= dir.app %>/**/*.tpl.html',
      common: '<%= dir.common %>/**/*.tpl.html'
    },
    vendor: {
      js: [
      'vendor/jquery/dist/jquery.js',
      'vendor/angular/angular.js',
      'vendor/angular-ui-router/release/angular-ui-router.js'
      ],
      css: [
      'vendor/normalize-css/normalize.css'
      ],
      assets: [
      ]
    }
  },
  
  output: {
    css: 'main.css',
    js: 'main.js',
    tmpl: {
      app: 'app-template.js',
      common: 'common-template.js'
    }
  },
  
  html_validation_ignored: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.']
};
