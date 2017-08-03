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
	},
  removeMainImage: function(file, done){
    var mainImg = document.getElementById('image-preview');
    mainImg.src = null;
  },

  storeMainImage: function(file, done){
      let _this = this;
      let _file = file;
      let reader = new FileReader();

      reader.onloadend = Ember.run.bind(this, function(){
        var dataURL = reader.result;
        var mainImg = document.getElementById('image-preview');
        var canvas = document.createElement('canvas');
        mainImg.src = dataURL;
        var int32View = new Int32Array(dataURL);
        var mimeType;
        switch(int32View[0]) {
            case 1196314761:
                mimeType = "image/png";
                break;
            case 944130375:
                mimeType = "image/gif";
                break;
            case 544099650:
                mimeType = "image/bmp";
                break;
            case -520103681:
                mimeType = "image/jpg";
                break;
            default:
                mimeType = "unknown";
                break;
        }
        mainImg.onload = function() {
          var MAX_WIDTH = 1000;
          var MAX_HEIGHT = 1200;
          var width = this.width;
          var height = this.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
              sizeExceeds(this, width, height);
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
              sizeExceeds(this, width, height);
            }
          }

          function sizeExceeds(that, width, height) {
              var imageCompressor = new ImageCompressor();

              var compressorSettings = {
                  toWidth : width,
                  toHeight : height,
                  mimeType : mimeType,
                  mode : 'strict',
                  quality : 0.6,
                  speed : 'low'
              };

              imageCompressor.run(that.src, compressorSettings, proceedCompressedImage);

              function proceedCompressedImage (compressedSrc) {
                that.src = compressedSrc;
              }
          }

        };
      });
       //debugger;
      reader.readAsDataURL(file);
   //debugger;
  }
});
