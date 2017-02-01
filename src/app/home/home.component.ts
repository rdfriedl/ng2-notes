import { Component, OnInit } from '@angular/core';
import { NoteService, NoteData } from '../services';

@Component({
	selector: 'my-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
	notes: Array<NoteData> = [];
	selected: Array<number> = [];

	constructor(public noteService: NoteService) {}

	updateNotes() {
		this.noteService.getNotes().then(notes => this.notes = notes);
	}

	ngOnInit() {
		this.updateNotes();
	}

	setSelected(id: number, selected = true) {
		if (selected) {
			if (!this.selected.includes(id)) {
				this.selected.push(id);
			}
		}
		else {
			if (this.selected.includes(id)) {
				this.selected.splice(this.selected.indexOf(id), 1);
			}
		}
	}

	toggleSelected(id: number) {
		this.setSelected(id, !this.selected.includes(id));
	}

	clearSelection() {
		this.selected.length = 0;
	}

	deleteNotes(ids: [number]) {
		Promise.all(ids.map(id => this.noteService.deleteNote(id))).then(() => {
			this.notes = this.notes.filter(note => !ids.includes(note.id));
			this.selected = this.selected.filter(id => !ids.includes(id));
		});
	}
}
