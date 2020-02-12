import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBmiDataComponent } from './client-bmi-data.component';

describe('ClientBmiDataComponent', () => {
  let component: ClientBmiDataComponent;
  let fixture: ComponentFixture<ClientBmiDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBmiDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBmiDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
