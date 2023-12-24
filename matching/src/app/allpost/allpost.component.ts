import { Component, OnInit } from '@angular/core';
import { Post } from '../profile/model/post.model';
import { PostService } from '../profile/service/post.service';
import { ScrollService } from '../scroll.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-allpost',
  templateUrl: './allpost.component.html',
  styleUrls: ['./allpost.component.scss'],
})
export class AllpostComponent implements OnInit {
  Posts!: Post[];
  id_user!: number;
  last_post_date: number = -1;
  private scrollSubscription!: Subscription;

  constructor(
    private sercive: PostService,
    private scrollService: ScrollService
  ) {}
  ngOnInit(): void {
    this.id_user = parseInt(localStorage.getItem('idUser') as string, 10);
    this.sercive
      .GetAllposts(this.id_user, this.last_post_date)
      .subscribe((e) => {
        this.Posts = e.reverse();
        if (e.length > 0) {
          if (this.Posts[0].id) this.last_post_date = this.Posts[0].id;
        }
      });
    this.scrollSubscription = this.scrollService.onScroll().subscribe(() => {
      if (this.last_post_date < 4) {
         this.scrollSubscription.unsubscribe();
      } else {
        setTimeout(() => {

        this.sercive
        .GetAllposts(this.id_user, this.last_post_date)
        .subscribe((e) => {
          if (e.length > 0) {
            console.log("b",this.Posts)

          this.Posts = this.Posts.reverse().concat(e);
          console.log("bs",this.Posts)
          this.Posts = this.Posts.reverse()
          console.log("bssb",this.Posts,this.Posts[0].id)

              if (this.Posts[0].id) this.last_post_date = this.Posts[0].id;
            }
            this.Posts = this.Posts.reverse()
            console.log("bssbb",this.Posts)
          });
        },2000)
      }
    },err=>alert(err));
  }
  likePost(post: Post) {
    this.sercive.reactPost(post.id || -1, post.id_user).subscribe(
      (response) => {
        console.log(response);
        post.nbr_like++;
      },
      (error) => console.log(error)
    );
  }
}
