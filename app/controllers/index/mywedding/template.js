import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	name1: "John",
	name2: "Jane",
	subheading: "Would like to invite you, along with their families, to celebrate our love with us on our wedding day.",
	date: "Friday 23 October 2017 - 8pm",
	addressL1: "The Forest Walk",
	addressL2: "48 Allan Rd, Johannesburg, 1685",
	info1: "Dress is semi-formal",
	info2: "Cash bar available.",
	info3: "Please RSVP before 3 January 2017",
	contact: "086 123 1790",
	actions: {
		sendInvitesConfirm() {

      let _modalData;
			this.set('sendingInvites', true);

      if (this.get('modalDataId')) {
        _modalData = this.store.peekRecord('modal-data', this.get('modalDataId'));
        _modalData.set('mainMessage', 'You can only send out your invites once. Please make sure that you have added all guests and filled in all your details correctly.');
        _modalData.set('action', 'sendInvites');
        this.send('showModal', 'modal-confirm', _modalData);
      } else {
        let _modalData = this.store.createRecord('modal-data', {
          'mainMessage': 'You can only send out your invites once. Please make sure that you have added all guests and filled in all your details correctly.',
          'action': 'sendInvites'
        });
        this.set('modalDataId', _modalData.get('id'));
        this.send('showModal', 'modal-confirm', _modalData);
      }
    }
	}
});
