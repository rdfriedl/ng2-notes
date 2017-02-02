import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'my-about',
	templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
	README: String = require('../../../README.md');

	constructor() {
		// Do stuff
	}

	ngOnInit() {
		console.log('Hello About');
	}

}
