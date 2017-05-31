import Ember from 'ember';

const PAGE_SIZE = 10;

export default Ember.Route.extend({
  startAt: null,
  endAt: null,
  loadAmount: 0,
  loadCount: 0,
  pageNum: 0,
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
  setupController: function(controller, model){
    this._super(...arguments);
    this.locatePage(controller);
    var items = this.store.peekAll('cat-item');
    controller.set('pageTotal', Math.ceil(items.get('length')/PAGE_SIZE));
  },
  model () {
    return this.store.findAll('cat-item', {reload: true}).then((items) => {
      let sorted = items.sortBy('favouritedBy.length').reverse();
      if (!(this.get('startAt'))) {
        this.resetIndexes();
      }
      this.resetLoadCount();
      return sorted.slice(this.get('startAt'), this.get('endAt'));
    });
  },

  actions: {


    prev: function() {
      var id = this.get('currentModel').get('firstObject.id');
      if(this.get('startAt') - PAGE_SIZE >= 0){
        this.controller.set('percentLoaded', 0);
        this.decrementPage();
        this.resetLoadCount();
        let diff = this.get('endAt') - this.get('startAt');
        if(diff < PAGE_SIZE){
          this.set('endAt', this.get('startAt'));
        } else {
          this.set('endAt', this.get('endAt') - PAGE_SIZE);
        }
        this.set('startAt', this.get('startAt') - PAGE_SIZE);
        this.scrollToTop(this.controller);
        this.locatePage(this.controller);
        this.refresh();
      } else {
        this.resetIndexes();
      }

    },

    next: function() {
      var id = this.get('currentModel').get('lastObject.id');
      var items = this.store.peekAll('cat-item');
      if(this.get('startAt') + PAGE_SIZE < items.get('length')){
        this.controller.set('percentLoaded', 0);
        this.incrementPage();
        this.resetLoadCount();
        //this.resetLoadCount();
        this.set('startAt', this.get('startAt') + PAGE_SIZE);
        if(this.get('endAt') + PAGE_SIZE < items.get('length')){
          this.set('endAt', this.get('endAt') + PAGE_SIZE);
        } else {
          this.set('endAt', items.get('length'));
        }
        this.scrollToTop(this.controller);
        this.locatePage(this.controller);
        this.refresh();
      }

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
  locatePage: function(controller){
    //console.log()
    var items = this.store.peekAll('cat-item');
    if(this.get('startAt') + PAGE_SIZE >= items.get('length')){
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
      var items = this.store.peekAll('cat-item');
      this.set('startAt', 0);
      //console.log("ITEMS: " + items.get('length'));\
      this.set('pageTotal', Math.ceil(items.get('length')/PAGE_SIZE));
      // try{}
      if(PAGE_SIZE < items.get('length')){
        this.set('endAt', PAGE_SIZE);
      }
      else{
        this.set('endAt', items.get('length'));
      }
  },
  resetLoadCount: function (){
      try{
         this.controller.set('isLoaded', false);
         Ember.$('#masonry-items').fadeOut(0);
         Ember.$('#loading-spinner').fadeIn(0);
      } catch(ex){}
      let loadAmount = this.get('endAt') - this.get('startAt');
      this.set('loadAmount', loadAmount);
      this.set('loadCount', 0);
  },
  scrollToTop: function(controller) {
    try{
    Ember.run.next(function () {
      controller.get('scroller').scrollVertical("#scrollTopPos", {duration:800});
    }); } catch(ex){}
  }

});
