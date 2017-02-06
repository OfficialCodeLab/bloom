import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
	model(){		
		let _id = this.get("session").get('currentUser').providerData[0].uid + "";
		return this.store.findRecord('wedding', _id);	
	},
	actions: {
		allClick: function(){
			this.controller.set('viewAll', true);
		},
		incompleteClick: function(){
			this.controller.set('viewAll', false);

		},
		checkBox: function(id){
			let task = this.store.peekRecord('task', id);
			let status;
			let completed = task.get('completed');
			if(completed){
				completed = false;
				status = "incomplete.";
			} else {
				completed = true;
				status = "complete.";
			}
			task.set('completed', completed);
			task.save().then(()=>{					
				this.controller.get('notifications').success('Task has been marked as ' + status,{
					autoClear: true
				});							
			});
		},
		destroyTask: function(id){
			let _modalData;
			this.controller.set('taskId', id);
			if(this.controller.get('modalDataId')){
				_modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
				_modalData.set('mainMessage', 'Do you want to remove this task?');	
				_modalData.set('action', 'delete');	
            	this.send('showModal', 'modal-confirm', _modalData);	            	
            } else {
		    	let _modalData = this.store.createRecord('modal-data', {'mainMessage': 'Do you want to remove this task?', 'action': 'delete'});
		     	this.controller.set('modalDataId', _modalData.get('id'));
            	this.send('showModal', 'modal-confirm', _modalData);
            } 

		},
		ok: function() {
			let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
			switch(_modalData.get('action')) {
				case 'delete':					
					
			    	let _id = this.get("session").get('currentUser').providerData[0].uid + "";
					let wedding = this.store.peekRecord('wedding', _id);
					let taskId = this.controller.get('taskId');
					let task = this.store.peekRecord('task', taskId);
					this.controller.set('taskId', null);
					//Unassign task from wedding
    				wedding.get('tasks').removeObject(task);
    				wedding.save().then(()=>{
    					//Destroy the record
						task.deleteRecord();
						task.save().then(()=>{
							this.controller.get('notifications').info('Task has been deleted.',{
								autoClear: true
							});
	    				});
					});

					break;
			}

		},
		editTask: function(id){
    		let task = this.store.peekRecord('task', id); 
			this.send('openTodoModal', task);
			this.controller.set('todoEditId', id);
		},
		newTask: function(){
			let task = this.store.createRecord('task');
	    	// this.controller.set('taskCurrent', task);
	    	this.send('openTodoModal', task);
			this.controller.set('newTaskId', task.get('id'));
			// alert(this.controller.get('newTaskId'));
		},
		saveTodo: function(){
			if(this.controller.get('todoEditId')) {
				let taskId = this.controller.get('todoEditId');
					this.controller.set('todoEditId', null);
				let task = this.store.peekRecord('task', taskId);
				task.save().then(()=>{
	    			//Success notification
	    			this.controller.get('notifications').info('Task updated successfully!',{
					    autoClear: true
					});
	    		});  
			} else if (this.controller.get('newTaskId')) {
				let taskId = this.controller.get('newTaskId');
				this.controller.set('newTaskId', null);
				let task = this.store.peekRecord('task', taskId);
				// this.controller.set('isTodoSubmitted', true);
				let _id = this.get("session").get('currentUser').providerData[0].uid + "";
				let wedding = this.store.peekRecord('wedding', _id);
		    	//Set up creation date to confirm task has now been created
	    		let createdOn = moment().unix()*1000;
	    		task.set('createdOn', createdOn);
	    		//Set up belongsTo relationship
	    		task.set('createdBy', _id);
	    		//Save task
	    		task.save().then(()=>{
	    			//Set up hasMany relationship
	    			wedding.get('tasks').pushObject(task);
	    			wedding.save().then(()=>{
	    				//Success notification
	    				this.controller.get('notifications').success('Task created successfully!',{
						    autoClear: true
						});
	    			});
	    		});
			}

		}
	}
        
});