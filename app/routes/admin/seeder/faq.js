import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
      createFaq(){
        let q = this.controller.get('question');
        let a = this.controller.get('answer');
        let type = this.controller.get('selectedType');

        if (type === "User") {
          this.controller.set('isCreating', true);
          let uq = this.store.createRecord('userFaq', {
            question: q,
            answer: a
          });
          uq.save().then(()=>{
            this.controller.set('isCreating', false);
            this.controller.set('question', '');
            this.controller.set('answer', '');
      			this.controller.get('notifications').success('FAQ Created',{
  	            autoClear: true
  	        });
          });

        } else {
          this.controller.set('isCreating', true);
          let vq = this.store.createRecord('vendorFaq', {
            question: q,
            answer: a
          });
          vq.save().then(()=>{
            this.controller.set('isCreating', false);
            this.controller.set('question', '');
            this.controller.set('answer', '');
      			this.controller.get('notifications').success('FAQ Created',{
  	            autoClear: true
  	        });
          });
        }
      }
    }
});
