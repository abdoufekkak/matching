import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { User } from '../../model/user.model';

@Component({
  selector: '[mon-attribut="app-msg-ami"]',
  templateUrl: './msg-ami.component.html',
  styleUrls: ['./msg-ami.component.scss'],
})
export class MsgAmiComponent implements OnInit {
  @Input() amis!: User[];
  @Output() valueEmitted = new EventEmitter<number>();

  constructor() {}
  ngOnInit(): void {}
  selectmi(id?: number) {
    if (id) {
      this.valueEmitted.emit(id);
    }
  }
}
