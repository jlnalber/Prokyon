import { Component, OnInit } from '@angular/core';
import {DrawerService} from "../services/drawer.service";
import {DialogService} from "../dialog/dialog.service";
import {ScreenshotDialogComponent} from "../screenshot-dialog/screenshot-dialog.component";

@Component({
  selector: 'app-settings-tab',
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.css']
})
export class SettingsTabComponent implements OnInit {

  constructor(public readonly drawerService: DrawerService, private readonly dialogService: DialogService) { }

  ngOnInit(): void {
  }

  screenshot() {
    this.dialogService.createDialog(ScreenshotDialogComponent)?.open();
  }
}
