import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'img',
    attributeBindings:['src'],
    src: null,
    didInsertElement: function(){
        var _this = this;
        if (this.get('src')) {
            this.$().on('load', function(evt){
                return _this.imageLoaded(evt);
            }).on('error', function(evt){
                return _this.imageError(evt);
            });  
        } else {    
            return this.imageError();      
        }
        //this.sendAction('loadedImg');
    },
    willDestroyElement: function(){
        this.$().off('load', 'error');
    },
    imageLoaded: function(event){
    	this.sendAction('loadedImg');
        //console.log("loaded the image didn't I! - 1");
    },
    imageError: function(event){
        this.set('src', "placeholder-square.png");
        this.sendAction('loadedImg');
        this.sendAction('errorImg');
        console.log("Image unable to load, used placeholder.");
        //console.log(this.get('src'));
    }
});