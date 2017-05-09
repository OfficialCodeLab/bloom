import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function() {
        let _this = this;
        var sesh = this.get("session").fetch().catch(function() {});
        if(!this.get('session.isAuthenticated')){
            this.transitionTo('login');
        }

        //Filthy hackaround for password authentication ;)

        return sesh.then((s)=> {
            console.log(_this.get('session'));
            if(!_this.get('session.isAuthenticated')){
            } else {
                return _this.generateUid().then((session)=>{
                    _this.checkAuthentication();
                    return session;
                });

            }
        });
    },
    checkAuthentication: function() {
        //First tier authentication:
        let id = this.get("session").get('currentUser').providerData[0]._uid;
        let user = this.store.peekRecord('user', id);
        if(user.get('accountType') !== 'admin'){
            this.transitionTo('/404');
        } else {
            //Second tier auth (check admin table)
            this.store.findRecord('adminLogin', id).then(()=>{
                //found
            },()=>{
                //notfound
                this.transitionTo('/404');
            });
        }
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
