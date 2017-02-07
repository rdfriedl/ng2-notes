import { Component, Input } from '@angular/core';
import { NoteItem } from '../services/note.service';

@Component({
	selector: 'my-list-editor',
	templateUrl: './list-editor.component.html'
})
export class ListEditorComponent {
	@Input() list: Array<NoteItem> = [];
	newItem: String = '';
	editing: NoteItem;

	removeItem(item: NoteItem) {
		if (this.list.includes(item)) {
			this.list.splice(this.list.indexOf(item), 1);
		}
	}

	addItem(text: String = '', done = false) {
		this.list.push({text, done});
	}

	submitForm() {
		this.addItem(this.newItem);
		this.newItem = '';
	}
}
