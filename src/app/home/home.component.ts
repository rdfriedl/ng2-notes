import { Component } from '@angular/core';
import { NoteService } from '../services';

@Component({
	selector: 'my-home',
	templateUrl: './home.component.html'
})
export class HomeComponent {
	get notes() {
		return this.noteService.notes;
	};
	selected: Array<number> = [];

	constructor(public noteService: NoteService) {}

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
			this.selected = this.selected.filter(id => !ids.includes(id));
		});
	}
}
