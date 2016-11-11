import Ember from 'ember';

const PAGE_SIZE = 10;

export default Ember.Route.extend({
  startAt: null,
  endAt: null,
  loadAmount: 0,
  loadCount: 0,
  name: '',
  desc: '',
  icon: '',
  iconName: '',
  catCount: 0,
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
  model (params) {
  	//this.store.unloadAll('cat-item');
  	window.scrollTo(0,0);
  	let _id = params.category_id;

    return this.store.find('category', _id).then((cat) => {
      let catItems = cat.get('catItems');
      // console.log(catItems.get('length'));
      // console.log(catItems);
      this.set('catCount', catItems.get('length'));
      this.set('name', cat.get('name'));
      this.set('desc', cat.get('desc'));
      this.set('icon', cat.get('icon'));
      this.set('iconName', cat.get('iconName'));
      if (!(this.get('startAt'))) {
        this.resetIndexes();
      }
      //let sorted = items.sortBy('name');
      this.resetLoadCount();
      console.log(this.get('startAt') + " => " + this.get('endAt'));

      return catItems.slice(this.get('startAt'), this.get('endAt'));
    });
  },
  setupController: function (controller, model) {
	this._super(controller, model);
  	this.controller.set('name', this.get('name'));
  	this.controller.set('desc', this.get('desc'));
    this.controller.set('icon', this.get('icon'));
    this.controller.set('iconName', this.get('iconName'));
    this.locatePage(controller);
    var cc = this.get('catCount');
    controller.set('pageTotal', Math.ceil(cc/PAGE_SIZE));
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
      var cc = this.get('catCount');
      if(this.get('startAt') + PAGE_SIZE < cc){
        this.resetLoadCount(); 
        this.incrementPage(); 
        //this.resetLoadCount();
        this.set('startAt', this.get('startAt') + PAGE_SIZE);
        if(this.get('endAt') + PAGE_SIZE < cc){
          this.set('endAt', this.get('endAt') + PAGE_SIZE);
        } else {
          this.set('endAt', cc);
        }
        this.locatePage(this.controller);
        this.refresh();
      } 
      //console.log("START AT: " + this.get('startAt') + "\nEND AT: " + this.get('endAt'));

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
    var cc = this.get('catCount'); 
    if(this.get('startAt') + PAGE_SIZE >= cc){
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
      var cc = this.get('catCount');    	
      this.set('startAt', 0);
      this.set('pageTotal', Math.ceil(cc/PAGE_SIZE));
      if(PAGE_SIZE < cc){ 
        this.set('endAt', PAGE_SIZE);
      }
      else{
        this.set('endAt', cc);
      }
  },
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
