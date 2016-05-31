import Ember from 'ember';

export default Ember.Component.extend({
	didInsertElement: function(){
		  this.$('.about-slider').slick({
			arrows: true
		  });

	},
	actions: {
		test: function(){
			$('.main-slider').slick({
			    centerMode: true,
			    centerPadding: '0px',
			    slidesToShow: 3,
			    dots: true,
			    speed: 1200,
			    slidesToScroll: 1,
			    infinite: true,
			    customPaging: function(slick, index) {
			        return $('.thumbnails').eq(index).find('img').prop('outerHTML');
			    },
			    responsive: [{
			        breakpoint: 640,
			        settings: {
			            arrows: false,
			            dots: true,
			            centerMode: false,
			            slidesToShow: 1,
			            customPaging: function(slick, index) {
			                return '<button type="button" data-role="none">' + (index + 1) + '</button>';
			            }
			        }
			    }]
			});
		}
	}
});
