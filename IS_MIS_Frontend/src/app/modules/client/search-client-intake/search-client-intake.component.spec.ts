import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchClientIntakeComponent } from './search-client-intake.component';

describe('SearchClientIntakeComponent', () => {
  let component: SearchClientIntakeComponent;
  let fixture: ComponentFixture<SearchClientIntakeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchClientIntakeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchClientIntakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
