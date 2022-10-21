import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'keys/environments/environment.prod';
import { MessageFCM } from '../models/message-fcm';

interface ResponseToken {
  result?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor(private httpClient: HttpClient) {}

  async sendMessage(message: MessageFCM): Promise<boolean> {
    let response = await this.tokenOAuthGoogleApi();
    return await new Promise((resolve, reject) => {
      if (response && response.result) {
        let httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${response.result}`,
          }),
        };
        this.httpClient
          .post<ResponseToken>(
            environment.apiSendMessage,
            JSON.stringify(message),
            httpOptions
          )
          .pipe(retry(2), catchError(this.handleError))
          .subscribe(() => {
            resolve(true);
          });
      } else {
        reject(false);
      }
    });
  }

  private async tokenOAuthGoogleApi(): Promise<ResponseToken> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Auth: environment.privateKeyID,
      }),
    };
    return await new Promise((resolve) => {
      this.httpClient
        .get<ResponseToken>(environment.apiOauthToken, httpOptions)
        .pipe(retry(2), catchError(this.handleError))
        .subscribe((response) => {
          resolve(response);
        });
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => errorMessage);
  }
}
