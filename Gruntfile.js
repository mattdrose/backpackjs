'use strict';

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
    qunit: {
      all: {
        options: {
          urls: ['http://localhost:9000/test/<%= pkg.name %>.html'],
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
          urls: ['http://localhost:9000/test/<%= pkg.name %>.html'],
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
              browserName: 'internet explorer',
              platform: 'Windows 7',
              version: '8'
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

  // Default task.
  grunt.registerTask('default', ['jshint', 'connect', 'qunit']);
  grunt.registerTask('saucelabs', ['connect', 'saucelabs-qunit']);
  grunt.registerTask('ci', ['jshint', 'connect', 'qunit', /*'saucelabs-qunit'*/]);
};
