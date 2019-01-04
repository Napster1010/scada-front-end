import { ScadaService } from './../services/scada-service/scada.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operate-relay',
  templateUrl: './operate-relay.component.html',
  styleUrls: ['./operate-relay.component.css']
})
export class OperateRelayComponent implements OnInit {
  currentStatusR: string;
  currentStatusY: string;
  currentStatusB: string;
  
  currentSelectionMode: string = 'single';
  
  loading: boolean;



  constructor(private router: Router, private scadaService: ScadaService) {
    this.currentStatusR = 'OFF';
    this.currentStatusY = 'OFF';
    this.currentStatusB = 'OFF';
  }

  currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'))['role'];
  }

  ngOnInit() {
  }

  selectionMode(mode: string) {
    if (mode === 'single')
      this.currentSelectionMode = 'single';
    else
      this.currentSelectionMode = 'all';
  }

  changeVarStatusSingle(phase: string) {
    if (phase === 'R') {
      if (this.currentStatusR === 'OFF')
        this.currentStatusR = 'ON';
      else
        this.currentStatusR = 'OFF'
    }
    else if (phase === 'Y') {
      if (this.currentStatusY === 'OFF')
        this.currentStatusY = 'ON';
      else
        this.currentStatusY = 'OFF'
    }
    else if (phase === 'B') {
      if (this.currentStatusB === 'OFF')
        this.currentStatusB = 'ON';
      else
        this.currentStatusB = 'OFF'
    }
  }

  changeVarStatusAll() {
    if (this.currentStatusR === 'OFF')
      this.currentStatusR = 'ON';
    else
      this.currentStatusR = 'OFF'
    if (this.currentStatusY === 'OFF')
      this.currentStatusY = 'ON';
    else
      this.currentStatusY = 'OFF'
    if (this.currentStatusB === 'OFF')
      this.currentStatusB = 'ON';
    else
      this.currentStatusB = 'OFF'
  }

  invert(status: string){
    if(status==='ON')
      return 'OFF';
    else if(status==='OFF')
      return 'ON';  
  }

  changeStatus(phase: string) {
    this.loading = true;
    if (this.currentSelectionMode === 'single') {
      let currentStatus: string;
      if (phase === 'R')
        currentStatus = this.invert(this.currentStatusR);
      else if (phase === 'Y')
        currentStatus = this.invert(this.currentStatusY);
      else if (phase === 'B')
        currentStatus = this.invert(this.currentStatusB);

      this.scadaService.changeRelayStatusSingle(phase, currentStatus, JSON.parse(localStorage.getItem('currentUser'))['userId']).subscribe(
        data => {
          console.log("REQUEST PROCESSED SUCCESSFULLY!!");
          console.log(data);
          this.changeVarStatusSingle(phase);          
        },
        error => {
          console.log("SOME ERROR OCCURRED!!!")
          console.log(error);
        }
      );
    }
    else {
      let newStatusR: string = this.invert(this.currentStatusR);
      let newStatusY: string = this.invert(this.currentStatusY);
      let newStatusB: string = this.invert(this.currentStatusB);    
            
      let relayStatus = {
        "R": newStatusR,
        "Y": newStatusY,
        "B": newStatusB
      }

      this.scadaService.changeRelayStatusAll(relayStatus, JSON.parse(localStorage.getItem('currentUser'))['userId']).subscribe(
        data => {
          console.log("REQUEST PROCESSED SUCCESSFULLY!!");
          console.log(data);
          this.changeVarStatusAll();
        },
        error => {
          console.log("SOME ERROR OCCURRED!!!")
          console.log(error);
        }
      )
    }

  }
}
