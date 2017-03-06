// app/services/scroller.js
import Ember from 'ember';
import Scroller from 'ember-scroll-to/services/scroller';

export default Scroller.extend({
  scrollable: Ember.computed(function() {
  	//console.log(this.$.getElementsByClassName('pear-app-content'));
    return Ember.$('#main-scroll-container');
  })
});