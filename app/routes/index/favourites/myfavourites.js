import Ember from 'ember';

const PAGE_SIZE = 6;

export default Ember.Route.extend({
  startAt: null,
  endAt: null,
  loadAmount: 0,
  loadCount: 0,
  favsCount: 0,
	beforeModel: function() {
	  	var sesh = this.get("session").fetch().catch(function() {});
	  	if(!this.get('session.isAuthenticated')){
	        this.transitionTo('login');
	      }
	      return sesh;
    },
  handleResize: function() {
    try{
        var $container = this.controller.get('masonryRef');
        $container.layout();
    } catch(ex){}
  },
  bindResizeEvent: function() {
  	this._super();
    Ember.$(window).on('resize', Ember.run.bind(this, this.handleResize));
  }.on('init'),

  setupController: function (controller, model) {
    this._super(controller, model);
    this.locatePage(controller);
    var fc = this.get('favsCount');
    controller.set('pageTotal', Math.ceil(fc/PAGE_SIZE));
  },

  model () {
  	//this.store.unloadAll('cat-item');
  	let _id = this.get("currentUser.uid") + "";
	//return this.store.findRecord('user', _id);
    return this.store.findRecord('user', _id).then((user) => {
      let favourites = user.get('favourites');
      this.set('favsCount', favourites.get('length'));
      if (!(this.get('startAt'))) {
        this.resetIndexes();
      }
      //let sorted = items.sortBy('name');
      this.resetLoadCount();

      return favourites.slice(this.get('startAt'), this.get('endAt'));
    });
  },

	actions: {

		prev: function() {
      var id = this.get('currentModel').get('firstObject.id');
      //var items = this.store.peekAll('cat-item');
      if(this.get('startAt') - PAGE_SIZE >= 0){
        this.resetLoadCount();
        this.decrementPage();
        let diff = this.get('endAt') - this.get('startAt');
        if(diff < PAGE_SIZE){
          this.set('endAt', this.get('startAt'));
        } else {
          this.set('endAt', this.get('endAt') - PAGE_SIZE);
        }
        this.set('startAt', this.get('startAt') - PAGE_SIZE);
        this.locatePage(this.controller);
        this.refresh();
      } else {
        this.resetIndexes();
      }

      //console.log("START AT: " + this.get('startAt') + "\nEND AT: " + this.get('endAt'));

    },

    next: function() {
      var id = this.get('currentModel').get('lastObject.id');
  	  let fc = this.get('favsCount');
      if(this.get('startAt') + PAGE_SIZE < fc){
        this.resetLoadCount();
        this.incrementPage();
        //this.resetLoadCount();
        this.set('startAt', this.get('startAt') + PAGE_SIZE);
        if(this.get('endAt') + PAGE_SIZE < fc){
          this.set('endAt', this.get('endAt') + PAGE_SIZE);
        } else {
          this.set('endAt', fc);
        }
        this.locatePage(this.controller);
        this.refresh();
      }
      //console.log("START AT: " + this.get('startAt') + "\nEND AT: " + this.get('endAt'));

    },
    loadedImg: function(src) {
      let c = this.get('loadCount');
      let la = this.get('loadAmount');
      c++;
      let percentLoaded = (c / la) * 100;
      percentLoaded = parseInt(percentLoaded);
      this.controller.set('percentLoaded', percentLoaded);
      // console.log("loaded image");
      this.set('loadCount', c);

      // console.log(c + " / " + la);
     // }
     if(c >= la){
        // console.log("loading complete");
        Ember.$('#masonry-items').fadeIn("fast");
        Ember.$('#loading-spinner').fadeOut("fast");
      }
      try{
          var $container = this.controller.get('masonryRef');
          $container.layout();
      } catch(ex){}


    }

  },
  locatePage: function(controller){
    var fc = this.get('favsCount');
    if(this.get('startAt') + PAGE_SIZE >= fc){
      //AT LAST PAGE
      controller.set('isLast', true);
    } else {
      controller.set('isLast', false);
    }

    if(this.get('startAt') - PAGE_SIZE < 0) {
      //AT FIRST PAGE
      controller.set('isFirst', true);
    } else {
      controller.set('isFirst', false);
    }

  },
  incrementPage: function(){
    let x = this.controller.get('pageNum');
    x++;
    this.controller.set('pageNum', x);
  },
  decrementPage: function(){
    let x = this.controller.get('pageNum');
    x--;
    this.controller.set('pageNum', x);
  },
  resetIndexes: function() {
  	let fc = this.get('favsCount');
	  this.set('startAt', 0);
    this.set('pageTotal', Math.ceil(fc/PAGE_SIZE));
  	if(PAGE_SIZE < fc){
  		this.set('endAt', PAGE_SIZE);
  	}
  	else{
  		this.set('endAt', fc);
  	}
  },
  // unloadRecords: function(){
  // 	let items = this.controller.get('model');
  // 	let _items = this.store.peekAll('cat-item');
  // },
  resetLoadCount: function (){
      try{
         this.controller.set('percentLoaded', 0);
         this.controller.set('isLoaded', false);
         Ember.$('#masonry-items').fadeOut(0);
         Ember.$('#loading-spinner').fadeIn(0);
      } catch(ex){}
      let loadAmount = this.get('endAt') - this.get('startAt');
      this.set('loadAmount', loadAmount);
      this.set('loadCount', 0);
  }
});
