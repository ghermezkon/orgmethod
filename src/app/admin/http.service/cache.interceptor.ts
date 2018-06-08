import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import 'rxjs/add/operator/do';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache = {};

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method !== "GET") {
            if(this.cache[request.urlWithParams])
                this.cache[request.urlWithParams] = null;
            return next.handle(request);
        }
        const cachedResponse = this.cache[request.urlWithParams] || null;
        if (cachedResponse) {
            return of(cachedResponse);
        }

        return next.handle(request).do(event => {
            if (event instanceof HttpResponse) {
                this.cache[request.urlWithParams] = event;
            }
        });
    }
}