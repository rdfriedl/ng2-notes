import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, Note } from '../services';
import { readFile } from '../../utils';

@Component({
	selector: 'my-note-form',
	templateUrl: './note-form.component.html'
})
export class NoteFormComponent {
	loading = false;
	mobilePreview = false;

	modal: Note = new Note();
	get labels(): String{
		return this.modal.labels.join(',');
	}
	set labels(v: String){
		this.modal.labels = String(v).split(',');
	}

	constructor(public noteService: NoteService, public router: Router) {}

	createNote() {
		this.loading = true;
		this.noteService.createNote(this.modal)
			.finally(() => this.loading = false)
			.then(() => this.router.navigate(['/']));
	}

	toggleMobilePreview() {
		this.mobilePreview = !this.mobilePreview;
	}

	uploadEvent(event: Event) {
		let target: HTMLInputElement = <HTMLInputElement>event.target;
		if (target.files && target.files.length) {
			this.uploadImage(target.files[0]);
		}
	}

	uploadImage(file: Blob) {
		readFile(file).then(url => this.modal.image = url);
	}
}
