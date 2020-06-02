import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PlayerScores } from '../models/PlayerScores';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScoresService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Get all scores for an event for each player
   */
  getAllScores(eventId: number) {
    const params = new HttpParams().set('eventId', eventId.toString());
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/scores/get-all-for-event/index.php';
    return this.http.get<any>(URL, { params })
      .pipe(map(response => {
          return response;
      })
    );
  }

  /**
   * Update a players scores for this evnt
   * @param scores Player Scores object containing record info
   * @param eventId  Event PK
   */
  update(scores: PlayerScores, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/scores/update/index.php';
    return this.http.patch<any>(URL, { scores, eventId }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

  initScores(playerId, eventId) {
    const headers = this.authService.getAuthHeader();
    const URL = 'https://clubeg.golf/common/api_REST/v1/slammer-tour/events/scores/init/index.php';
    return this.http.post<any>(URL, { playerId, eventId }, { headers })
      .pipe(map(response => {
          return response;
      })
    );
  }

}
