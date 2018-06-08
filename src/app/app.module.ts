import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';
import { MessageService } from './service/message.service';
import { PersianCalendarService } from './service/persian.calendar.service';
import { MessageDialogComponent } from './service/message.dialog';
import { GlobalHttpService } from './admin/http.service/global.http.service';
import { MatPaginatorIntl } from '@angular/material';
import { PaginatorLabel } from './service/paginator.label';
import { DepartmentHttpService } from './admin/http.service/http.dep.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CacheInterceptor } from './admin/http.service/cache.interceptor';
import { FlagService } from './service/flag.service';
import { ConfirmDialogComponent } from './service/confirm.dialog';
import { BranchWorkHttpService } from './admin/http.service/http.branchwork.service';
import { PagerService } from './service/pager.service';
import { ReportBranchWorkService } from './user/report.branch.work/repo.branch.work.service';
import { SearchDialogComponent } from './user/parametric.search/search.dialog.component';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'tour-of-heroes' }),
    NoopAnimationsModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    MessageDialogComponent, ConfirmDialogComponent, SearchDialogComponent,
  ],
  entryComponents: [MessageDialogComponent, ConfirmDialogComponent, SearchDialogComponent],
  providers: [
    MessageService, PersianCalendarService, GlobalHttpService, BranchWorkHttpService,
    DepartmentHttpService, FlagService, PagerService, ReportBranchWorkService,
    { provide: MatPaginatorIntl, useClass: PaginatorLabel },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CacheInterceptor,
    //   multi: true,
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}
