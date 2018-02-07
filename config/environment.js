/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'bloom',
    environment: environment,
    contentSecurityPolicy: { 'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com" },
    firebase: {
        apiKey: 'AIzaSyD48KsmEJvLnldR-7xwKANekixcoLTYW2s',
        authDomain: 'pear-server.firebaseapp.com',
        databaseURL: 'https://pear-server.firebaseio.com',
        storageBucket: 'pear-server.appspot.com',
    },
    torii: {
      sessionServiceName: 'session'
    },
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    filepickerKey: 'Ab8b55laiRbuJG3a8E2o6z',
    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['development', 'production'],
        config: {
          id: 'UA-87736082-1'
        }
      },
      // {
      //   name: 'Mixpanel',
      //   environments: ['development', 'production'],
      //   config: {
      //     token: '1f70ad74aad5810ae1053354f1449de8'
      //   }
      // }
    ],


    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV.APP.UID = 'asdf';
  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
  }

  return ENV;
};
