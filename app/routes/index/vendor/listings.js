import Ember from 'ember';

const PAGE_SIZE = 10;

export default Ember.Route.extend({
  startAt: null,
  endAt: null,
  loadAmount: 0,
  loadCount: 0,
  itemsCount: 0,

  setupController: function (controller, model) {
    this._super(controller, model);
    var ic = this.get('itemsCount');
    // console.log(ic);
    this.resetLoadCount();
    controller.set('pageCount', Math.ceil(ic/PAGE_SIZE));
  },
	beforeModel: function() {
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
		}
		    let _id = this.get("currentUser.uid") + "";
		let user = this.store.peekRecord('user', _id);
		user.get('vendorAccount').then((ven)=>{
      if(ven === null || ven === undefined) {
        this.transitionTo('index.vendor.login');
      }
    }, ()=>{
      this.transitionTo('index.vendor.login');
    });

		return sesh;
    },
    model() {
	    let _id = this.get("currentUser.uid") + "";
		  return this.store.findRecord('user', _id).then((user)=>{
    	   return user.get('vendorAccount').then((va)=>{
           return this.store.findRecord('vendor', va.id).then((v)=>{
             return v.get('catItems').then((items)=>{
               if(items) {
             		this.set('itemsCount', items.get('length'));
             		this.resetLoadCount();
             		return v;
               } else {
                 return v;
               }
             });
           });
         });
      });
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
    actions: {
	    loadedImg: function() {
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


	    },
	    openAutoListing: function(){
	    	this.transitionTo('index.vendor.new-listing', { queryParams: { isAutoListing: true }});
	    }

	},
  resetLoadCount: function (){
      try{
         this.controller.set('percentLoaded', 0);
         this.controller.set('isLoaded', false);
         Ember.$('#masonry-items').fadeOut(0);
         Ember.$('#loading-spinner').fadeIn(0);
      } catch(ex){}
      this.set('loadCount', 0);
  }
});
