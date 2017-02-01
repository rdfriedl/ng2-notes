import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { NewNoteComponent } from './newNote/newNote.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'about', component: AboutComponent},
	{ path: 'new', component: NewNoteComponent}
];

export const routing = RouterModule.forRoot(routes, {
	useHash: true
});
