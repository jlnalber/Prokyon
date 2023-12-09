import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompiledPointFormulaComponent } from './compiled-point-formula.component';

describe('CompiledPointFormulaComponent', () => {
  let component: CompiledPointFormulaComponent;
  let fixture: ComponentFixture<CompiledPointFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompiledPointFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompiledPointFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
