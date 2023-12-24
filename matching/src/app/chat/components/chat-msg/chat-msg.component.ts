import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Renderer2,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { MessageType, message } from '../../model/msg.model';
import { forkJoin } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { MsgService } from '../../service/msg.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { concatMap, map } from 'rxjs';
import { DialogOverviewExampleDialog } from './dialog/dialog.component';
import { User } from '../../model/user.model';
import { DialogvideoComponent } from '../dialogvideo/dialogvideo.component';

@Component({
  selector: '[mon-attribut="app-chat-msg"]',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss'],
})
export class ChatMsgComponent implements OnInit, OnChanges {
  @Input() msgs!: message[];
  @Input() amis!: User[];
  @Input() id_recever!: number;
  @Input() id_sender!: number;
  isrecord: boolean = false;
  dateJour: any;
  hoverIndex: number | null = null;
  foc: boolean = true;
  @Output() valueEmitted = new EventEmitter<MessageType>();
  msg: message = new message();
  content!: string;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];

  constructor(
    public dialog: MatDialog,
    private socket: Socket,
    private service: MsgService,
    public http: HttpClient,
  ) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };
      })
      .catch((e) => console.log(e, 'Asdfg'));
  }

  startRecording() {
    this.audioChunks = [];
    this.mediaRecorder.start();
  }
  saveRecording() {
    if (this.audioChunks.length > 0) {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/ogg' });
      const formData = new FormData();
      formData.append('audioFile', audioBlob, 'audio.ogg');

      this.http.post('http://localhost:3000/upload-audio', formData).subscribe(
        (response) => {
          this.socket.emit('audio', { receiver_id: 1, url_audio: response });
        },
        (error) => {
          console.error(error);
        }
      );
    }
    this.isrecord = false;
  }
  ngOnInit(): void {
    this.socket.on('msgenvoyer', (mess: message) => {
      console.log('msgenvoyer');

      this.msgs.push(mess);

      // this.messages.push(message);
    });
    this.socket.on('audio_envoyer', (mess: message) => {
      this.msgs.push(mess);

      // this.messages.push(message);
    });
    this.socket.on('msgdelete', (id: number) => {
      console.log('msgdelete');

      this.msgs.splice(id, 1);
    });
    this.socket.emit('join chat', this.id_sender);
  }
  // isMessageTypeText(msg: message): boolean {
  //   return msg.message_type ==="";
  // }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['msgs']) {
      setTimeout(() => {
        this.n();
      }, 100);
    }
  }
  n() {
    // Récupérez le conteneur avec débordement
    const container = this.scrollContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  stopRecording() {
    this.mediaRecorder.stop();
  }
  sendMessage() {
    // alert(this.audioChunks.length)

    if (this.content) {
      this.msg.receiver_id = this.id_recever;
      this.msg.sender_id = this.id_sender;
      this.msg.send_date = new Date();
      this.msg.content = this.content;
      this.msg.contry_msg = 'maroc';
      this.msg.message_type = 'Text';

      ////requete
      console.log(this.msgs);

      this.service.setMsg(this.msg).subscribe((e) => {
        this.msgs.push(e);
        this.socket.emit('message', this.msg);
        // this.n();
        this.msg = new message();
        this.content = '';
      });
    } else {
      if (this.isrecord) {
        this.mediaRecorder.stop();
        setTimeout(() => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/ogg' });
          const formData = new FormData();
          formData.append('audioFile', audioBlob, 'audio.ogg');
          this.service
            .envpyerfile(formData)
            .pipe(
              concatMap((value) => {
                const messageData = {
                  sender_id: this.id_sender,
                  receiver_id: this.id_recever,
                  content: value,
                  send_date: new Date(),
                  message_type: 'Audio',
                  contry_msg: 'maroc',
                };

                return this.service.setMsg(messageData);
              })
            )
            .subscribe(
              (response) => {
                console.log(response);
                this.msgs.push(response);
                this.socket.emit('audio', response);
                this.isrecord = false;
              },
              (error) => {
                console.log(error);
              }
            );
        }, 200);
      } else {
        this.startRecording();
        this.isrecord = true;
      }
    }
  }
  // focu() {
  //   this.foc = !this.foc;
  // }
  deleteMessage(type: string, id: number | undefined, i: number) {
    if (id) {
      if (type == 'me') {
        this.service.dlete_for_me(id).subscribe(
          () => {
            this.msgs.splice(i, 1);
            console.log('Message supprimé avec succès');
          },
          (error) => {
            console.error('Erreur lors de la suppression du message : ', error);
          }
        );
      } else if (type == 'all') {
        this.service.dlete_for_all(id).subscribe(
          () => {
            this.msgs.splice(i, 1);
            const data = { receiver_id: this.id_recever, id: i };
            this.socket.emit('delete', data);
            console.log('Message supprimé for all avec succès');
          },
          (error) => {
            console.error(
              'Erreur lors de la suppression du message for all : ',
              error
            );
          }
        );
      }
    }
  }
  survolerElement(index: number) {
    this.hoverIndex = index;
  }

  // Fonction pour gérer l'événement mouseleave
  quitterElement() {
    this.hoverIndex = null;
  }
  openDialog(msg: message): void {
    this.msg = msg;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: this.amis, // data is a data that we send it to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
      console.log('The dialog was closed', result);
      for (const user of result) {
        const msage : message = new message()
        msage.sender_id = this.id_sender;
        msage.receiver_id = user.id;
        msage.send_date = new Date();
        msage.message_type= this.msg.message_type;
        msage.contry_msg=  this.msg.contry_msg;
        msage.content=  this.msg.content;
        console.log(user.id)
        this.service.setMsg(msage).subscribe((e) => {
          console.log("ffd",msage.receiver_id,this.id_recever)

          if(msage.receiver_id == this.id_recever){
            console.log("ff",this.msgs)
            this.msgs.push(this.msg);
            console.log("ffs",this.msgs)
          }
          this.socket.emit('message',msage);
          console.log(e,user)
        });
      }
    }else{
      console.log('no  dialog result');
    }
    });
  }

  openvideo(id: number): void {
    const dialogRef = this.dialog.open(DialogvideoComponent, {
      data: this.id_recever, 
      width: '70%',
      height:"80%",
      // data is a data that we send it to the dialog
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if(result){
    //   console.log('The dialog was closed', result);
    //   for (const user of result) {
    //     const msage : message = new message()
    //     msage.sender_id = this.id_sender;
    //     msage.receiver_id = user.id;
    //     msage.send_date = new Date();
    //     msage.message_type= this.msg.message_type;
    //     msage.contry_msg=  this.msg.contry_msg;
    //     msage.content=  this.msg.content;
    //     console.log(user.id)
    //     this.service.setMsg(msage).subscribe((e) => {
    //       console.log("ffd",msage.receiver_id,this.id_recever)

    //       if(msage.receiver_id == this.id_recever){
    //         console.log("ff",this.msgs)
    //         this.msgs.push(this.msg);
    //         console.log("ffs",this.msgs)
    //       }
    //       this.socket.emit('message',msage);
    //       console.log(e,user)
    //     });
    //   }
    // }else{
    //   console.log('no  dialog result');
    // }
    // });
  }
  handleProfilePictureInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.files) {
      const files = inputElement.files;

      if (files.length > 0) {
        const formData = new FormData();
        formData.append('imageFile', files[0]);

        this.service.sendImage(formData).pipe(
          concatMap((value) => {
            const messageData = {
              sender_id: this.id_sender,
              receiver_id: this.id_recever,
              content: value,
              send_date: new Date(),
              message_type: 'image',
              contry_msg: 'maroc',
            };

            return this.service.setMsg(messageData);
          })
        )
        .subscribe(
          (response) => {
            console.log("dd",response);
            this.msgs.push(response);
            this.socket.emit('message', response);
          },
          (error) => {
            console.log(error);
          }
        )
      }
    }
  }



}
