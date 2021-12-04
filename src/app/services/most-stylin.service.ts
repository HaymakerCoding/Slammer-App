import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MostStylinService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get the most stylin winner for a slammer event
   */
  get(eventId) {
    const params = new HttpParams().set('eventId', eventId);
    const URL = environment.API_URL + 'slammer-tour/most-stylin/get/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Add a new most stylin winner to an event
   * @param playerId Slammer ID of member to add
   * @param file Image File
   */
  add(playerId, file, fileExtension, fileName, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = environment.API_URL + 'slammer-tour/most-stylin/add/index.php';
    return this.http.post<any>(URL, { playerId, file, fileExtension, fileName, eventId }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Add a new most stylin winner to an event
   * @param playerId Slammer ID of member to add
   * @param file Image File
   * @param id RECORD ID
   */
  update(playerId, file, fileExtension, id, oldPicURL, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = environment.API_URL + 'slammer-tour/most-stylin/update/index.php';
    return this.http.patch<any>(URL, { playerId, file, fileExtension, id, oldPicURL, eventId}, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Delete a most style winner for an event
   * @param id record ID
   * @param picURL Image URL for s3 bucket
   */
  delete(id, picURL, eventId) {
    const headers = this.authService.getAuthHeader();
    const params = new HttpParams().set('id', id).set('picURL', picURL);
    const URL = environment.API_URL + 'slammer-tour/most-stylin/delete/index.php';
    return this.http.delete<any>(URL, { params, headers })
      .pipe(map(response => {
          return response;
      })
    );
  }


}
