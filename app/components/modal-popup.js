import Ember from 'ember';

export default Ember.Component.extend({
actions: {
    ok: function() {
      this.$('.modal').modal('hide');
      this.sendAction('ok');
    },
    close: function(){
      this.$('.modal').modal('hide');
      this.sendAction('removeModal');
    },
    submitBudget: function(){
      this.sendAction('submitBudget');
    },
    submit: function(){
      this.$('.modal').modal('hide');
      this.sendAction('submitMsg');
    },
    closeContactModal: function(){
      this.$('.modal').modal('hide');
      this.sendAction('closeContactModal');
    },
    closeBudgetModal: function(){
      this.$('.modal').modal('hide');
      this.sendAction('closeBudgetModal');
    },
    closeTodoModal: function(){
      this.$('.modal').modal('hide');
      this.sendAction('closeTodoModal');
    },
    saveTodo: function(){
      this.sendAction('saveTodo');
    },
    closeGuestModal: function(){
      this.$('.modal').modal('hide');
      this.sendAction('closeGuestModal');
    },
    saveGuest: function(){
      this.sendAction('saveTodo');
    },
    saveValue: function() {
      this.sendAction('saveValue');      
    },
    closeEditValue: function() {
      this.$('.modal').modal('hide');
      this.sendAction('closeEditValue');
    },
    captchaComplete: function(data){
      alert("THIS WORKED");
      this.sendAction('captchaComplete');
    },
    closeDate: function(){
      this.$('.modal').modal('hide');
      this.sendAction('closeDate');
    },
    okDate: function(){
      this.sendAction('okDate');
    }
  },
  show: function() {
    this.$('.modal').modal().on('hidden.bs.modal', function() {
      this.sendAction('close');
    }.bind(this));
  }.on('didInsertElement')
});
