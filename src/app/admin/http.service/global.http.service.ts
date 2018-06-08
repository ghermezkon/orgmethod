import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs";

@Injectable()
export class GlobalHttpService {
    table_bank: any = 'api/org_bank';
    table_state: any = 'api/org_state';
    //-------------------------------------------------------------------------
    headers: any;
    url_date: any = environment.apiEndPoint + 'currentDate';
    url: any = environment.apiEndPoint + this.table_bank;
    url_ostan: any = environment.apiEndPoint + this.table_state + '/ostan';
    url_city: any = environment.apiEndPoint + this.table_state + '/city';
    url_deptype: any = environment.apiEndPoint + this.table_state + '/deptype';
    url_equipment: any = environment.apiEndPoint + this.table_state + '/equipment';
    url_circletype: any = environment.apiEndPoint + this.table_state + '/circletype';
    url_posttype: any = environment.apiEndPoint + this.table_state + '/posttype';
    url_tablecode: any = environment.apiEndPoint + this.table_state + '/tablecode';
    //-------------------------------------------------------------------------
    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders().set('enctype', 'multipart/form-data');
    }
    //-------------------------------------------------------------------------
    get_current_date() {
        return this.http.get(this.url_date);
    }
    //-------------------------------------------------------------------------
    get_all_bank() {
        return this.http.get(this.url);
    }
    save_bank(bank?: any) {
        return this.http.post(this.url, bank, { headers: this.headers });
    }
    update_bank(bank?: any) {
        return this.http.put(this.url, bank, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_ostan() {
        return this.http.get(this.url_ostan);
    }
    validate_ostan(ostan_code, ostan_name) {
        return this.http.get(this.url_ostan + '/validate_ostan/' + ostan_code + '/' + ostan_name);
    }
    save_ostan(ostan?: any) {
        return this.http.post(this.url_ostan, ostan, { headers: this.headers });
    }
    update_ostan(ostan?: any) {
        return this.http.put(this.url_ostan, ostan, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_city() {
        return this.http.get(this.url_city);
    }
    get_city_by_ostan_name(ostan_name) {
        return this.http.get(this.url_city + '/find/by_ostan_name/' + ostan_name);
    }
    save_city(city?: any) {
        return this.http.post(this.url_city, city, { headers: this.headers });
    }
    update_city(city?: any) {
        return this.http.put(this.url_city, city, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_deptype() {
        return this.http.get(this.url_deptype);
    }
    save_deptype(deptype?: any) {
        return this.http.post(this.url_deptype, deptype, { headers: this.headers });
    }
    update_deptype(deptype?: any) {
        return this.http.put(this.url_deptype, deptype, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_equipment() {
        return this.http.get(this.url_equipment);
    }
    save_equipment(equipment?: any) {
        return this.http.post(this.url_equipment, equipment, { headers: this.headers });
    }
    update_equipment(equipment?: any) {
        return this.http.put(this.url_equipment, equipment, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_circletype() {
        return this.http.get(this.url_circletype);
    }
    save_circletype(circletype?: any) {
        return this.http.post(this.url_circletype, circletype, { headers: this.headers });
    }
    update_circletype(circletype?: any) {
        return this.http.put(this.url_circletype, circletype, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_posttype() {
        return this.http.get(this.url_posttype);
    }
    get_all_posttype_by_group(data?: any) {
        return this.http.get(this.url_posttype + '/' + data);
    }
    save_posttype(posttype?: any) {
        return this.http.post(this.url_posttype, posttype, { headers: this.headers });
    }
    update_posttype(posttype?: any) {
        return this.http.put(this.url_posttype, posttype, { headers: this.headers });
    }
    //-------------------------------------------------------------------------
    get_all_tablecode() {
        return this.http.get(this.url_tablecode);
    }
    get_all_tablecode_by_table_id(table_id) {
        return this.http.get(this.url_tablecode + '/find_by_table_name/' + table_id);
    }
    save_tablecode(tablecode?: any) {
        return this.http.post(this.url_tablecode, tablecode, { headers: this.headers });
    }
    update_tablecode(tablecode?: any) {
        return this.http.put(this.url_tablecode, tablecode, { headers: this.headers });
    }
}