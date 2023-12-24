import { Component, OnInit } from '@angular/core';
import { StatisticService } from '../../service/statistic.service';

@Component({
  selector: 'app-statistique-profile',
  templateUrl: './statistique-profile.component.html',
  styleUrls: ['./statistique-profile.component.scss']
})
export class StatistiqueProfileComponent implements OnInit {
  statics!: any;
  id_user!: number;

  constructor(

    private satsService: StatisticService
  ) {}
  ngOnInit(): void {
    this.id_user = parseInt(localStorage.getItem('idUser') as string, 10);
    if (this.id_user)
    this.satsService.GetStatistics(this.id_user).subscribe((data : any) => {
      this.statics =  data
    })
    }

}
