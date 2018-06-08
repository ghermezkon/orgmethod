import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs/Observable";
import { publishLast } from "rxjs/operators";
import { Subject } from "rxjs/Subject";
import { ReplaySubject } from "rxjs";

@Injectable()
export class DepartmentHttpService {
    table_state: any = 'api/org_state';
    //-------------------------------------------------------------------------
    headers: any;
    url_department: any = environment.apiEndPoint + this.table_state + '/department';
    url_hoze: any = environment.apiEndPoint + this.table_state + '/hoze';
    url_branch: any = environment.apiEndPoint + this.table_state + '/branch';
    //-------------------------------------------------------------------------
    private departmentSubject = new ReplaySubject<Observable<Object>>()
    private departmentSource: Observable<Object>;
    private circleTypeSubject = new ReplaySubject<Observable<Object>>()
    private circleTypeSource: Observable<Object>;
    private branchSubject = new ReplaySubject<Observable<Object>>()
    private branchSource: Observable<Object>;
    //-------------------------------------------------------------------------
    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders().set('enctype', 'multipart/form-data');
        if (this.departmentSource == null)
            this.departmentSource = this.departmentSubject.asObservable();
        if (this.circleTypeSource == null)
            this.circleTypeSource = this.circleTypeSubject.asObservable();
        if (this.branchSource == null)
            this.branchSource = this.branchSubject.asObservable();
    }
    //-------------------------------------------------------------------------
    get_all_department() {
        return this.http.get(this.url_department);
    }
    get_by_dep_code(data?: any) {
        return this.http.get(this.url_department + '/' + data);
    }
    save_department(department?: any) {
        return this.http.post(this.url_department, department, { headers: this.headers });
    }
    update_department(department?: any) {
        return this.http.put(this.url_department, department, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_branch_by_dep_name(dep_name) {
        return this.http.get(this.url_branch + '/find_by_dep_name/' + dep_name);
    }
    get_branch_by_dep_code(dep_code) {
        return this.http.get(this.url_branch + '/find_by_dep_code/' + dep_code);
    }
    get_branch_by_branch_code(branch_code) {
        return this.http.get(this.url_branch + '/find/' + branch_code);
    }
    get_branch_by_branch_dep_code(dep_code, branch_code) {
        return this.http.get(this.url_branch + '/find/' + dep_code + "/" + branch_code);
    }
    get_branch_by_hoze_code(dep_code, hoze_code) {
        return this.http.get(this.url_branch + '/find_by_hoze/' + dep_code + "/" + hoze_code);
    }
    get_branch_by_branch_list(branch_list) {
        return this.http.get(this.url_branch + '/find_by_branch_list/' + branch_list);
    }
    get_branch_parametric(data) {
        return this.http.get(this.url_branch + '/parametric/' + data);
    }
    save_branch(branch?: any) {
        return this.http.post(this.url_branch, branch, { headers: this.headers });
    }
    update_branch(branch?: any) {
        return this.http.put(this.url_branch, branch, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_hoze() {
        return this.http.get(this.url_hoze);
    }
    get_hoze_by_dep_name(dep_name) {
        return this.http.get(this.url_hoze + '/find/by_dep_name/' + dep_name);
    }
    get_hoze_by_dep_code(dep_code) {
        return this.http.get(this.url_hoze + '/find_by_dep_code/' + dep_code);
    }    
    save_hoze(hoze?: any) {
        return this.http.post(this.url_hoze, hoze, { headers: this.headers });
    }
    update_hoze(hoze?: any) {
        return this.http.put(this.url_hoze, hoze, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    getDepartmentSource() {
        return this.departmentSource;
    }
    setDepartmentSource(data) {
        this.departmentSubject.next(data);
    }
    //-------------------------------------------------------------------------
    getCircleTypeSource() {
        return this.circleTypeSource;
    }
    setCircleTypeSource(data) {
        this.circleTypeSubject.next(data);
    }
    //-------------------------------------------------------------------------
    getBranchSource() {
        return this.branchSource;
    }
    setBranchSource(data) {
        this.branchSubject.next(data);
    }
}