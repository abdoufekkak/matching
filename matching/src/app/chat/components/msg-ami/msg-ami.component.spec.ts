import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgAmiComponent } from './msg-ami.component';

describe('MsgAmiComponent', () => {
  let component: MsgAmiComponent;
  let fixture: ComponentFixture<MsgAmiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MsgAmiComponent]
    });
    fixture = TestBed.createComponent(MsgAmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
