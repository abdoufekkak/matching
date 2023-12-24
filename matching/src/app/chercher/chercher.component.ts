import { Component, OnInit } from '@angular/core';
import { User } from '../chat/model/user.model';
import { UserService } from '../chat/service/user.service';

@Component({
  selector: 'app-chercher',
  templateUrl: './chercher.component.html',
  styleUrls: ['./chercher.component.scss']
})
export class ChercherComponent implements OnInit {

  users!:User[];
  userscher!:User[];

  id_sender!:number;
  inputValue!:string
  constructor(public serviceuser:UserService){
    this.id_sender = parseInt(localStorage.getItem('idUser') as string, 10);

  }
  onInputChange(){
    if(this.inputValue!=""){
      this.userscher = this.users.filter(obj => obj.username.toUpperCase().includes(this.inputValue.toUpperCase()));

    }else{
      this.serviceuser.rechercher(this.id_sender).subscribe(e=>{
        console.log(e);
        this.users=e
        this.userscher=e
      }
        ,err=>console.log(err))
    }
  }
  ngOnInit(): void {
    this.serviceuser.rechercher(this.id_sender).subscribe(e=>{
      console.log(e);
      this.users=e
      this.userscher=e
    }
      ,err=>console.log(err))
  }

  envoyerinvit(id?:number){
this.serviceuser.envoyerinvit({user_id:this.id_sender,friend_id:id,type_relation:"ami",is_accepted:false})
.subscribe(e=>{
  let index = this.users.findIndex(objet => objet.id === id);
  // Vérifier si l'index a été trouvé (différent de -1)
  if (index !== -1) {
    // Supprimer l'objet à l'index trouvé
    this.users.splice(index, 1);
  }}
  
  ,err=>console.log(err))
  }
}
