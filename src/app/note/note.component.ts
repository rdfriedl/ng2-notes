import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note, NoteItem } from '../services/note.service';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
	selector: 'my-note',
	templateUrl: './note.component.html'
})
export class NoteComponent {
	@Input() selected: false;
	@Input() note: Note = new Note();

	@Output() change = new EventEmitter();

	sortablejs: SortablejsOptions = {
		animation: 150,
		onUpdate: () => this.change.emit()
	};

	removeItem(item: NoteItem) {
		if (this.note.items.includes(item)) {
			this.note.items.splice(this.note.items.indexOf(item), 1);
			this.change.emit();
		}
	}

	toggleItem(item: NoteItem) {
		item.done = !item.done;
		this.change.emit();
	}
}
