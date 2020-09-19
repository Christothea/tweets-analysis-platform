import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuideComponent } from './guide/guide.component';
import { KeywordsComponent } from './keywords/keywords.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  { path:  '', redirectTo: 'guide', pathMatch:  'full' },
  {
    path: 'Guide',
    component: GuideComponent
  },
  {
    path: 'Keywords-list',
    component: KeywordsComponent
  },
  {
    path: 'Statistics',
    component: StatisticsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
