import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MarkdownToHtmlPipe } from 'markdown-to-html-pipe';
import { NoteComponent } from './note/note.component';
import { ListEditorComponent } from './list-editor/list-editor.component';
import { MarkdownFixPipe } from './markdown-fix.pipe';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { AboutComponent } from './about/about.component';
import { NoteService } from './services';
import { routing } from './app.routing';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		routing
	],
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent,
		NoteFormComponent,
		EditNoteComponent,
		NoteComponent,

		MarkdownToHtmlPipe,
		MarkdownFixPipe,
		ListEditorComponent
	],
	providers: [
		NoteService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(public appRef: ApplicationRef) {}
	hmrOnInit(store) {
		console.log('HMR store', store);
	}
	hmrOnDestroy(store) {
		let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
		// recreate elements
		store.disposeOldHosts = createNewHosts(cmpLocation);
		// remove styles
		removeNgStyles();
	}
	hmrAfterDestroy(store) {
		// display new elements
		store.disposeOldHosts();
		delete store.disposeOldHosts;
	}
}
