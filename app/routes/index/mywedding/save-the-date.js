import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({

    html2Canvas: Ember.inject.service('html2-canvas-service'),
    firebaseApp: Ember.inject.service(),
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

        this.store.findRecord("wedding", model.get("id")).then((wedding) => {
            if (wedding.get("weddingDate")) {
                let wd = moment(wedding.get("weddingDate")).format("DD MMM YYYY");
                controller.set('date', wd);
            }

        });
    },
    actions: {
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

        this.store.findRecord("wedding", _id).then((wedding) => {
            let detailsJSON = {
                'name1': this.controller.get('name1'),
                'name2': this.controller.get('name2'),
                'date': this.controller.get('date'),
                'addressL1': this.controller.get('addressL1'),
                'info1': this.controller.get('info1'),
                'templateId': '1'
            };
            // console.log(detailsJSON);
            wedding.get('guests').then((guests) => {
                if (guests.length > 0) {
                    if (guests.length <= 200) {
                        let list = this.store.createRecord('guest-list-sd', {
                            id: _id,
                            dateSent: moment() + "",
                            guestCount: guests.length,
                            details: detailsJSON,
                            completed: false,
                            errors: {}
                        });

                        list.save().then(() => {
                            this.controller.set('sendingInvites', false);
                            this.controller.get('notifications').info('Invites are being sent, please await email confirmation on completion.', {
                                autoClear: true
                            });
                        }).catch((e) => {
                            console.log(e.errors);
                            this.controller.set('sendingInvites', false);
                            this.controller.get('notifications').error('An unknown error occured, please contact support.', {
                                autoClear: true
                            });
                        });


                    } else {
                        this.controller.set('sendingInvites', false);
                        this.controller.get('notifications').warning('Your guest list exceeds your limit of 200 entries, please contact support to have this limit changed.', {
                            autoClear: true
                        });
                    }
                } else {
                    this.controller.set('sendingInvites', false);
                    this.controller.get('notifications').warning('You have no guests. Please fill out your guest list!', {
                        autoClear: true
                    });
                }
            });

        });


    }
});
