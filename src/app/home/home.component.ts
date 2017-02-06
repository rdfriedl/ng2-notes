import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, Note } from '../services';

@Component({
	selector: 'my-home',
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
	get notes(): Array<Note> {
		return Array.from(this.noteService.notes).map(v => v[1]);
	};
	selected: Array<Note> = [];
	loading = true;

	constructor(public noteService: NoteService, public router: Router) {}

	ngOnInit() {
		this.noteService.loaded.then(notes => {
			if (!notes.size) {
				return Promise.all([
					this.noteService.createNote(new Note({
						title: 'ng2-notes todo list',
						content: `
- <strike>allow user to edit notes</strike>
- <strike>add labels to notes</strike>
- add search box
- add note colors`,
						labels: ['default', 'ng2-notes']
					}))
				]).then(() => {
					console.log('demo notes created');
				});
			}
		}).then(() => this.loading = false);
	}

	setSelected(note: Note, selected = true) {
		if (selected) {
			if (!this.selected.includes(note)) {
				this.selected.push(note);
			}
		}
		else {
			if (this.selected.includes(note)) {
				this.selected.splice(this.selected.indexOf(note), 1);
			}
		}
	}

	toggleSelected(note: Note) {
		this.setSelected(note, !this.selected.includes(note));
	}

	clearSelection() {
		this.selected.length = 0;
	}

	deleteNotes(notes: [Note]) {
		Promise.all(notes.map(note => this.noteService.deleteNote(this.noteService.getNoteID(note)))).then(() => {
			this.selected = this.selected.filter(note => !notes.includes(note));
		}).catch(() => {
			// error
			this.clearSelection();
		});
	}

	editNote(note: Note) {
		this.router.navigate(['/edit', this.noteService.getNoteID(note)]);
	}
}
