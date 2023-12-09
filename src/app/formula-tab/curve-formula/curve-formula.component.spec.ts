import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurveFormulaComponent } from './curve-formula.component';

describe('CurveFormulaComponent', () => {
  let component: CurveFormulaComponent;
  let fixture: ComponentFixture<CurveFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurveFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurveFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
