import Ember from 'ember';

export default Ember.Component.extend({
  	tour: Ember.inject.service(),

	willInsertElement: function(){

		let _this = this;


		this.get('tour').set('defaults', {
		  classes: 'shepherd-element shepherd-open shepherd-theme-arrows',
		  scrollTo: true,
		  showCancelLink: true,
		  modal: true,
		  autoStart: true
		});
    	this.get('tour').set('steps', [
		  {
		    id: 'intro',
		    options: {
		      
		      beforeShowPromise: function() {
		        return new Ember.RSVP.Promise(function(resolve) {
		          Ember.run.scheduleOnce('afterRender', _this, function() {

		            resolve();
		          });
		        });
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
		      title: 'Welcome to Bloom',
		      text: ['Dream. Create. Inspire.<br>Bloom invites you to build and celebrate your magical day with flawless wedding planning that spares no detail.<br>We’ll show you all the ropes to help you tie the knot.'],
		      when: {
		        show: () => {
		        },
		        hide: () => {
		        },

		        cancel: () => {
		        	this.toggleOverlay();
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
		      beforeShowPromise: function() {
		        return new Ember.RSVP.Promise(function(resolve) {
		          Ember.run.scheduleOnce('afterRender', _this, function() {
		            // window.scrollTo(0, 0);
		            //_this.get('documents.firstObject').set('isSelected', true);
		            resolve();
		          });
		        });
		      },
		      builtInButtons: [
		        // {
		        //   classes: 'shepherd-button-secondary',
		        //   text: 'Exit',
		        //   type: 'cancel'
		        // },
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
		        show: () => {
		        },
		        hide: () => {
		        },

		        cancel: () => {
		        	this.toggleOverlay();
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
		      beforeShowPromise: function() {
		        return new Ember.RSVP.Promise(function(resolve) {
		          Ember.run.scheduleOnce('afterRender', _this, function() {

		            resolve();
		          });
		        });
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
		        show: () => {
		        },
		        hide: () => {
		        },

		        cancel: () => {
		        	this.toggleOverlay();
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
		      beforeShowPromise: function() {
		        return new Ember.RSVP.Promise(function(resolve) {
		          Ember.run.scheduleOnce('afterRender', _this, function() {

		            resolve();
		          });
		        });
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
		      text: ['Add tasks to your to-do list to keep track of everything that needs doing. Soon you will be able to assign them to your friends!'],
		      when: {
		        show: () => {
		        },
		        hide: () => {
		        },

		        cancel: () => {
		        	this.toggleOverlay();
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
		      beforeShowPromise: function() {
		        return new Ember.RSVP.Promise(function(resolve) {
		          Ember.run.scheduleOnce('afterRender', _this, function() {

		            resolve();
		          });
		        });
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
		      text: ['Invite all of your loved ones to your big day, when you are done you can email all of them your invites automatically!'],
		      when: {
		        show: () => {
		        },
		        hide: () => {
		        },

		        cancel: () => {
		        	this.toggleOverlay();
		        }
		      }
		    }
		  },
		  {
		    id: 'outro',
		    options: {

		      beforeShowPromise: function() {
		        return new Ember.RSVP.Promise(function(resolve) {
		          Ember.run.scheduleOnce('afterRender', _this, function() {
		            resolve();
		          });
		        });
		      },
		      builtInButtons: [
		        {
		          classes: 'shepherd-button-primary',
		          text: 'Back',
		          type: 'back'
		        },
		        {
		          classes: 'shepherd-button-primary',
		          text: 'Done',
		          type: 'next'
		        }
		      ],
		  	  disableScroll: true,
		      title: 'Go wild, be inspired!',
		      text: ['Now it is time to browse!<br>Click on categories in the navigation bar and explore! Enjoy :)'],
		      when: {
		        show: () => {
		        },
		        hide: () => {
		          this.toggleOverlay();
		        },

		        cancel: () => {
		        	this.toggleOverlay();
		        }
		      }
		    }
		  },
		  ]);
		this.toggleOverlay();
		this.get('tour').start();
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
});
