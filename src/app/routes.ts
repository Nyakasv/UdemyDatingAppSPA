import { AuthGuard } from './_guards/auth.guard';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';

// route setup
export const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {
      path: '',
      runGuardsAndResolvers: 'always',
      canActivate: [AuthGuard],
      children: [
        {path: 'members', component: MemberListComponent},
        {path: 'messages', component: MessagesComponent},
        {path: 'lists', component: ListsComponent}
      ]
    },
    // route for non existing pages '**' wildcard
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
