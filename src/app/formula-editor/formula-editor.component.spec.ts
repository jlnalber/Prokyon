import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaEditorComponent } from './formula-editor.component';

describe('FormelEditorComponent', () => {
  let component: FormulaEditorComponent;
  let fixture: ComponentFixture<FormulaEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
