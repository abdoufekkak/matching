import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosterPostesComponent } from './poster-postes.component';

describe('PosterPostesComponent', () => {
  let component: PosterPostesComponent;
  let fixture: ComponentFixture<PosterPostesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosterPostesComponent]
    });
    fixture = TestBed.createComponent(PosterPostesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
