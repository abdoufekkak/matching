import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/user.model';
import { api } from 'src/app/api';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }


  getamis (id_sender : number) :Observable<User[]> {
  return  this.http.get<User[]>(`${api}/client/amis/`+id_sender)
  }

  accepterinvit(friend_id:number,user_id:number){
    return this.http.post(`${api}/client/accepter/`,{friend_id,user_id})
  }
  refus_invit(friend_id:number,user_id:number){
    return this.http.post(`${api}/client/refus_invit/`,{friend_id,user_id})
  }
  rechercher(id:number){
    
    return this.http.get<User[]>(`${api}/client/inviter/${id}`)
  }

  envoyerinvit(relation:any){
    return this.http.post<any>(`${api}/client/envoiInvita`,relation)
  }
}
