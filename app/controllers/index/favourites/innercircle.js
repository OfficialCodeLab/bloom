import Ember from 'ember';

export default Ember.Controller.extend({
  name: '',
  responseMessage: '',
  searchPartial: '',
  searching: false,
  notifications: Ember.inject.service('notification-messages'),
  searchResults: Ember.A([]),
  scroller: Ember.inject.service(),
  actions: {
    enterKeyPress(event) {
      event.preventDefault();
      if (this.get('searching') === false) {
        this.set('searching', true);
        this.searchUser();
      }
      // console.log(this.get('searching'));
    }
  },
  searchUser() {
    let _id = this.get("session").get('currentUser').providerData[0]._uid + "";
    let _name = this.get('name') + "";
    _name = _name.toLowerCase();
    let _oldname = this.get('oldname') + "";
    _oldname = _oldname.toLowerCase();
    let key = 0;
    if (_name !== '' && _name !== " " && _name !== _oldname) {
      this.set('responseMessage', "");
      //console.log("SEARCHING FOR: " + _name);
      let searchResults = [];
      this.store.query('user', {}).then((users) => {
        users.forEach(function(user) {
          let fullname = user.get('name') + " " + user.get('surname');
          if (~fullname.toLowerCase().indexOf(_name)) {
            searchResults.pushObject({
              name: fullname,
              id: user.get("id"),
              response: '',
              adding: '',
              key: key
            });
            key++;
          }
        });
        if (JSON.stringify(searchResults) === "[]") {
          this.get('notifications').warning('No Users with that name were found.', {
            autoClear: true
          });
        }
        this.set('oldname', _name);
        this.set('searchResults', searchResults);
        this.set('searching', false);
        let _this = this;
        Ember.run.next(function() {
          _this.set('searching', false);
          _this.get('scroller').scrollVertical("#searchRes", {
            duration: 800
          });
        }, 50);
        this.store.unloadAll('user');
        this.store.findRecord('user', _id);
      });
    } else {
      this.set('searching', false);
    }
  }
});
