import Ember from 'ember';
const PAGE_SIZE = 6;

export default Ember.Route.extend({
	loadAmount: 0,
	loadCount: 0,
  beforeModel: function() {
    var sesh = this.get("session").fetch().catch(function() {});
    return sesh;
  },
  model(params) {

    return Ember.RSVP.hash({
      category: this.store.findAll('category', {
        reload: true
      }).then(function(items) {
        let sorted = items.sortBy('id');
        return sorted;
      }),
      catItem: this.store.findAll('catItem').then((cats)=>{
				this.resetLoadCount();
				return cats.slice(0, PAGE_SIZE);
			})
    });
    // return this.store.findAll('category');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    Ember.set(controller, 'category', model.category);
    Ember.set(controller, 'catItem', model.catItem);

  },
  actions: {
    revealPhoneNumber() {
      this.controller.set('phoneNumVisible', true);
    },

    loadedImg: function() {
      let c = this.get('loadCount');
      let la = this.get('loadAmount');
      c++;
      let percentLoaded = (c / la) * 100;
      percentLoaded = parseInt(percentLoaded);
      this.controller.set('percentLoaded', percentLoaded);
      this.set('loadCount', c);
     if(c >= la){
        Ember.$('#masonry-items').fadeIn("fast");
        Ember.$('#loading-spinner').fadeOut("fast");
      }
      try{
          var $container = this.controller.get('masonryRef');
          $container.layout();
      } catch(ex){}


    }
  },
  resetLoadCount: function (){
      try{
         this.controller.set('isLoaded', false);
         Ember.$('#masonry-items').fadeOut(0);
         Ember.$('#loading-spinner').fadeIn(0);
      } catch(ex){}
      let loadAmount = PAGE_SIZE;
      this.set('loadAmount', loadAmount);
      this.set('loadCount', 0);
  }
});
