import { Injectable } from '@angular/core';
import Dexie from 'dexie';

export interface NoteData {
	id: number;
	title: String;
	content?: String;
	items?: Array<NoteItem>;
	type: String;
	created: Date;
	updated: Date;
}
export interface CreateNoteData {
	id?: number;
	title: String;
	content?: String;
	items?: Array<NoteItem>;
	type: String;
	created?: Date;
	updated?: Date;
}
export interface NoteItem {
	content: String;
	done: boolean;
}

@Injectable()
export class NoteService {
	public db: Dexie;

	constructor() {
		this.db = new Dexie('ng2-notes');

		// set up db
		this.db.version(1).stores({
			notes: '++id, title, content, created, updated'
		});
	}

	getNotes(): Dexie.Promise<Array<NoteData>> {
		return this.db.table('notes').toArray().then(notes => notes.map((note: NoteData) => {
			note.created = new Date(note.created);
			note.updated = new Date(note.updated);
			note.type = note.type || 'note';
			return note;
		}));
	}

	getNote(id: number): Dexie.Promise<NoteData> {
		return this.db.table('notes').get(id).then((note: NoteData) => {
			note.created = new Date(note.created);
			note.updated = new Date(note.updated);
			return note;
		});
	}

	deleteNote(id: number) {
		return this.db.table('notes').delete(id);
	}

	createNote(data: CreateNoteData) {
		if (!data.created) {
			data.created = new Date();
		}
		if (!data.updated) {
			data.updated = new Date();
		}

		return this.db.table('notes').put(data);
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

		return this.db.table('notes').put(Object.assign({}, data, {id}));
	}
}
