/*jshint node:true*/
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    'ember-font-awesome': {
      useScss: true, // for ember-cli-sass
      useLess: true  // for ember-cli-less
    },
    fingerprint: {
      exclude: ['apple-touch', 'favicon', 'mstile', 'open-graph', 'firefox_app', 'coast', 'android-chrome', 'yandex-browser', 'twitter']
    },
    sassOptions: {
      includePaths: ['bower_components/material-design-lite/src']
    },
    // Add options here
  });

  app.import('vendor/touchspin/jquery.bootstrap-touchspin.min.css');
  app.import('vendor/touchspin/jquery.bootstrap-touchspin.min.js');
  app.import('vendor/images-loaded/imagesloaded.pkgd.min.js');
  app.import('bower_components/slick-carousel/slick/slick.css');
  app.import('bower_components/slick-carousel/slick/slick-theme.css');
  app.import('bower_components/slick-carousel/slick/slick.min.js');
  app.import('bower_components/material-design-lite/material.min.css');
  app.import('bower_components/material-design-lite/material.min.js');
  app.import('bower_components/bootstrap-social/bootstrap-social.css');


  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
