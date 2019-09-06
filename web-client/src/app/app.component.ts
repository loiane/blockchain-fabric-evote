import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AlertComponent } from 'ngx-bootstrap/alert/public_api';
import { Observable } from 'rxjs';

import { Candidate } from './models/candidate';
import { VotingService } from './voting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {

  list$: Observable<Candidate[]>;
  candidateVote = new FormControl(null, [Validators.required]);
  candidateNew = new FormControl(null, [Validators.required]);
  savingVote = false;
  savingCreate = false;
  alerts: any[] = [];

  constructor(private service: VotingService) {}

  ngOnInit() {
    this.listAllCandidates();
  }

  listAllCandidates() {
    this.list$ = this.service.list();
  }

  castVote() {
    this.savingVote = true;
    this.service.castVote(this.candidateVote.value)
    .subscribe(res => {
      this.savingVote = false;
      this.listAllCandidates();
      this.alerts.push({
        type: 'success',
        msg: 'Vote casted successfully for candidate ' + this.candidateVote.value,
        timeout: 5000
      });
    },
    error => {
      this.savingVote = false;
      this.alerts.push({
        type: 'danger',
        msg: 'Candidate does not exist.',
        timeout: 5000
      });
    });
  }

  createCandidate() {
    this.savingCreate = true;
    this.service.create(this.candidateNew.value)
    .subscribe(res => {
      this.savingCreate = false;
      this.listAllCandidates();
      this.alerts.push({
        type: 'success',
        msg: 'Candidate ' + this.candidateNew.value + ' created successfully.',
        timeout: 5000
      });
    },
    error => {
      this.savingCreate = false;
      this.alerts.push({
        type: 'danger',
        msg: 'Candidate already exists.',
        timeout: 5000
      });
    });
  }

  onClosed(dismissedAlert: AlertComponent) {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }
}
