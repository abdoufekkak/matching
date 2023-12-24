import { Injectable } from "@angular/core";
import { Login } from "./model/login";
import { HttpClient } from "@angular/common/http";
import { api } from "../api";

@Injectable({
  providedIn:"root"

})
export class AuthService {

  constructor(private Http:HttpClient){
  }
  login(login:Login){
    return this.Http.post(api+'/client/login',{username :login.username.toString()})

  }
}
