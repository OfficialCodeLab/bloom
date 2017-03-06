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
				      text: ['Dream. Create. Inspire.<br>Bloom invites you to build and celebrate your magical day with flawless wedding planning that spares no detail.<br>We’ll show you all the ropes to help you tie the knot.'],
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
				      title: 'Set up your wedding date',
				      text: ['Select your wedding date so that you can start planning for your big day!'],
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
				      title: 'Plan out your tasks',
				      text: ['Add tasks to your to-do list to keep track of everything that needs doing.<br>Soon you will be able to assign them to your friends!'],
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
				      text: ['Invite all of your loved ones to your big day.<br>When you are done you can email all your invites out automatically!'],
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
				      title: 'Finish your profile',
				      text: ['That’s all for this tour!<br>Head to your account page to set up<br>any other details you may have missed!'],
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