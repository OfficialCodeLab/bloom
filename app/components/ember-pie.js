import Ember from 'ember';

const EmberPieComponent = Ember.Component.extend({
	chartData: [],
  	storeName: '',
  	budgetTotal: 0,
  	budgetUsed: 0,

	willInsertElement: function(){
		this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
        let _id = this.get('userid');
        let wedding = store.peekRecord('wedding', _id);
        let bTotal = wedding.get('budgetTotal');
        let bUsed = wedding.get('budgetUsed');
        if(bTotal === null){
        	bTotal = 0;
        	wedding.set('budgetTotal', 0);
        }
        if(bUsed === null){
        	bUsed = 0;
        	wedding.set('budgetUsed', 0);
        }

        this.set('budgetTotal', bTotal);
        this.set('budgetUsed', bUsed);
    	wedding.save();

        this.set('chartData', Ember.A([
			{
		        value: this.get('budgetTotal') - this.get('budgetUsed'),
		        color: "#808080",
		        highlight: "#9E9E9E",
		        label: "Remaining"
		    }, 
		    {
		        value: this.get('budgetUsed'),
		        color: "#F48FB1",
		        highlight: "#F8BBD0",
		        label: "Used"
		    }
    	]));
		this.sendAction('storePieDataRef', this.get('chartData'));   	
		
	},
});

EmberPieComponent.reopenClass({
  positionalParams: ['userid']
});

export default EmberPieComponent;