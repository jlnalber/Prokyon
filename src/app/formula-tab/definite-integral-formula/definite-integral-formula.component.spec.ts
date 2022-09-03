import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefiniteIntegralFormulaComponent } from './definite-integral-formula.component';

describe('DefiniteIntegralFormulaComponent', () => {
  let component: DefiniteIntegralFormulaComponent;
  let fixture: ComponentFixture<DefiniteIntegralFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefiniteIntegralFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefiniteIntegralFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
