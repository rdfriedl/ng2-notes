import { Injectable } from '@angular/core';
import Dexie from 'dexie';

export interface NoteData {
	id: number;
	title?: String;
	content?: String;
	items?: Array<NoteItem>;
	type: String;
	created: Date;
	updated: Date;
	done?: boolean;
}
export interface CreateNoteData {
	id?: number;
	title?: String;
	content?: String;
	items?: Array<NoteItem>;
	type: String;
	created?: Date;
	updated?: Date;
	done?: boolean;
}
export interface NoteItem {
	content: String;
	done: boolean;
}

@Injectable()
export class NoteService {
	public db: Dexie;
	public notes: Array<NoteData> = [];

	constructor() {
		this.db = new Dexie('ng2-notes');

		// set up db
		this.db.version(1).stores({
			notes: '++id, title, content, created, updated'
		});

		this.getNotes().then(notes => {
			if (!notes.length) {
				Promise.all([
					this.createNote({
						content: 'Learn Angular2',
						done: true,
						type: 'note'
					}),
					this.createNote({
						title: 'Create Demo Application',
						content: `
 - Think of an application to build
 [ x ] set up project
 [ ] finish project
`,
						done: true,
						type: 'note'
					})
				]).then(() => {
					console.log('demo notes created');
				});
			}
		});
	}

	getNotes(): Dexie.Promise<Array<NoteData>> {
		return this.db.table('notes').toArray().then(notes => notes.map((note: NoteData) => {
			note.created = new Date(note.created);
			note.updated = new Date(note.updated);
			note.type = note.type || 'note';
			return note;
		})).then(notes => this.notes = notes);
	}

	getNote(id: number): NoteData {
		return this.notes.find(note => note.id === id);
	}

	deleteNote(id: number) {
		return this.db.table('notes').delete(id).then(() => {
			// remote the note from the array
			this.notes = this.notes.filter(note => note.id !== id);
		});
	}

	createNote(data: CreateNoteData) {
		if (!data.created) {
			data.created = new Date();
		}
		if (!data.updated) {
			data.updated = new Date();
		}
		if (data.done === undefined) {
			data.done = false;
		}

		// add the note to the db and the array
		return this.db.table('notes').put(data).then(id => {
			data.id = id;
			this.notes.push(<NoteData>data);
		});
	}

	updateNote(id: any, data: CreateNoteData) {
		if (data.id) {
			throw new Error('cant update notes id');
		}

		if (!data.created) {
			data.created = new Date();
		}
		if (!data.updated) {
			data.updated = new Date();
		}

		return this.db.table('notes').put(Object.assign({}, data, {id})).then(() => {
			Object.assign(this.getNote(id), data);
		});
	}
}
