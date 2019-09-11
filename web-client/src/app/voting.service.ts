import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';

import { Candidate } from './models/candidate';
import { CandidateList } from './models/candidate-list';

@Injectable({
  providedIn: 'root'
})
export class VotingService {

  private readonly API = '/api';

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<CandidateList[]>(this.API)
    .pipe(
      map((data: CandidateList[]) => {
        const list: Candidate[] = [];
        if (data) {
          data.forEach(c => list.push(c.value))
        }
        return list;
      }),
      take(1)
    );
  }

  loadByID(id) {
    return this.http.get<Candidate>(`${this.API}/${id}`).pipe(take(1));
  }

  create(candidateName: string) {
    return this.http.post(this.API, {candidateName}).pipe(take(1));
  }

  castVote(candidateName: string) {
    return this.http.put(`${this.API}/${candidateName}`, null).pipe(take(1));
  }
}
