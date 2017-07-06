import Ember from 'ember';

export default Ember.Controller.extend({
  isVendors: false,
  isNotVendors: Ember.computed.not('isVendors')
});
