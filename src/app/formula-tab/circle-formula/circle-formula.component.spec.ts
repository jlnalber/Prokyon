import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleFormulaComponent } from './circle-formula.component';

describe('CircleFormulaComponent', () => {
  let component: CircleFormulaComponent;
  let fixture: ComponentFixture<CircleFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
