import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchClientMseComponent } from './search-client-mse.component';

describe('SearchClientMseComponent', () => {
  let component: SearchClientMseComponent;
  let fixture: ComponentFixture<SearchClientMseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchClientMseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchClientMseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
