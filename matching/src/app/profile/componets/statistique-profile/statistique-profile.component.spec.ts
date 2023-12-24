import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueProfileComponent } from './statistique-profile.component';

describe('StatistiqueProfileComponent', () => {
  let component: StatistiqueProfileComponent;
  let fixture: ComponentFixture<StatistiqueProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatistiqueProfileComponent]
    });
    fixture = TestBed.createComponent(StatistiqueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
