import Ember from 'ember';

const TourWeddingComponent = Ember.Component.extend({
  	tour: Ember.inject.service(),
  	storeName: '',
  	scroller: Ember.inject.service(),

	willInsertElement: function(){

		let _this = this;
		this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
		let _id = this.get('userid');

		let scrollHandler = (el) => {		    
		    // Animate scrolling with Scroll To
		    this.get('scroller').scrollVertical(el, {duration:800, offset: -180});
		};

		store.findRecord('user', _id).then((user)=>{
			var mustTourWedding = user.get('mustTourWedding');

			if(mustTourWedding){
				this.get('tour').set('defaults', {
				  classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
				  scrollTo: true,
				  showCancelLink: true,
				  modal: true,
				  autoStart: true,
				  scrollToHandler: scrollHandler
				});
		    	this.get('tour').set('steps', [
				  {
				    id: 'intro',
				    scrollTo: false,
				    options: {
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Start',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Welcome to Bloom',
				      text: ['Dream. Create. Inspire.<br>Let us show you the ropes to help you tie the knot.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'select-date',
				    options: {
				      attachTo: {
						  element: '#overview-card-1',
						  on: 'right'
						},
				      // beforeShowPromise: function() {
				      //   return new Ember.RSVP.Promise(function(resolve) {
				      //     Ember.run.scheduleOnce('afterRender', _this, function() {
				      //       // window.scrollTo(0, 0);
				      //       //_this.get('documents.firstObject').set('isSelected', true);
				      //       resolve();
				      //     });
				      //   });
				      // },
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Back',
				          type: 'back'
				        },
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Next',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Add your wedding date',
				      text: ['Let’s begin the countdown to the big day.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'setup-budget',
				    options: {
				      attachTo: {
						  element: '#overview-card-5',
						  on: 'top'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Back',
				          type: 'back'
				        },
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Next',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Set up a budget',
				      text: ['Keep track of those finances with our advanced budget calculator.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'setup-todo',
				    options: {
				      attachTo: {
						  element: '#overview-card-6',
						  on: 'left'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Back',
				          type: 'back'
				        },
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Next',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Plan tasks',
				      text: ['Use the to-do list to guide you through the process.<br>Make it your own by editing the list to suit your needs.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'invite-guests',
				    options: {
				      attachTo: {
						  element: '#overview-card-4',
						  on: 'right'
						},
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Back',
				          type: 'back'
				        },
				        {
				          classes: 'shepherd-button-primary',
				          text: 'Next',
				          type: 'next'
				        }
				      ],
				  	  disableScroll: true,
				      title: 'Get started on your guest list',
				      text: ['Add email addresses of invitees and send to guests<br>with our electronic invite.<br>Bloom will automatically track guest’s responses.'],
				      when: {
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  {
				    id: 'outro',
				    options: {
				      attachTo: {
						  element: '#overview-card-2',
						  on: 'top'
					  },
				      builtInButtons: [
				        {
				          classes: 'shepherd-button-secondary',
				          text: 'Done',
				          type: 'cancel'
				        }
				      ],
				  	  disableScroll: true,
				      // scrollTo: false,
				      title: 'My Wedding Hub',
				      text: ['Go to MY ACCOUNT to view profile details.<br>Check out Favourites to take the next tour.'],
				      when: {
				        hide: () => {
				        	this.completeTour();
				        },
				        cancel: () => {
				        	this.completeTour();
				        }
				      }
				    }
				  },
				  ]);
				this.toggleOverlay();
				this.get('tour').start();

			}
		});
	},
	toggleOverlay: function (){
		let isOverlay = this.get('isOverlay');
		if(isOverlay){
			Ember.$('#dark-overlay').fadeOut(1000);
			this.set('isOverlay', false);
		} else {
			Ember.$('#dark-overlay').fadeIn(1000);
			this.set('isOverlay', true);
		}

	},
	completeTour: function(){
		Ember.$('#dark-overlay').fadeOut(1000);
		this.set('isOverlay', false);
		let store = this.get('storeName');
		let _id = this.get('userid');
		store.findRecord('user', _id).then((user)=>{
			user.set('mustTourWedding', false);
			user.save();
		});
	}
});


TourWeddingComponent.reopenClass({
  positionalParams: ['userid']
});


export default TourWeddingComponent;