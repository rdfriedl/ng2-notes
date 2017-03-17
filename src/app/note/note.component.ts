import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note, NoteItem } from '../services/note.service';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
	selector: 'my-note',
	templateUrl: './note.component.html',
	styleUrls: ['./note.component.css']
})
export class NoteComponent {
	@Input() selected: false;
	@Input() note: Note = new Note();

	@Output() change = new EventEmitter();
	@Output() select = new EventEmitter();
	@Output() remove = new EventEmitter();
	@Output() edit = new EventEmitter();

	protected touchSelectTimeout: any;

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

	startTouchSelect() {
		if (!this.selected) {
			this.touchSelectTimeout = setTimeout(() => {
				if (!this.selected) {
					this.select.emit();
				}
			}, 500);
		}
	}

	cancelTouchSelect() {
		if (this.touchSelectTimeout) {
			this.touchSelectTimeout = clearTimeout(this.touchSelectTimeout);
		}
	}
}
