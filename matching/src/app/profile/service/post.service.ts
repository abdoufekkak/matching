import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Post } from '../model/post.model';
import { api, api2 } from 'src/app/api';
import { User } from 'src/app/chat/model/user.model';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  GetAllpost(id: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${api2}/profile/` + id);
  }
  GetAllposts(id: number,last_post_date:number): Observable<Post[]> {
    const params = { id: id.toString(), last_post_date: last_post_date.toString() };
    return this.http.get<Post[]>(`${api2}/profile/all` , { params });
  }
  reactPost(id: number, id_user: number) {
    return this.http.post(`${api2}/profile/react/${id}`, {
      id_post: id,
      id_user,
    });
  }
  createPost(post: Post) {
    console.log('post: ' + post);

    return this.http.post(`${api2}/profile/`, post);
  }
  deletePost(id: number) {
    return this.http.delete(`${api2}/profile/${id}`);
  }
  sendPost(formData:any) {
    console.log("send image to folder")
    return   this.http.post('http://localhost:3001/upload-image-post', formData)
  }

  getInvitation(id:number) :Observable<User[]> {
    return this.http.get<User[]>(`${api}/client/invite/${id}`);

  }
}
