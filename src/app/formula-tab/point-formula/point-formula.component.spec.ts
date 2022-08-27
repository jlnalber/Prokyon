import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointFormulaComponent } from './point-formula.component';

describe('PointFormulaComponent', () => {
  let component: PointFormulaComponent;
  let fixture: ComponentFixture<PointFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
