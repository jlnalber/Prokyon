import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariableFormulaComponent } from './variable-formula.component';

describe('VariableFormulaComponent', () => {
  let component: VariableFormulaComponent;
  let fixture: ComponentFixture<VariableFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariableFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariableFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
