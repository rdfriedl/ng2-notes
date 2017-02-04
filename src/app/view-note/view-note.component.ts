import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService, Note } from '../services';

@Component({
	selector: 'my-view-note',
	templateUrl: './view-note.component.html'
})
export class ViewNoteComponent implements OnInit {
	note: Note = new Note();

	constructor(public noteService: NoteService, public route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params
			.map((params: any) => this.noteService.getNote(+params['id']))
			.subscribe(note => this.note = note);
	}
}
