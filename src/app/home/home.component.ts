import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;

  constructor() { }

  ngOnInit() {
  }
  // changes the UI between the home and register component
  registerToggle() {
    this.registerMode = !this.registerMode;
  }
}
