import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GlobalHttpService } from './global.http.service';
import * as _ from 'lodash';
import { DepartmentHttpService } from './http.dep.service';
import { map } from 'rxjs/operators';
import { BranchWorkHttpService } from './http.branchwork.service';

@Injectable()
export class HttpBankResolver implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_bank();
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class HttpOstanResolver implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_ostan().pipe(map(res => _.orderBy(res, ['ostan_code'])));
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class HttpDepTypeResolver implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_deptype().pipe(map(res => _.orderBy(res, ['deptype_code'])));
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class HttpEquipmentResolver implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_equipment().pipe(map(res => _.orderBy(res, ['equipment_code'])));
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class HttpDepartmentResolver implements Resolve<Observable<any>> {

    constructor(private _http: DepartmentHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_department().pipe(map(res => _.orderBy(res, ['dep_code'])));
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class HttpCircleTypeResolver implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_circletype().pipe(map(res => _.orderBy(res, ['circletype_code'])));
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class HttpPostTypeResolver implements Resolve<Observable<any>> {

    constructor(private _http: GlobalHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http.get_all_posttype().pipe(map(res => _.orderBy(res, ['posttype_code'])));
    }
}
//----------------------------------------------------------------------------------------------
@Injectable()
export class HttpMahDateResolver implements Resolve<Observable<any>> {

    constructor(private _http_branch: BranchWorkHttpService) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this._http_branch.get_distinct_mah_date().pipe(map(res => _.orderBy(res)));
    }
}
//----------------------------------------------------------------------------------------------
