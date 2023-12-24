import { Component ,HostListener,OnInit,ViewChild,ElementRef,Renderer2} from '@angular/core';
import { PostService } from '../profile/service/post.service';
import { User } from '../chat/model/user.model';
import { UserService } from '../chat/service/user.service';

@Component({
  selector: '[mon-attribut="post"]',
  templateUrl: './accuille.component.html',
  styleUrls: ['./accuille.component.scss']
})
export class AccuilleComponent implements  OnInit{

  invits!:User[];
  id_sender!:number
  @ViewChild('monDiv', { static: true }) monDiv!: ElementRef;

  constructor(private servicepost:PostService,private serviceuser:UserService,private renderer: Renderer2){
    this.id_sender = parseInt(localStorage.getItem('idUser') as string, 10);

  }

  ngOnInit(): void {
    this.servicepost.getInvitation(this.id_sender).subscribe(e=>this.invits=e,);
    // this.renderer.listen(this.monDiv.nativeElement, 'scroll', (event) => {
    //   // Fonction de gestion de l'événement de défilement
    //   alert('Div a été défilé');
    // });
  }
    
  
  @HostListener("qwert", ["$event"])
cc(event: Event) {
  alert("ok");
}

accepterinvite(user_id: number) {
 
  this.serviceuser.accepterinvit(this.id_sender, user_id).subscribe(
    (data) => {
      let index = this.invits.findIndex(objet => objet.id === user_id);
          // Vérifier si l'index a été trouvé (différent de -1)
          if (index !== -1) {
            // Supprimer l'objet à l'index trouvé
            this.invits.splice(index, 1);
          }    },
    (error) => {
      console.log(error)
    }
  );
  }
  refuse(user_id: number) {
 
    this.serviceuser.refus_invit(this.id_sender, user_id).subscribe(
      (data) => {
        let index = this.invits.findIndex(objet => objet.id === user_id);
            // Vérifier si l'index a été trouvé (différent de -1)
            if (index !== -1) {
              // Supprimer l'objet à l'index trouvé
              this.invits.splice(index, 1);
            }    },
      (error) => {
        console.log(error)
      }
    );
    }
}
