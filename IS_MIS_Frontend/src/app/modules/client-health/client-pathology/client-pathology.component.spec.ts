import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPathologyComponent } from './client-pathology.component';

describe('ClientPathologyComponent', () => {
  let component: ClientPathologyComponent;
  let fixture: ComponentFixture<ClientPathologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPathologyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPathologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
