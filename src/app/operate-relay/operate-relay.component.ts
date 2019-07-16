import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { ScadaService } from './../services/scada-service/scada.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: 'app-operate-relay',
  templateUrl: './operate-relay.component.html',
  styleUrls: ['./operate-relay.component.css']
})
export class OperateRelayComponent implements OnInit {
  currentStatusR: string;
  currentStatusY: string;
  currentStatusB: string;

  ctRatioVal: string = "1"; 
  ctRatio: string = "20"; 
  currentReadSuccess: boolean = true;
  
  currentSelectionMode: string = 'single';
  
  loading: boolean;

  cAlive: boolean;
  rPhaseCurrent: string = "0.0";
  yPhaseCurrent: string = "0.0";
  bPhaseCurrent: string = "0.0";  


  constructor(private router: Router, private scadaService: ScadaService) {
    this.currentStatusR = 'OFF';
    this.currentStatusY = 'OFF';
    this.currentStatusB = 'OFF';
  }

  currentUser() {
    return JSON.parse(localStorage.getItem('currentUser'))['role'];
  }

  ctRatioChange(){
    if(this.ctRatioVal=="1"){
      this.ctRatio = "20";
    }else if(this.ctRatioVal=="2"){
      this.ctRatio = "40";
    }else if(this.ctRatioVal=="3"){
      this.ctRatio = "60";
    }
  }

  ngOnInit() {
    this.cAlive = true;

    this.scadaService.getCurrent(JSON.parse(localStorage.getItem('currentUser'))['userId'], this.ctRatio).subscribe(
      data => {
        console.log(data);
        this.rPhaseCurrent = data['rPhaseCurrent'];
        this.bPhaseCurrent = data['bPhaseCurrent'];
        this.yPhaseCurrent = data['yPhaseCurrent'];
        if(this.currentReadSuccess==false)
          this.currentReadSuccess = true;
      },error => {
        console.log("SOME ERROR OCCURRED!!");
        console.log(error);
        if(this.currentReadSuccess==true)
          this.currentReadSuccess = false;
      });

    IntervalObservable.create(5000)
      .takeWhile(() => this.cAlive)
      .subscribe(() => {
        this.scadaService.getCurrent(JSON.parse(localStorage.getItem('currentUser'))['userId'], this.ctRatio).subscribe(
          data => {
            console.log(data);
            this.rPhaseCurrent = data['rPhaseCurrent'];
            this.bPhaseCurrent = data['bPhaseCurrent'];
            this.yPhaseCurrent = data['yPhaseCurrent'];
            if(this.currentReadSuccess==false)
              this.currentReadSuccess = true;
          },error => {  
            console.log("SOME ERROR OCCURRED!!");
            console.log(error);
            if(this.currentReadSuccess==true)
              this.currentReadSuccess = false;
          }
        );
        
        this.scadaService.getRelayStatus("R").subscribe(
          data => {
            this.currentStatusR = data;
          }, error => {
            console.log(error);
          }
        );

        this.scadaService.getRelayStatus("Y").subscribe(
          data => {
            this.currentStatusY = data;            
          }, error => {
            console.log(error);
          }
        );

        this.scadaService.getRelayStatus("B").subscribe(
          data => {
            this.currentStatusB = data;            
          }, error => {
            console.log(error);
          }
        );
      });
  }

  ngOnDestroy(){
    this.cAlive = false;
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
    if(this.currentUser() === 'admin'){
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
            alert("Couldn't change the status!");
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
            alert("Couldn't change the status!");
            console.log("SOME ERROR OCCURRED!!!")
            console.log(error);
          }
        )
      }  
    }else{
      alert('User not authorized to do this operation !!');
    }
  }
}
