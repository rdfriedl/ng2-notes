import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, CreateNoteData } from '../services';

@Component({
	selector: 'my-note-form',
	templateUrl: './note-form.component.html'
})
export class NoteFormComponent {
	loading = false;
	mobilePreview = false;

	note: CreateNoteData = {
		title: '',
		content: '',
		type: 'note',
		items: []
	};

	constructor(public noteService: NoteService, public router: Router) {}

	createNote() {
		this.loading = true;
		this.noteService.createNote(this.note)
			.finally(() => this.loading = false)
			.then(() => this.router.navigate(['/']));
	}

	addItem() {
		this.note.items.push({
			content: '',
			done: false
		});
	}

	removeItem(id: number) {
		this.note.items.splice(id, 1);
	}

	toggleMobilePreview() {
		this.mobilePreview = !this.mobilePreview;
	}
}
