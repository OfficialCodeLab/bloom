import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  metrics: Ember.inject.service(),

  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },

  _trackPage() {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = this.get('url');
      const title = this.getWithDefault('currentRouteName', 'unknown');

      Ember.get(this, 'metrics').trackPage({ page, title });
    });
  }
});

Router.map(function() {
  this.route('login');
  this.route('about');
  this.route('vendor-tour');
  this.route('home');
  this.route('categories');
  this.route('category', {path: '/category/:category_id'});
  this.route('user', function() {
    this.route('new', {path: '/new'});
    this.route('account', {path: '/:user_id'});
  });
  this.route('myaccount', function() {
    this.route('account', {path: '/' });
    this.route('vendor');
    this.route('security');
    this.route('notifications');
    this.route('payments');
    this.route('support');
  });
  this.route('index', {path: '/' }, function() {
    this.route('favourites', function() {
      this.route('myfavourites', {path: '/' });
      this.route('selectgender');
      this.route('innercircle');
      this.route('mystats');
    });
    this.route('mywedding', {path: '/' }, function() {
      this.route('overview', {path: '/'});
      this.route('guests');
      // this.route('mystats');
      // this.route('innercircle');
      this.route('todo');
      this.route('budget');
    });
    this.route('vendor', function() {
      this.route('signup');
      this.route('login');
      this.route('listings', {path: '/' });
      this.route('new-listing');
      this.route('profile');
      this.route('security');
      this.route('services', function() {
        this.route('item', {path: '/item/:catItem_id'});
      });
      this.route('branding');
    });
  });
  this.route('single-item', { path: '/item/:catItem_id' });
  this.route('admin', {path:'/admin'}, function() {
    this.route('requests');
    this.route('messages');
    this.route('users');
    this.route('vendors');
    this.route('seeder', function() {
      this.route('cat-item');
      this.route('category');
      this.route('vendor', function() {});
    });
  });
  this.route('listings');
  this.route('not-found', { path: '/*path' });
  this.route('vendor-profile', { path: '/vendor/:vendor_id' });
  this.route('guide');
  this.route('messaging', { path: '/messaging/:vendor_id' });
  this.route('logout');
  this.route('vendor-signup');
  this.route('mywedding');
});

export default Router;
