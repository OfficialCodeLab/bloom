import Ember from 'ember';

export default Ember.Route.extend({
	model (params){		
		window.scrollTo(0,0);
    	return this.store.find('category', params.category_id);
	}
});
