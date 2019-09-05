import { Component, OnInit } from '@angular/core';
import { VotingService } from './voting.service';
import { Observable } from 'rxjs';
import { Candidate } from './models/candidate';
import { FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  list$: Observable<Candidate[]>;
  candidateVote = new FormControl(null, [Validators.required]);
  candidateNew = new FormControl(null, [Validators.required]);

  constructor(private service: VotingService) {}

  ngOnInit() {
    this.listAllCandidates();
  }

  listAllCandidates() {
    this.list$ = this.service.list();
  }

  castVote() {
    console.log(this.candidateVote.value);
    this.service.castVote(this.candidateVote.value)
    .subscribe(res => {
      console.log(res);
      this.listAllCandidates();
    });
  }

  createCandidate() {
    console.log(this.candidateNew.value);
    this.service.create(this.candidateNew.value)
    .subscribe(res => {
      console.log(res);
      this.listAllCandidates();
    });
  }
}
