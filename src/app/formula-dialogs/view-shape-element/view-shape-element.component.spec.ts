import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShapeElementComponent } from './view-shape-element.component';

describe('ViewShapeElementComponent', () => {
  let component: ViewShapeElementComponent;
  let fixture: ComponentFixture<ViewShapeElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewShapeElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewShapeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
