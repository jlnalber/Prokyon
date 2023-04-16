import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDependencyPointElementsDialogComponent } from './view-dependency-point-elements-dialog.component';

describe('DependencyPointElementsDialogComponent', () => {
  let component: ViewDependencyPointElementsDialogComponent;
  let fixture: ComponentFixture<ViewDependencyPointElementsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDependencyPointElementsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDependencyPointElementsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
