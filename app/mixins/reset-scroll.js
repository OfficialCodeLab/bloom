import Ember from 'ember';

export default Ember.Mixin.create({
  activate: function() {
    this._super();

	// Or you can animate the scrolling:
	// container.animate({scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()});​
    window.scrollTo(0,0);
  }
});