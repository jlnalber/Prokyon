import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaTabComponent } from './formula-tab.component';

describe('FormelEditorComponent', () => {
  let component: FormulaTabComponent;
  let fixture: ComponentFixture<FormulaTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
