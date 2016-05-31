import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'img',
    attributeBindings:['src'],
    src: null,
    didInsertElement: function(){
        var _this = this;
        this.$().on('load', function(evt){
            return _this.imageLoaded(evt);
        }).on('error', function(evt){
            return _this.imageError(evt);
        });
    },
    willDestroyElement: function(){
        this.$().off('load', 'error');
    },
    imageLoaded: function(event){
    	this.sendAction('loadedImg');
        console.log("loaded the image didn't I! - 1");
    },
    imageError: function(event){
        //console.log("there was an error wasn't there! - 1");
    }
});