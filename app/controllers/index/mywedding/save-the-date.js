import Ember from 'ember';

export default Ember.Controller.extend({
	notifications: Ember.inject.service('notification-messages'),
	name1: "John",
	name2: "Jane",
	date: "13 May 2018",
	addressL1: "Johannesburg, South Africa",
	info1: "Invitation to follow",
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
