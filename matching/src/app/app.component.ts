import { Component,OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from 'ngx-socket-io';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'matching';

  constructor(public socket:Socket,private snackBar: MatSnackBar){}
  
  ngOnInit(): void {
    this.socket.on("videoenvoi",(data:any)=>{
this.openCustomToast(data)
    })
  }

  
  openCustomToast(data:any) {
    this.snackBar.openFromComponent(CustomToastComponent, {
      data:data,
      duration: 3000, // Durée d'affichage du toast en millisecondes
    });
  }
}

