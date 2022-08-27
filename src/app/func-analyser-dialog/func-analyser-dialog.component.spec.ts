import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncAnalyserDialogComponent } from './func-analyser-dialog.component';

describe('FuncAnalyserDialogComponent', () => {
  let component: FuncAnalyserDialogComponent;
  let fixture: ComponentFixture<FuncAnalyserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FuncAnalyserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FuncAnalyserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
