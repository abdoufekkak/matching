import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccuilleComponent } from './accuille/accuille.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChercherComponent } from './chercher/chercher.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: 'chat', component: ChatComponent },
      { path: 'accueil', component: AccuilleComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'chercher', component: ChercherComponent },

    ],
  },


  { path: '**', redirectTo: 'chat' }, // Rediriger vers /chat par défaut
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
