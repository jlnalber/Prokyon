import { Component, OnInit } from '@angular/core';
import {DrawerService} from "../services/drawer.service";

@Component({
  selector: 'app-settings-tab',
  templateUrl: './settings-tab.component.html',
  styleUrls: ['./settings-tab.component.css']
})
export class SettingsTabComponent implements OnInit {

  constructor(public readonly drawerService: DrawerService) { }

  ngOnInit(): void {
  }

}
