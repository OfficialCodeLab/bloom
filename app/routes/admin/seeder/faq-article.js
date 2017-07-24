import Ember from 'ember';

export default Ember.Route.extend({

actions: {
  showPreview: function() {
    this.controller.set('showPreview', true);
  },
  createFaq(){
    let q = this.controller.get('question');
    let a = this.controller.get('answer');
    let i = this.controller.get('imageUrl');

    let article = this.store.createRecord('faqArticle', {
      question: q,
      answer: a,
      imageUrl: i
    });
    article.save().then(()=>{
      this.controller.set('isCreating', false);
      this.controller.set('question', '');
      this.controller.set('answer', '');
      this.controller.get('notifications').success('Article Created',{
          autoClear: true
      });
    });

  }
}

});
