import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('about');
  this.route('home');
  this.route('categories');
  this.route('category', {path: '/category/:category_id'});
  this.route('user', function() {
    this.route('new', {path: '/new'});
    this.route('account', {path: '/:user_id'});
  });
  this.route('myaccount');
  this.route('index', {path: '/' }, function() {
    this.route('favourites', {path: '/' });
    this.route('mywedding', function() {
      this.route('overview');
      this.route('guests');
      this.route('bride');
      this.route('groom');
    });
    this.route('vendor', function() {
      this.route('signup');
      this.route('login');
      this.route('listings', {path: '/' });
      this.route('new-listing');
      this.route('profile');
      this.route('security');

      this.route('products', function() {
        this.route('item', {path: '/item/:catItem_id'});
      });
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
});

export default Router;
