import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPsychometryComponent } from './client-psychometry.component';

describe('ClientPsychometryComponent', () => {
  let component: ClientPsychometryComponent;
  let fixture: ComponentFixture<ClientPsychometryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPsychometryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPsychometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
