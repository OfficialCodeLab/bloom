import Ember from 'ember';

export default Ember.Route.extend({
  firebaseApp: Ember.inject.service(),
  model(params) {
      let _id = this.get("currentUser.uid") + "";

      return this.store.findRecord('user', _id);
  },
  setupController: function(controller, model) {
      this._super(controller, model);

      if (model.get("hasGender")) { // ATTEMPT TO FILL IN NAME
          if (model.get("isFemale")) {
              controller.set("name2", model.get("name"));
              if (model.get("spouse")) {
                  controller.set("name1", model.get("spouse"));
              }
          } else {
              controller.set("name1", model.get("name"));
              if (model.get("spouse")) {
                  controller.set("name2", model.get("spouse"));
              }
          }
      } else {
          controller.set("name2", model.get("name"));
          if (model.get("spouse")) {
              controller.set("name1", model.get("spouse"));
          }
      }

      if (model.get("email")) {
          controller.set("contact", model.get("email"));
      }

      this.store.findRecord("wedding", model.get("id")).then((wedding) => {
          if (wedding.get("weddingDate")) {
              let wd = moment(wedding.get("weddingDate")).format("MMMM Do YYYY - h:mm a");
              controller.set('date', wd);
              let before = moment(wedding.get("weddingDate")).subtract(3, 'months').format("Do MMMM YYYY");
              controller.set('info3', "Please RSVP before " + before);
          }

      });
  },
  actions: {

      ok: function() {
          let _modalData = this.store.peekRecord('modal-data', this.controller.get('modalDataId'));
          switch (_modalData.get('action')) {

              case 'sendInvites':
                  this.uploadAllFiles();
                  break;
          }
      },

      removeModal: function() {
          this.controller.set('sendingInvites', false);

          try {
              this.send('cancel');
          } catch (ex) {}
          this.disconnectOutlet({
              outlet: 'modal',
              parentView: 'application'
          });
      },
  },
  sendAllInvites: function(downloadURL) {
      let _id = this.get("currentUser.uid") + "";

      this.store.findRecord("wedding", _id).then((wedding) => {
          let detailsJSON = {
              'name1': this.controller.get('name1'),
              'name2': this.controller.get('name2'),
              'date': this.controller.get('date'),
              'addressL1': this.controller.get('addressL1'),
              'addressL2': this.controller.get('addressL2'),
              'contact': this.controller.get('contact'),
              'downloadURL': downloadURL,
              'templateId': '0'
          };
          // console.log(detailsJSON);
          wedding.get('guests').then((guests) => {
              if (guests.length > 0) {
                  if (guests.length <= 200) {
                      let list = this.store.createRecord('guest-list-sd', {
                          id: _id,
                          dateSent: moment() + "",
                          guestCount: guests.length,
                          details: detailsJSON,
                          completed: false,
                          errors: {}
                      });

                      list.save().then(() => {
                          this.controller.set('sendingInvites', false);
                          this.controller.get('notifications').info('Invites are being sent, please await email confirmation on completion.', {
                              autoClear: true
                          });
                      }).catch((e) => {
                          console.log(e.errors);
                          this.controller.set('sendingInvites', false);
                          this.controller.get('notifications').error('An unknown error occured, please contact support.', {
                              autoClear: true
                          });
                      });


                  } else {
                      this.controller.set('sendingInvites', false);
                      this.controller.get('notifications').warning('Your guest list exceeds your limit of 200 entries, please contact support to have this limit changed.', {
                          autoClear: true
                      });
                  }
              } else {
                  this.controller.set('sendingInvites', false);
                  this.controller.get('notifications').warning('You have no guests. Please fill out your guest list!', {
                      autoClear: true
                  });
              }
          });

      });


  },
  uploadAllFiles: function() {

      var mainImg = document.getElementById('image-preview');
      let mainI = this.decodeImage(mainImg);
      let _this = this;

      var metadata = {
          contentType: mainI.contentType
      };

      var storageRef = this.get('firebaseApp').storage().ref();
      let _id = this.get("currentUser.uid") + "";
      let user = this.store.peekRecord('user', _id);
      let itemId = 'save-date-custom';
      //PATH : userImages / id / invites / filename
      //Should locally store all variables
      var path = 'userImages/' + _id + '/invites/' + itemId;
      var uploadTask = storageRef.child(path).put(mainI.blob, metadata);

      uploadTask.on('state_changed', function(snapshot) {
          //PROGRESS
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          console.log(snapshot.state);
      }, function(error) {
          _this.controller.set('isCreating', false);
          _this.controller.get('notifications').error('There was a problem uploading your images, please try again.', {
              autoClear: true
          });
          //ERROR
      }, function() {
          //COMPLETE
          var downloadURL = uploadTask.snapshot.downloadURL;
          // alert(downloadURL);
          // console.log(downloadURL);
          // now run create function with downloadURL as param
          _this.sendAllInvites(downloadURL);

      });


  },
  b64toBlob: function(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          var slice = byteCharacters.slice(offset, offset + sliceSize);

          var byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          var byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, {
          type: contentType
      });
      return blob;
  },
  //Returns JSON struct with decoded blob, extension and content type
  decodeImage: function(image) {
      let blob = image.src;
      let _blob = blob.split(",", 2);
      let _metadata = _blob[0].split(';', 2);
      let fileType = _metadata[0].split(':', 2);
      let contentType = fileType[1];
      let __blob = this.b64toBlob(_blob[1]);
      let ext = fileType[1].split('/', 2);

      let decodedImage = {
          contentType: contentType,
          extension: ext[1],
          blob: __blob
      };

      return decodedImage;
  },
});
