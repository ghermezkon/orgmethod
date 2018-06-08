import { Component, OnInit, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { HttpPostTypeResolver } from '../http.service/http.bank.resolver';
import { RouterModule } from '@angular/router';
import { InsertPostTypeComponent } from './insert.post.type.component';

@Component({
    templateUrl: 'post.type.component.html'
})
export class PostTypeComponent {
    constructor() { }
    ngOnInit() { }
}
@NgModule({
    declarations: [PostTypeComponent, InsertPostTypeComponent],
    imports: [CommonModule, SharedModule,
        RouterModule.forChild([
            {
                path: '', component: PostTypeComponent, pathMatch: 'full',
                resolve: { org_posttype: HttpPostTypeResolver }
            },
        ])],
    providers: [HttpPostTypeResolver]
})
export class PostTypeModule { }