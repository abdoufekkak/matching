import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogvideoComponent } from './dialogvideo.component';

describe('DialogvideoComponent', () => {
  let component: DialogvideoComponent;
  let fixture: ComponentFixture<DialogvideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogvideoComponent]
    });
    fixture = TestBed.createComponent(DialogvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
