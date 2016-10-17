import Ember from 'ember';

export default Ember.Component.extend({
actions: {
    ok: function() {
      this.$('.modal').modal('hide');
      this.sendAction('ok');
    },
    submit: function(){
      this.$('.modal').modal('hide');
      this.sendAction('submitMsg');      
    },
    closeContactModal: function(){
      this.$('.modal').modal('hide');
      this.sendAction('closeContactModal');       
    },
    captchaComplete: function(data){
      alert("THIS WORKED");
      this.sendAction('captchaComplete');   
    }
  },
  show: function() {
    this.$('.modal').modal().on('hidden.bs.modal', function() {
      this.sendAction('close');
    }.bind(this));
  }.on('didInsertElement')
});
