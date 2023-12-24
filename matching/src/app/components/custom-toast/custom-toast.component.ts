import { MatDialog } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogvideoComponent } from 'src/app/chat/components/dialogvideo/dialogvideo.component';
declare var apiRTC: any;

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.scss']
})
export class CustomToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public dialog: MatDialog) { 
  }
  afficher() {
    console.log("o")
    this.openvideo(3);
  }

  openvideo(id: number): void {
    const dialogRef = this.dialog.open(DialogvideoComponent, {
      data:this.data , 
      width: '70%',
      height: '80%',
      // data is a data that we send to the dialog
    });
  }
  getOrcreateConversation() {
    var localStream:any = null;

    //==============================
    // 1/ CREATE USER AGENT
    //==============================
    var ua = new apiRTC.UserAgent({
      uri: 'apzkey:myDemoApiKey'
    });

    //==============================
    // 2/ REGISTER
    //==============================
    ua.register().then((session:any) => {

      //==============================
      // 3/ CREATE CONVERSATION
      //==============================
      const conversation = session.getConversation(this.data.video_id);

      //==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      //==========================================================
      conversation.on('streamListChanged', (streamInfo: any) => {
        console.log("streamListChanged :", streamInfo);
        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {
            conversation.subscribeToMedia(streamInfo.streamId)
              .then((stream:any) => {
                console.log('subscribeToMedia success');
              }).catch((err:any) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      //=====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
      //=====================================================
      conversation.on('streamAdded', (stream: any) => {
        stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
      }).on('streamRemoved', (stream: any) => {
        stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
      });

      //==============================
      // 5/ CREATE LOCAL STREAM
      //==============================
      ua.createStream({
        constraints: {
          audio: true,
          video: true
        }
      })
        .then((stream: any) => {

          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media', {}, true);

          //==============================
          // 6/ JOIN CONVERSATION
          //==============================
          conversation.join()
            .then((response: any) => {
              //==============================
              // 7/ PUBLISH LOCAL STREAM
              //==============================
              conversation.publish(localStream);
            }).catch((err:any) => {
              console.error('Conversation join error', err);
            });

        }).catch((err:any) => {
          console.error('create stream error', err);
        });
    });
  }

  showCallNotification() {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const notification = new Notification('Appel entrant', {
            body: 'Appel en cours...',
            icon: 'chemin-vers-votre-icone.png' // Remplacez par le chemin de votre icône
          });

          notification.onclick = () => {
            // Gérer l'action lorsque l'utilisateur clique sur la notification
          };
        }
      });
    }}
}

