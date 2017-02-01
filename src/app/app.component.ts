import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService } from './services';

@Component({
	selector: 'my-app', // <my-app></my-app>
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(public noteService: NoteService, public route: ActivatedRoute) {}
}
