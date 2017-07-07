import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
	img0: true,
    img1: false,
    img2: false,
    img3: false,
    currentSlide: 0,
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
		peopleStr: Ember.computed('model.favouritedBy.length', function() {
			let _this = this;

			let calcFavs = new Promise(function(resolve, reject) {
				Ember.run.next(_this, function() {
					if(_this.get('model.favouritedBy.length') === 1) {
						resolve(`${_this.get('model.favouritedBy.length')} person has favourited this`);
					} else {
						resolve(`${_this.get('model.favouritedBy.length')} people have favourited this`);
					}
				});
			});

			return DS.PromiseObject.create({ promise: calcFavs });
		})
});
