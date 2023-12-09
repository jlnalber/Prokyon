import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurveElementComponent } from './view-curve-element.component';

describe('ViewCurveElementComponent', () => {
  let component: ViewCurveElementComponent;
  let fixture: ComponentFixture<ViewCurveElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCurveElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCurveElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
