import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SnackbarConfig} from "../snackbar.service";

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit, AfterViewInit {

  @ViewChild('snackbar') wrapper!: ElementRef;

  public snackbarConfig?: SnackbarConfig;
  public message!: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const wrapperEl = this.wrapper.nativeElement as HTMLDivElement;
    wrapperEl.textContent = this.message;
    wrapperEl.style.background = this.snackbarConfig?.background ?? '#333';
    wrapperEl.style.color = this.snackbarConfig?.color ?? 'white';
  }

}
