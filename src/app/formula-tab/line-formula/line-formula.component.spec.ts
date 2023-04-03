import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineFormulaComponent } from './line-formula.component';

describe('LineFormulaComponent', () => {
  let component: LineFormulaComponent;
  let fixture: ComponentFixture<LineFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
