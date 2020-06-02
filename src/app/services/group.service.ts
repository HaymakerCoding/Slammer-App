import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  getGroupNumbers(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/get-group-numbers/index.php', { params })
    .pipe(map(response => {
      return response;
    }));
  }

  getAllGroups(id: string) {
    const params = new HttpParams().set('id', id);
    return this.http.get<any>('https://clubeg.golf/common/api_REST/v1/slammer-tour/events/groups/get-all/index.php', { params })
    .pipe(map(response => {
      return response;
    }));
  }
}
