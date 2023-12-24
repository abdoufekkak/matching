import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChatComponent } from './chat/chat.component';
import { MsgAmiComponent } from './chat/components/msg-ami/msg-ami.component';
import { ChatMsgComponent } from './chat/components/chat-msg/chat-msg.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccuilleComponent } from './accuille/accuille.component';
import { ProfileComponent } from './profile/profile.component';
import { MatIconModule } from '@angular/material/icon';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { host } from './api';
import { StatistiqueProfileComponent } from './profile/componets/statistique-profile/statistique-profile.component';
import { PosterPostesComponent } from './profile/componets/poster-postes/poster-postes.component';
import { PostesComponent } from './profile/componets/postes/postes.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ChercherComponent } from './chercher/chercher.component';
import { AllpostComponent } from './allpost/allpost.component';
import { ScrollDirective } from './scroll.directive';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { DialogvideoComponent } from './chat/components/dialogvideo/dialogvideo.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { MatCardModule } from '@angular/material/card';

const config: SocketIoConfig = { url: `http://${host}:3000`, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ChatComponent,
    MsgAmiComponent,
    ChatMsgComponent,
    AccuilleComponent,
    ProfileComponent,
    LoginComponent,
    StatistiqueProfileComponent,
    PosterPostesComponent,
    PostesComponent,
    ChercherComponent,

    AllpostComponent,
    ScrollDirective,
    DialogvideoComponent,
    CustomToastComponent
  ],
  imports: [
    MatButtonModule,
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SocketIoModule.forRoot(config),FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
