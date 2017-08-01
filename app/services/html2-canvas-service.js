import Ember from 'ember';

export default Ember.Service.extend({
  capture: function(dom, options){
    console.log(options);
    return new Ember.RSVP.Promise(function(resolve, reject){
      html2canvas(dom, Ember.$.extend({
        onrendered: function (canvas) {
            resolve(canvas);
        }
    },(options||{})));
    });
  }
});
