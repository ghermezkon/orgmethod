import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs/Observable";
import { publishLast } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs";

@Injectable()
export class BranchWorkHttpService {
    table_branchwork: any = 'api/org_branchwork';
    //-------------------------------------------------------------------------
    headers: any;
    url_branchwork: any = environment.apiEndPoint + this.table_branchwork

    //-------------------------------------------------------------------------
    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    }
    //-------------------------------------------------------------------------
    get_current_branchwork(mah_date: any, dep_code: any) {
        return this.http.get(this.url_branchwork + '/' + mah_date + '/' + dep_code);
    }
    get_distinct_mah_date() {
        return this.http.get(this.url_branchwork + '/distinct_mah_date');
    }
    get_min_in_month_items_branch(mah_date: any, dep_code: any, fldcode: any) {
        return this.http.get(this.url_branchwork + '/min_in_month_items_branch/' + mah_date + '/' + dep_code + '/' + fldcode);
    }
    get_max_in_month_items_branch(mah_date: any, dep_code: any, fldcode: any) {
        return this.http.get(this.url_branchwork + '/max_in_month_items_branch/' + mah_date + '/' + dep_code + '/' + fldcode);
    }    
    get_min_in_month_items_dep(mah_date: any, dep_code: any, fldcode: any) {
        return this.http.get(this.url_branchwork + '/min_in_month_items_dep/' + mah_date + '/' + dep_code + '/' + fldcode);
    }
    get_max_in_month_items_dep(mah_date: any, dep_code: any, fldcode: any) {
        return this.http.get(this.url_branchwork + '/max_in_month_items_dep/' + mah_date + '/' + dep_code + '/' + fldcode);
    }    
    get_amount_by_fldcode_in_items_branch(mah_date: any, dep_code: any, fldcode: any) {
        return this.http.get(this.url_branchwork + '/find_amount_by_fldcode_in_items_branch/' + mah_date + '/' + dep_code + '/' + fldcode);
    }        
    get_amount_by_fldcode_in_items_dep(mah_date: any, dep_code: any, fldcode: any) {
        return this.http.get(this.url_branchwork + '/find_amount_by_fldcode_in_items_dep/' + mah_date + '/' + dep_code + '/' + fldcode);
    }       
    //-------------------------------------------------------------------------
    save_branchwork_all(data?: any) {
        return this.http.post(this.url_branchwork, data, { headers: this.headers });
    }
    update_branchwork_all(data?: any) {
        return this.http.put(this.url_branchwork, data, { headers: this.headers });
    }
}