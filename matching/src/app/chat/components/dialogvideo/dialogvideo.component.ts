import { Component,Inject ,OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../chat-msg/dialog/dialog.component';
import { Socket } from 'ngx-socket-io';
declare var apiRTC: any;

@Component({
  selector: 'app-dialogvideo',
  templateUrl: './dialogvideo.component.html',
  styleUrls: ['./dialogvideo.component.scss']
})

export class DialogvideoComponent implements OnInit {

constructor(    public dialogRef: MatDialogRef<DialogvideoComponent>,public socket:Socket ,    @Inject(MAT_DIALOG_DATA) public id:any,

  )
{

}
ngOnInit(){
if(this.id.video_id)
{
  this.getOrcreateConversation(this.id.video_id)
}
}
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(): void {
    // if (this.selectedUser) {
    //   console.log('Selected User:', this.selectedUser);
    //   this.dialogRef.close('this.selectedUser');
    // }
    // this.dialogRef.close();
  }
  onvide(){
    this.getOrcreateConversation()
  }
  
 getOrcreateConversation(id?:any) {
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
    const date=id||new Date().getTime()
    const conversation = session.getConversation(date+"");
    // alert(this.id)
    this.socket.emit("video",{receiver_id:this.id||-1,video_id:date})

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
}
