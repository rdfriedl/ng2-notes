import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { NoteFormComponent } from './note-form/note-form.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'notes', component: HomeComponent },
	{ path: 'about', component: AboutComponent},
	{ path: 'new', component: NoteFormComponent},
	{ path: 'edit/:id', component: EditNoteComponent}
];

export const routing = RouterModule.forRoot(routes, {
	useHash: true
});
