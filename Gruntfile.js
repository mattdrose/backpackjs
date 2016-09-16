'use strict';
var fs = require('fs');
var junk = require('junk');

module.exports = function (grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',
    // Task configuration.
    clean: {
      options: {
        force: true,
      },
      build: ['build/'],
    },
    rollup: {
      options: {
        format: 'umd',
        globals: {
          backpackjs: 'bp',
        }
      },
      main: {
        options: {
          moduleName: 'bp'
        },
        files: [{
          src: 'lib/backpack.js',
          dest: 'build/backpack.js'
        }]
      },
      modules: {
        options: {
          external: 'backpackjs'
        },
        files: fs.readdirSync('lib/').filter(function(filename) {
          return junk.not(filename) && filename != 'backpack.js';
        }).map(function(filename) {
          return {
            src: 'lib/' + filename,
            dest: 'build/' + filename
          };
        }),
      }
    },
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:9000/test/backpack.html'],
          page : {
            viewportSize : { width: 1280, height: 800 }
          }
        }
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      src: {
        options: {
          jshintrc: './.jshintrc'
        },
        src: ['./backpack.js']
      }
    },
    connect: {
      tests: {
        options: {
          hostname: '*',
          port: 9000
        }
      }
    },
    'saucelabs-qunit': {
      all: {
        options: {
          urls: ['http://localhost:9000/test/backpack.html'],
          build: process.env.TRAVIS_JOB_ID,
          browsers: [
            // iOS
            {
              browserName: 'iphone',
              platform: 'OS X 10.9',
              version: '7.1'
            },
            {
              browserName: 'ipad',
              platform: 'OS X 10.9',
              version: '7.1'
            },
            // Android
            {
              browserName: 'android',
              platform: 'Linux',
              version: '4.3'
            },
            // OS X
            {
              browserName: 'safari',
              platform: 'OS X 10.9',
              version: '7'
            },
            {
              browserName: 'safari',
              platform: 'OS X 10.8',
              version: '6'
            },
            {
              browserName: 'firefox',
              platform: 'OS X 10.9',
              version: '28'
            },
            // Windows
            {
              browserName: 'internet explorer',
              platform: 'Windows 8.1',
              version: '11'
            },
            {
              browserName: 'internet explorer',
              platform: 'Windows 8',
              version: '10'
            },
            {
              browserName: 'internet explorer',
              platform: 'Windows 7',
              version: '11'
            },
            {
              browserName: 'internet explorer',
              platform: 'Windows 7',
              version: '10'
            },
            {
              browserName: 'internet explorer',
              platform: 'Windows 7',
              version: '9'
            },
            {
              browserName: 'firefox',
              platform: 'Windows 7',
              version: '29'
            },
            {
              browserName: 'chrome',
              platform: 'Windows 7',
              version: '34'
            },
            // Linux
            {
              browserName: 'firefox',
              platform: 'Linux',
              version: '29'
            }
          ]
        }
      }
    }
  });

  grunt.registerTask('create-pkg-json', 'Creates package.json file for /build', function() {
    grunt.log.writeln('Creating package.json file.');

    var obj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    delete obj.devDependencies;
    fs.writeFileSync("build/package.json", JSON.stringify(obj));
  });

  // Default task.
  grunt.registerTask('build', ['clean', 'rollup', 'create-pkg-json']);
  grunt.registerTask('default', ['build', 'jshint', 'connect', 'qunit']);
  grunt.registerTask('ci', ['default', 'saucelabs-qunit']);
};
