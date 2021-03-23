import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryAssistanceComponent } from './query-assistance.component';

describe('QueryAssistanceComponent', () => {
  let component: QueryAssistanceComponent;
  let fixture: ComponentFixture<QueryAssistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryAssistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
