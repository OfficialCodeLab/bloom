import Ember from 'ember';

const PAGE_SIZE = 10;

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


  model () {
  	//this.store.unloadAll('cat-item');
  	let _id = this.get("session").get('currentUser').providerData[0].uid + "";
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
        let diff = this.get('endAt') - this.get('startAt');
        if(diff < PAGE_SIZE){
          this.set('endAt', this.get('startAt'));
        } else {
          this.set('endAt', this.get('endAt') - PAGE_SIZE);
        }
        this.set('startAt', this.get('startAt') - PAGE_SIZE);
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
        //this.resetLoadCount();
        this.set('startAt', this.get('startAt') + PAGE_SIZE);
        if(this.get('endAt') + PAGE_SIZE < fc){
          this.set('endAt', this.get('endAt') + PAGE_SIZE);
        } else {
          this.set('endAt', fc);
        }
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
      let percentLoadedStyle = 'width: ' + percentLoaded + '%';
      this.controller.set('percentLoaded', percentLoaded);
      this.controller.set('percentLoadedStyle', percentLoadedStyle);
      //console.log("loaded image");
      this.set('loadCount', c);

     // }
     if(c >= la){
        //console.log("loading complete");
        Ember.$('#masonry-items').fadeIn("fast");
        Ember.$('#loading-spinner').fadeOut("fast");
      }
      try{
          var $container = this.controller.get('masonryRef');
          $container.layout();        
      } catch(ex){}


    }

  },
  resetIndexes: function() { 
  	let fc = this.get('favsCount');
	this.set('startAt', 0);
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
         let percentLoadedStyle = 'width: 0%';
         this.controller.set('percentLoaded', 0);
         this.controller.set('percentLoadedStyle', percentLoadedStyle);
         this.controller.set('isLoaded', false);
         Ember.$('#masonry-items').fadeOut(0);
         Ember.$('#loading-spinner').fadeIn(0);
      } catch(ex){}
      let loadAmount = this.get('endAt') - this.get('startAt');
      this.set('loadAmount', loadAmount);
      this.set('loadCount', 0);    
  }
});
