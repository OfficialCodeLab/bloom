/* global grecaptcha */
/* global $ */
/* global window */
import Ember from 'ember';

/**
 * Component to handle Render and Forward Result of the reCaptcha Challenge
 */
export default Ember.Component.extend({
  /**
   * Classes to add the rendered DOM element
   */
  classNames: ['g-recaptcha'],
  /**
   * Attribute bindings of the rendered DOM element
   */
  attributeBindings: ['siteKey:data-sitekey', 'data-theme', 'size:data-size', 'data-callback', 'data-expired-callback', 'data-tabindex'],
  /**
   * Site Key for reCaptcha Challenge
   */
  siteKey: '6LexUycUAAAAAFjIJoCO-pKIQp1JG3TnpTTLxAOi',

  size: 'invisible',
  /**
   * Language to display reCaptcha in
   */
  lang: 'en',
  /**
   * Trigger to initiate a Captcha reset
   */
  resetTrigger: false,

  /**
   * Flag to track captcha readiness
   */
  _isSetup: false,

  /**
   * Track attempts at polling for captcha object
   */
  _attempts: 0,

  /**
   * Set limit for maximum number of tries for polling for the Captcha object
   */
  _maxAttempts: function () {
    return 20;
  }.property().readOnly(),

  /**
   * Set the interval in which to poll for captcha object
   */
  _interval: function () {
    return 100; // Time between polls (in ms)
  }.property().readOnly(),

  /**
   * Callback to handle the Captcha Challenge Success
   * @param data Populated with the token for Captcha validation server side
   */
  verifyCallback: function (data) {
    //Use previously stored global reference as the callback function loses context of the component when called by the Captcha
    //Send Success Event to parent component/route for handling the event
    //this.log(JSON.stringify(window.captchaComponent));
    window.captchaComponent.sendAction('captchaComplete', data);
  },

  /**
   * Callback for when Captcha challenge expires and the user needs to re-enter the Captcha
   */
  expiredCallback: function () {
    //Use previously stored global reference as the callback function loses context of the component when called by the Captcha
    //Send Success Event to parent component/route for handling the event
    window.captchaComponent.sendAction('captchaExpired');
  },

  /**
   * Method to render the Captcha once the script is loaded and the Captcha object is available
   */
  setupGrecaptcha: function () {
    grecaptcha.render(this.$().prop('id'), {
      'sitekey': this.get('siteKey'),
      'size': this.get('size'),
      'callback': this.verifyCallback,
      'expired-callback': this.expiredCallback
    });
    this.set('_isSetup', true);
  },

  /**
   * Method to reset Captcha. Triggered by changing the value of resetTrigger to true
   */
  resetGrecaptcha: function () {
    if (this.get('_isSetup') === true && this.get('resetTrigger') === true) {
      grecaptcha.reset(this.$().prop('id'));
      this.set('resetTrigger', false);
    }
  }.observes('resetTrigger'),

  /**
   * Method to poll for availability of Captcha object after initiating script load
   */
  pollForObject: function () {
    Ember.Logger.debug("Polling for grecaptcha");
    if (window.grecaptcha !== undefined) {
      this.setupGrecaptcha();
    } else if (this.get('_attempts') < this.get('_maxAttempts')) {
      this.set('_attempts', this.get('_attempts') + 1);
      Ember.run.later(this, function () {
        this.pollForObject();
      }, this.get('_interval'));
    } else {
      Ember.Logger.error("Failed to get grecapthca script");
    }
  },

  /**
   * Initializer to initiate script download and save component instance in global window variable
   */
  init: function () {
    this._super();

    var self = this;
    $.getScript("https://www.google.com/recaptcha/api.js?&render=explicit&hl=" + self.get('lang'), function (/*data, textStatus, jqxhr*/) {
      self.pollForObject();
    });
    //Save component instance in Global window to enable access from callback
    window.captchaComponent = self;

  }
});
