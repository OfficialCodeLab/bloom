import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
        let _this = this;
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
        } else {
					return sesh;
				}

        //Filthy hackaround for password authentication ;)

    },
		model: function() {
			let _this = this;
      return _this.generateUid().then((session)=>{
          return _this.checkAuthentication().then((admin)=>{
          	return admin;
					});
      });
		},
    checkAuthentication: function() {
				let _this = this;
        //First tier authentication:
        return new Promise(function(resolve, reject) {
	        let id = _this.get("currentUser.uid");
	        let user = _this.store.peekRecord('user', id);
	        if(user.get('accountType') !== 'admin'){
	            _this.transitionTo('/404');
	        } else {
	            //Second tier auth (check admin table)
	            _this.store.findRecord('adminLogin', id).then((admin)=>{
								resolve(admin);
	                //found
	            },()=>{
	                //notfound
	                _this.transitionTo('/404');
	            });
	        }
			});
    },
    generateUid: function() {
        let _this = this;
        return new Promise(function(resolve, reject) {
            if(_this.get("session.currentUser")) {
                let provData = _this.get("session.currentUser").providerData[0];
                if(_this.get("session.provider") === "password") {
                    Ember.set(provData, '_uid', _this.get("session.currentUser").uid);
                } else {
                    Ember.set(provData, '_uid', _this.get("session.currentUser").providerData[0].uid);
                }
                resolve(_this.get("session"));
            } else {
                _this.get('session').close().then(()=> {
                    resolve(_this.get("session"));
                });
            }
        });
    },
});
