import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyPointElementsFormulaComponent } from './dependency-point-elements-formula.component';

describe('DependencyPointElementFormulaComponent', () => {
  let component: DependencyPointElementsFormulaComponent;
  let fixture: ComponentFixture<DependencyPointElementsFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DependencyPointElementsFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyPointElementsFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
