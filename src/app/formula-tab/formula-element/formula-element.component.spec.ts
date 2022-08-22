import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaElementComponent } from './formula-element.component';

describe('FormulaElementComponent', () => {
  let component: FormulaElementComponent;
  let fixture: ComponentFixture<FormulaElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
