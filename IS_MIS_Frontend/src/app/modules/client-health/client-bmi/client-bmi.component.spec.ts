import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientBmiComponent } from './client-bmi.component';

describe('ClientBmiComponent', () => {
  let component: ClientBmiComponent;
  let fixture: ComponentFixture<ClientBmiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientBmiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
