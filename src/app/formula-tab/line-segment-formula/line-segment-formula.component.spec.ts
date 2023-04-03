import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSegmentFormulaComponent } from './line-segment-formula.component';

describe('LineSegmentFormulaComponent', () => {
  let component: LineSegmentFormulaComponent;
  let fixture: ComponentFixture<LineSegmentFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineSegmentFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSegmentFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
