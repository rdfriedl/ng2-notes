import { Injectable } from '@angular/core';
import Dexie from 'dexie';

export interface NoteItem {
	done: boolean;
	text: String;
}

export interface NoteData {
	id?: number;
	type?: String;
	title?: String;
	content?: String;
	items?: Array<NoteItem>;
	created?: Date;
	updated?: Date;
	image?: String;
	labels?: Array<String>;
}

@Injectable()
export class NoteService {
	public db: Dexie;
	public notes: Map<number, Note> = new Map<number, Note>();
	public loaded: Promise<Map<number, Note>>;

	constructor() {
		this.db = new Dexie('ng2-notes');

		// set up db
		this.db.version(1).stores({
			notes: '++id, title, content, created, updated'
		});
		this.db.version(2).stores({
			notes: '++id, title, content, created, updated, image'
		});
		this.db.version(3).stores({
			notes: '++id, title, content, created, updated, image, labels'
		});
		this.db.version(4).stores({
			notes: '++id, title, type, content, items, created, updated, image, labels'
		});

		this.loadNotes();
	}

	loadNotes(): Promise<Map<number, Note>> {
		return this.loaded = new Promise((resolve, reject) => {
			this.db.table('notes').toArray().then(entries => {
				entries.forEach(data => {
					let note = new Note(<NoteData>data);
					this.notes.set(data.id, note);
				});

				resolve(this.notes);
			}).catch(err => reject(err));
		});
	}

	hasNote(id: number): boolean {
		return this.notes.has(id);
	}

	getNote(id: number): Note {
		return this.notes.get(id);
	}

	getNoteID(note: Note): number {
		let entries = this.notes.entries(), entry;
		while (entry = entries.next().value) {
			if (entry[1] === note) {
				return entry[0];
			};
		}
	}

	deleteNote(id: number) {
		if (this.hasNote(id)) {
			// remote it from the db
			return this.db.table('notes').delete(id).then(() => {
				// remote it from the map
				this.notes.delete(id);
			});
		}

		return Dexie.Promise.reject(new Error('no note with that id'));
	}

	createNote(data: NoteData) {
		let note = new Note(data);

		// add the note to the db and the array
		return this.db.table('notes').put(note).then(id => {
			// add it to the map
			this.notes.set(id, note);
			return note;
		});
	}

	updateNote(id: number, data: NoteData) {
		let note = this.getNote(id);
		note.update(data);

		// save the note
		return this.db.table('notes').update(id, data);
	}
}

export class Note implements NoteData {
	type: String = 'text'; // text, list
	title: String = '';
	content: String = '';
	items: Array<NoteItem> = [];
	created: Date = new Date();
	updated: Date = new Date();
	image: String = '';
	labels: Array<String> = [];

	constructor(data?: NoteData) {
		if (data) {
			this.update(data);
		}
	}

	update(data: NoteData | Note) {
		if (data.created) {
			this.created = new Date(data.created);
		}
		if (data.updated) {
			this.updated = new Date(data.updated);
		}

		this.title = data.title || this.title;
		this.type = data.type || this.type;
		this.content = data.content || this.content;
		this.items = Array.isArray(data.items) ? Array.from(data.items) : this.items;
		this.image = data.image || this.image;
		this.labels = Array.isArray(data.labels) ? Array.from(data.labels) : this.labels;
	}
}
