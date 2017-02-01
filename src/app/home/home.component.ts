import { Component, OnInit } from '@angular/core';
import { NoteService, NoteData } from '../services';

@Component({
	selector: 'my-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
	notes: Array<NoteData> = [];

	constructor(public noteService: NoteService) {}

	updateNotes() {
		this.noteService.getNotes().then(notes => this.notes = notes);
	}

	ngOnInit() {
		this.updateNotes();
	}
}
