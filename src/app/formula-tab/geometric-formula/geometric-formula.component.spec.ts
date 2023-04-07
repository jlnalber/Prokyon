import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometricFormulaComponent } from './geometric-formula.component';

describe('LineFormulaComponent', () => {
  let component: GeometricFormulaComponent;
  let fixture: ComponentFixture<GeometricFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeometricFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeometricFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
