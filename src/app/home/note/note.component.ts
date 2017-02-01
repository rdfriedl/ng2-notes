import { Component, Input } from '@angular/core';
import { NoteService, NoteData } from '../../services';

@Component({
	selector: 'my-note',
	templateUrl: './note.component.html'
})
export class NoteComponent {
	@Input() note: NoteData;

	constructor(public noteService: NoteService) {}
}
