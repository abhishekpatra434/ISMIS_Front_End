import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientMedicationComponent } from './client-medication.component';

describe('ClientMedicationComponent', () => {
  let component: ClientMedicationComponent;
  let fixture: ComponentFixture<ClientMedicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMedicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
