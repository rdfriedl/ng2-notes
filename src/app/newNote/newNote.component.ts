import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService } from '../services';

@Component({
	selector: 'my-new-note',
	templateUrl: './newNote.component.html'
})
export class NewNoteComponent {
	loading = false;

	constructor(public noteService: NoteService, public router: Router) {}

	createNote(title: String, content: String) {
		this.loading = true;
		this.noteService.createNote({
			title: title,
			content: content
		}).finally(() => this.loading = false).then(() => {
			this.router.navigate(['']);
		});
	}

	onFormSubmit(event: Event) {
		let form = <HTMLFormElement>event.target;
		this.createNote(
			(<HTMLInputElement>form.elements.namedItem('title')).value,
			(<HTMLTextAreaElement>form.elements.namedItem('content')).value
		);

		event.preventDefault();
		return false;
	}
}
