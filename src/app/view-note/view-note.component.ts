import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteService, NoteData } from '../services';

@Component({
	selector: 'my-view-note',
	templateUrl: './view-note.component.html'
})
export class ViewNoteComponent implements OnInit {
	note: NoteData = {
		id: -1,
		title: '',
		content: '',
		type: 'note',
		created: new Date(),
		updated: new Date()
	};

	constructor(public noteService: NoteService, public route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params
			.map((params: any) => this.noteService.getNote(+params['id']))
			.subscribe(note => this.note = note);
	}
}
