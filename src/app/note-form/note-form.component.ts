import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, Note } from '../services';

@Component({
	selector: 'my-note-form',
	templateUrl: './note-form.component.html'
})
export class NoteFormComponent {
	loading = false;
	mobilePreview = false;

	note: Note = new Note();

	constructor(public noteService: NoteService, public router: Router) {}

	createNote() {
		this.loading = true;
		this.noteService.createNote(this.note)
			.finally(() => this.loading = false)
			.then(() => this.router.navigate(['/']));
	}

	toggleMobilePreview() {
		this.mobilePreview = !this.mobilePreview;
	}
}
