import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphFormulaComponent } from './graph-formula.component';

describe('FormelComponent', () => {
  let component: GraphFormulaComponent;
  let fixture: ComponentFixture<GraphFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
