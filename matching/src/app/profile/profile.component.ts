import { Component, OnInit, Input } from '@angular/core';
import { PostService } from './service/post.service';
import { Post } from './model/post.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  id_sender!: number;
  posts!: Post[];
  constructor(public servicePost: PostService) {}
  ngOnInit(): void {
    this.id_sender = parseInt(localStorage.getItem('idUser') as string, 10);
    this.servicePost.GetAllpost(this.id_sender).subscribe(
      (e) => (this.posts = e),
      (err) => console.log(err)
    );
  }
  ajouterPost(post : any){
   const pot = this.posts
   this.posts=[post,...pot]
  }
}
