import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteService, Note } from '../services';

@Component({
	selector: 'my-edit-note',
	templateUrl: './edit-note.component.html'
})
export class EditNoteComponent implements OnInit {
	note: Note = new Note();
	modal: Note = new Note();
	mobilePreview = false;

	constructor(
		public noteService: NoteService,
		public route: ActivatedRoute,
		public router: Router
	) {}

	ngOnInit() {
		this.route.params
			.map((params: any) => this.noteService.getNote(+params['id']))
			.subscribe(note => {
				this.note = note;
				this.modal.update(note);
			});
	}

	saveNote() {
		this.noteService.updateNote(this.noteService.getNoteID(this.note), this.modal)
			.then(() => this.router.navigate(['/']));
	}

	toggleMobilePreview() {
		this.mobilePreview = !this.mobilePreview;
	}
}
