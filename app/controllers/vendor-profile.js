import Ember from 'ember';

export default Ember.Controller.extend({
	masonryRef: '',
	isLoaded: false,
	isNotLoaded: Ember.computed.not('isLoaded'),
	percentLoaded: 0,
	contactInfoVisible: false,
	website: '',
	websiteRegex: Ember.computed.match('website', /^https?:\/\//),
	websiteUrl: Ember.computed('website', 'websiteRegex', function() {
		if(this.get('websiteRegex')) {
			return `${this.get('website')}`;
		} else {
			return `http://${this.get('website')}`;
		}
	}),
	actions: {
		storeMasonryRef(ref){
			this.set('masonryRef', ref);
		},
	    removedFavourite(){
	    	//console.log("TESTERINO");
		  	var $container = this.get('masonryRef');
		  	$container.masonry('layout');
	    }
	}
});
