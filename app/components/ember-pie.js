import Ember from 'ember';

const EmberPieComponent = Ember.Component.extend({
	chartData: [],
  	storeName: '',

	willInsertElement: function(){
		this.set('storeName', this.get('targetObject.store'));
        let store = this.get('storeName');
        let _id = this.get('userid');
        let budget = store.peekRecord('budget', _id);
        let total = parseInt(budget.get('total'));
        let used = parseInt(budget.get('used'));
        let categoryTotals = budget.get('categoryTotals');
        let _apparel = parseInt(Ember.get(categoryTotals, 'categoryApparel'));
        let _people = parseInt(Ember.get(categoryTotals, 'categoryPeople'));
        let _event = parseInt(Ember.get(categoryTotals, 'categoryEvent'));
        let _places = parseInt(Ember.get(categoryTotals, 'categoryPlaces'));
        let _additional = parseInt(Ember.get(categoryTotals, 'categoryAdditional'));
        let unallocated = parseInt(budget.get('unallocated'));
        let unspent = total - unallocated - used;
        

        // if(bTotal > 1){
        // 	wedding.set('hasBudget', true);
        // } else if (bTotal <= 0){
        // 	wedding.set('hasBudget', false);
        // 	wedding.set('budgetTotal', 0);

        // } else if (bTotal === null){
        // 	bTotal = 0;
        // 	wedding.set('budgetTotal', 0); 
        // 	wedding.set('hasBudget', false);       	
        // }

        // if(bUsed === null){
        // 	bUsed = 0;
        // 	wedding.set('budgetUsed', 0);
        // } else if (bUsed < 0){
        // 	bUsed = 0;
        // 	wedding.set('budgetUsed', 0);        	
        // }

     //    this.set('budgetTotal', bTotal);
     //    this.set('budgetUsed', bUsed);
    	// wedding.save();

        this.set('chartData', Ember.A([
			{
		        value: unallocated,
		        color: "#3D4957",
		        highlight: this.colorLuminance("3D4957", 0.2),
		        label: "Unallocated"
		    }, 
		    {
		        value: unspent,
		        color: "#808080",
		        highlight: this.colorLuminance("808080", 0.2),
		        label: "Unspent"
		    }, 
            //EACH CATEGORY
            {
                value: _apparel,
                color: "#C65186",
                highlight: this.colorLuminance("C65186", 0.2),
                label: "Apparel"
            }, 
            {
                value: _people,
                color: "#C9278C",
                highlight: this.colorLuminance("C9278C", 0.2),
                label: "Contractors"
            }, 
            {
                value: _event,
                color: "#E47296",
                highlight: this.colorLuminance("E47296", 0.2),
                label: "Event"
            }, 
            {
                value: _places,
                color: "#AA0114",
                highlight: this.colorLuminance("AA0114", 0.2),
                label: "Places"
            }, 
            {
                value: _additional,
                color: "#8C3A62",
                highlight: this.colorLuminance("8C3A62", 0.2),
                label: "Additional"
            }
    	]));
		this.sendAction('storePieDataRef', this.get('chartData'));   	
		
	},
    colorLuminance: function (hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}
});

EmberPieComponent.reopenClass({
  positionalParams: ['userid']
});

export default EmberPieComponent;