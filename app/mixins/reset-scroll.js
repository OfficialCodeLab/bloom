import Ember from 'ember';

export default Ember.Mixin.createEmber.Mixin.create({
  activate: function() {
    this._super();
    window.scrollTo(0,0);
  }
});