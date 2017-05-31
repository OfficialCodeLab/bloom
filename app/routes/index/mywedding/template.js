import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  model(params) {
    let _id = this.get("currentUser.uid") + "";

    return this.store.findRecord('user', _id);
  },
  setupController: function(controller, model) {
    this._super(controller, model);

    if (model.get("hasGender")) { // ATTEMPT TO FILL IN NAME
      if (model.get("isFemale")) {
        controller.set("name2", model.get("name"));
        if (model.get("spouse")) {
          controller.set("name1", model.get("spouse"));
        }
      } else {
        controller.set("name1", model.get("name"));
        if (model.get("spouse")) {
          controller.set("name2", model.get("spouse"));
        }
      }
    } else {
      controller.set("name2", model.get("name"));
      if (model.get("spouse")) {
        controller.set("name1", model.get("spouse"));
      }
    }

    if (model.get("email")) {
      controller.set("contact", model.get("email"));
    }

    this.store.findRecord("wedding", model.get("id")).then((wedding) => {
      if (wedding.get("weddingDate")) {
        let wd = moment(wedding.get("weddingDate")).format("MMMM Do YYYY - h:mm a");
        controller.set('date', wd);
        let before = moment(wedding.get("weddingDate")).subtract(3, 'months').format("Do MMMM YYYY");
        controller.set('info3', "Please RSVP before " + before);
      }

    });
  },
  actions: {
    sendInvites: function() {

      this.controller.get('notifications').warning('Functionality coming soon!', {
        autoClear: true
      });
    },

    ok: function() {
      let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
      switch (_modalData.get('action')) {

        case 'sendInvites':
          this.sendAllInvites();
          break;
      }
    },

    removeModal: function() {
      this.controller.set('sendingInvites', false);

      try {
        this.send('cancel');
      } catch (ex) {}
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },
  },
  sendAllInvites: function() {
    let _id = this.get("currentUser.uid") + "";

    this.store.findRecord('guest-list', _id, {
      reload: true
    }).then(() => {
      //ERROR
      this.set('sendingInvites', false);
      this.controller.get('notifications').error('Invites have already been sent. If you feel this an error, please contact support.', {
        autoClear: true
      });
    }, () => {
      this.store.findRecord("wedding", _id).then((wedding) => {
        let detailsJSON = {
          'name1': this.controller.get('name1'),
          'name2': this.controller.get('name2'),
          'subheading': this.controller.get('subheading'),
          'date': this.controller.get('date'),
          'addressL1': this.controller.get('addressL1'),
          'addressL2': this.controller.get('addressL2'),
          'info1': this.controller.get('info1'),
          'info2': this.controller.get('info2'),
          'info3': this.controller.get('info3'),
          'contact': this.controller.get('contact'),
          'templateId': '1'
        };
        // console.log(detailsJSON);
        wedding.get('guests').then((guests) => {
          if (guests.length > 0) {
            if (guests.length <= 200) {
              let list = this.store.createRecord('guest-list', {
                id: _id,
                dateSent: moment() + "",
                guestCount: guests.length,
                details: detailsJSON,
                completed: false,
                errors: {}
              });

              list.save().then(() => {
                this.set('sendingInvites', false);
                this.controller.get('notifications').info('Invites are being sent, please await email confirmation on completion.', {
                  autoClear: true
                });
              }).catch((e) => {
                console.log(e.errors);
                this.set('sendingInvites', false);
                this.controller.get('notifications').error('An unknown error occured, please contact support.', {
                  autoClear: true
                });
              });


            } else {
              this.set('sendingInvites', false);
              this.controller.get('notifications').warning('Your guest list exceeds your limit of 200 entries, please contact support to have this limit changed.', {
                autoClear: true
              });
            }
          } else {
            this.set('sendingInvites', false);
            this.controller.get('notifications').warning('You have no guests. Please fill out your guest list!', {
              autoClear: true
            });
          }
        });

      });
    });

  }
});
