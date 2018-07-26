import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentHttpService } from './admin/http.service/http.dep.service';
import { MessageService } from './service/message.service';
import { MatDialog } from '@angular/material';
import { SearchDialogComponent } from './user/parametric.search/search.dialog.component';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  branch_code: FormControl;
  //---------------------------------------------------------------
  constructor(private title: Title, private router: Router,
    private _http_dep: DepartmentHttpService, private dialog: MatDialog,
    private _msg: MessageService) {
    this.title.setTitle('سامانه اتوماسیون سازمان و روشها');
    this.branch_code = new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9]*')]));
  }
  //---------------------------------------------------------------
  redirect_to_search() {
    this._http_dep.get_branch_by_branch_code(this.branch_code.value).pipe(take(1)).subscribe((res: any) => {
      if (res.length > 0) {
        this._http_dep.setBranchSource(res);
        this.router.navigate(['/search', this.branch_code.value]);
        this.branch_code.reset();
      }
    })
  }
  //---------------------------------------------------------------
  show_search_dialog() {
    this.openSearchDialog();
  }
  openSearchDialog(): void {
    let dialogRef = this.dialog.open(SearchDialogComponent, {
      width: '50%',
      height: '50%',
    });
    
  }

  //---------------------------------------------------------------
}
