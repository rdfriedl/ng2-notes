import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteService, Note } from '../services';
import { readFile } from '../../utils';

@Component({
	selector: 'my-edit-note',
	templateUrl: './edit-note.component.html'
})
export class EditNoteComponent implements OnInit {
	note: Note = new Note();
	modal: Note = new Note();

	mobilePreview = false;
	get labels(): String{
		return this.modal.labels.join(',');
	}
	set labels(v: String){
		this.modal.labels = String(v).split(',');
	}

	constructor(
		public noteService: NoteService,
		public route: ActivatedRoute,
		public router: Router
	) {}

	ngOnInit() {
		this.noteService.loaded.then(() => {
			this.route.params
				.map((params: any) => this.noteService.getNote(+params['id']))
				.subscribe(note => {
					this.note = note;
					this.modal.update(note);
				});
		});
	}

	saveNote() {
		this.modal.updated = new Date();
		this.noteService.updateNote(this.noteService.getNoteID(this.note), this.modal)
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
