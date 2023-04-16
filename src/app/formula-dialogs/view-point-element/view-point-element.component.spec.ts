import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPointElementComponent } from './view-point-element.component';

describe('ViewPointElementComponent', () => {
  let component: ViewPointElementComponent;
  let fixture: ComponentFixture<ViewPointElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPointElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPointElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
