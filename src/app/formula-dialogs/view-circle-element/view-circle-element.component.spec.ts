import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCircleElementComponent } from './view-circle-element.component';

describe('ViewCircleElementComponent', () => {
  let component: ViewCircleElementComponent;
  let fixture: ComponentFixture<ViewCircleElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCircleElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCircleElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
