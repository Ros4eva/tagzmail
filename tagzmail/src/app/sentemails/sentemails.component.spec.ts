import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentemailsComponent } from './sentemails.component';

describe('SentemailsComponent', () => {
  let component: SentemailsComponent;
  let fixture: ComponentFixture<SentemailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentemailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentemailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
