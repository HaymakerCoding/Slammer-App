import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WinnerPhotoService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  get(eventId) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/winner-photo/get/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Add a photo for the winner of this event
   * @param file Image File
   */
  add(file, fileExtension, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/winner-photo/add/index.php';
    return this.http.post<any>(URL, { file, fileExtension, eventId }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Update a photo for the winner of this event
   * We will do the update by the event ID rather than record ID since there can only be 1 per event.
   * @param file Image File
   */
  update(file, fileExtension, eventId, oldPicURL) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/winner-photo/update/index.php';
    return this.http.patch<any>(URL, { file, fileExtension, eventId, oldPicURL }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * DELETE the photo for the winner of this event
   * We will do the update by the event ID rather than record ID since there can only be 1 per event.
   * @param eventId Event ID
   */
  delete(eventId) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('eventId', eventId);
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/winner-photo/delete/index.php';
    return this.http.delete<any>(URL, { params, headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
