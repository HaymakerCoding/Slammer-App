import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAll(eventId) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/summary/get-all/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  add(eventId, text, type) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/summary/add/index.php';
    return this.http.post<any>(URL, { eventId, text, type }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Update a summary record
   * @param id record ID
   * @param text new text
   * @param type Type of Summary to update
   */
  update(id, text, type, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/summary/update/index.php';
    return this.http.patch<any>(URL, { id, text, type, eventId }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  delete(id, type, eventId) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('id', id).set('type', type).set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/summary/delete/index.php';
    return this.http.delete<any>(URL, { params, headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
