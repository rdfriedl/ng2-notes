import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteService, Note } from '../services';
import { readFile } from '../../utils';
import Dexie from 'dexie';
import * as moment from 'moment';

@Component({
	selector: 'my-note-form',
	templateUrl: './note-form.component.html'
})
export class NoteFormComponent implements OnInit {
	loading = false;
	mobilePreview = false;

	note: Note;
	modal: Note = new Note();
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

					if (note) {
						this.modal.update(note);
					}
				});
		});
	}

	saveNote() {
		this.loading = true;
		let p: Dexie.Promise<any>;

		if (!this.note) {
			p = this.noteService.createNote(this.modal);
		}
		else {
			this.modal.updated = moment();
			p = this.noteService.updateNote(this.noteService.getNoteID(this.note), this.modal);
		}

		// when its dont, go back to the home page
		p.finally(() => this.loading = false)
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
