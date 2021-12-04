import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getGroupNumbers(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(environment.API_URL + 'slammer-tour/events/get-group-numbers/index.php', { params })
    .pipe(map(response => {
      return response;
    }));
  }

  getAllGroups(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>(environment.API_URL + 'slammer-tour/events/groups/get-all/index.php', { params })
    .pipe(map(response => {
      return response;
    }));
  }
}
