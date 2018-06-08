import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { Observable } from "rxjs/Observable";

@Injectable()
export class ReportBranchWorkService {

    //----------------------------------------------------------
    private table_id_subject = new ReplaySubject<Observable<Object>>()
    private table_id_Source: Observable<Object>;

    constructor() {
        if (this.table_id_Source == null)
            this.table_id_Source = this.table_id_subject.asObservable();
    }
    //----------------------------------------------------------
    get_table_id_Source() {
        return this.table_id_Source;
    }
    set_table_id_Source(data) {
        this.table_id_subject.next(data);
    }
    //----------------------------------------------------------
}