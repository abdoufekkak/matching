import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api2 } from 'src/app/api';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  constructor(private http: HttpClient) {}

  GetStatistics(id: number): Observable<any> {
    return this.http.get<any>(`${api2}/statics/`+id);
  }

}
