import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../model/post.model';
import { PostService } from '../../service/post.service';

@Component({
  selector: 'app-postes',
  templateUrl: './postes.component.html',
  styleUrls: ['./postes.component.scss'],
})
export class PostesComponent implements OnInit {
  @Input() posts!: Post[];
  id_sender!: number;

  constructor(private postService: PostService) {
    this.id_sender = parseInt(localStorage.getItem('idUser') as string, 10);
  }

  ngOnInit() {
    // Fetch posts from the backend API using your PostService
    this.postService.GetAllpost(this.id_sender).subscribe((data: Post[]) => {
      this.posts = data;
    });
  }

  likePost(post: Post) {
    this.postService.reactPost(post.id || -1, this.id_sender).subscribe(
      (response) => {
        console.log(response);
        post.nbr_like++;
      },
      (error) => console.log(error)
    );
  }
}
