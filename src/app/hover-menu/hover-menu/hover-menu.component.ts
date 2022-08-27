import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Point} from "../../global/interfaces/point";

@Component({
  selector: 'app-hover-menu',
  templateUrl: './hover-menu.component.html',
  styleUrls: ['./hover-menu.component.css']
})
export class HoverMenuComponent implements OnInit, AfterViewInit {

  @ViewChild('content', { read: ViewContainerRef }) content!: ViewContainerRef;
  @ViewChild('wrapper') wrapper!: ElementRef;

  public component!: Type<any>;
  public position: Point = {
    x: 0,
    y: 0
  }
  public data: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let comp = this.content.createComponent(this.component);
    comp.instance.data = this.data;
  }

  getBoundingClientRect(): DOMRect {
    return this.wrapper.nativeElement.getBoundingClientRect();
  }

}
