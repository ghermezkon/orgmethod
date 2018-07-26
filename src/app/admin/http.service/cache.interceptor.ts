import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from "@angular/common/http";
import 'rxjs/add/operator/do';
import { tap } from "rxjs/operators";
import { Observable, of } from "rxjs";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache = {};

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method !== "GET") {
            if (this.cache[request.urlWithParams])
                this.cache[request.urlWithParams] = null;
            return next.handle(request);
        }
        const cachedResponse = this.cache[request.urlWithParams] || null;
        if (cachedResponse) {
            return of(cachedResponse);
        }

        return next.handle(request).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cache[request.urlWithParams] = event;
                }
            }));
    }
}