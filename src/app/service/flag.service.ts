import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";

@Injectable()
export class FlagService {

    //----------------------------------------------------------
    private show_department_circle_tab_subject = new ReplaySubject<Observable<Object>>()
    private show_department_circle_Source: Observable<Object>;

    private show_branch_amlak_tab_subject = new ReplaySubject<Observable<Object>>()
    private show_branch_amlak_tab_Source: Observable<Object>;

    private show_branch_circle_tab_subject = new ReplaySubject<Observable<Object>>()
    private show_branch_circle_tab_Source: Observable<Object>;

    private reset_branch_personel_table_subject = new ReplaySubject<Observable<Object>>()
    private reset_branch_personel_table_Source: Observable<Object>;

    constructor() {
        if (this.show_department_circle_Source == null)
            this.show_department_circle_Source = this.show_department_circle_tab_subject.asObservable();
        if (this.show_branch_amlak_tab_Source == null)
            this.show_branch_amlak_tab_Source = this.show_branch_amlak_tab_subject.asObservable();
        if (this.show_branch_circle_tab_Source == null)
            this.show_branch_circle_tab_Source = this.show_branch_circle_tab_subject.asObservable();
        if (this.reset_branch_personel_table_Source == null)
            this.reset_branch_personel_table_Source = this.reset_branch_personel_table_subject.asObservable();

    }
    //----------------------------------------------------------
    get_department_circle_Source() {
        return this.show_department_circle_Source;
    }
    set_department_circle_Source(data) {
        this.show_department_circle_tab_subject.next(data);
    }
    //----------------------------------------------------------
    get_show_branch_amlak_tab_Source() {
        return this.show_branch_amlak_tab_Source;
    }
    set_show_branch_amlak_tab_Source(data) {
        this.show_branch_amlak_tab_subject.next(data);
    }
    get_show_branch_circle_tab_Source() {
        return this.show_branch_circle_tab_Source;
    }
    set_show_branch_circle_tab_Source(data) {
        this.show_branch_circle_tab_subject.next(data);
    }
    get_reset_branch_personel_table_Source() {
        return this.reset_branch_personel_table_Source;
    }
    set_reset_branch_personel_table_Source(data) {
        this.reset_branch_personel_table_subject.next(data);
    }    
}