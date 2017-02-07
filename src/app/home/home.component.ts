import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteService, Note } from '../services';

let STARTING_NOTES: Array<Note> = [
	new Note({
		content: `## ng2-notes
*created by [rdfriedl](http://rdfriedl.com)*
*view [source](https://github.com/rdfriedl/ng2-notes)*

#### features
- **markdown** support
- *image notes* *(works with mobile cameras)*

#### libraries used
<img src="https://angular.io/favicon.ico" width="32"/>
<a href="https://angular.io" target="_blank">Angular 2</a>

<img src="https://v4-alpha.getbootstrap.com/favicon.ico" width="32"/>
<a href="https://v4-alpha.getbootstrap.com" target="_blank">Bootstrap 2</a>

<img src="https://webpack.js.org/assets/favicon.ico" width="32"/>
<a href="https://webpack.js.org/" target="_blank">Webpack 2</a>

<img src="http://dexie.org/assets/images/favicon-yuri.png" width="32"/>
<a href="http://dexie.org/" target="_blank">Dexie</a>
`
	}),
	new Note({
		title: 'A Simple List',
		type: 'list',
		items: [
			{text: 'A simple list entry', done: false},
			{text: 'A completed entry', done: true},
			{text: 'list entries support **markdown**', done: false}
		]
	}),
	new Note({
		content: `<center><h4>Angular2</h4></center>
<center>One framework.<br>Mobile & desktop</center>
<a class="btn btn-primary btn-block col-8 mx-auto mt-3" href="https://angular.io/docs/ts/latest/quickstart.html" target="_blank">Get Started</a>
`,
		image: 'https://udemy-images.udemy.com/course/750x422/500628_a962.jpg'
	}),
	new Note({
		content: `### Markdown Example

##### Text basics
this is *italic* and this is **bold** and this is \`important\` text.

##### Example list

 - bullet list 1
 - bullet list 2
    - sub item 1
    - sub item 2

##### tables

| Year | Temperature (low) | Temperature (high) |
| ---- | ----------------- | -------------------|
| 1900 |               -10 |                 25 |
| 1910 |               -15 |                 30 |
| 1920 |               -10 |                 32 |`
	}),
	new Note({
		content: `**Bootstrap is the most popular HTML, CSS, and JS framework in the world for building responsive, mobile-first projects on the web**`,
		image: 'http://www.thatcompany.com/wp-content/uploads/2016/08/Bootstrap.png'
	})
];

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
				return Promise.all(STARTING_NOTES.map(note => this.noteService.createNote(note))).then(() => {
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
	saveNote(note: Note) {
		this.noteService.updateNote(this.noteService.getNoteID(note), note);
	}
}
