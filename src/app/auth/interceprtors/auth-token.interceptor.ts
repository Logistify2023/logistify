import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { first, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()

export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(
    private _authService: AuthService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this._authService.isLoggedIn$.pipe(
      first(),
      switchMap((isLoggeIn) => {
        if (isLoggeIn === false) {
          return next.handle(request);
        }

        return this._authService.user$.pipe(
          first(Boolean),
          switchMap(({ token }) => {
            const headers = request.headers.append(
              'Authorization',
              `Bearer ${token}`
            );
            return next.handle(request.clone({ headers }));
          })
        );
      })
    );
  }
}

export const authTokeninterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthTokenInterceptor,
  multi: true,
};