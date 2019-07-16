import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScadaService {

  constructor(private http: HttpClient) { }

  changeRelayStatusSingle(relayNo: string, status: string, userId: string) {
    let header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let body = new HttpParams();
    body = body.set('relayNo', relayNo);
    body = body.set('status', status);
    body = body.set('userId', userId);
    return this.http.post<any>(environment.baseUrl + `/scada/relay-status`, body, {
      headers: header
    });
  }

  getRelayStatus(relayNo: string){
    let header = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    let params = new HttpParams();
    params = params.set('relay-no', relayNo);
    return this.http.post<any>(environment.baseUrl + `/scada/relay-status`, {
      headers: header,
      params: params
    });
  }

  changeRelayStatusAll(relayStatus, userId){
    let header = new HttpHeaders().set('Content-Type', 'application/json');
    let reqObj = {
      "relayStatus": relayStatus,
      "userId": userId
    }
    console.log(reqObj);
    return this.http.post<any>(environment.baseUrl + `/scada/relay-status/all`, reqObj, {
      headers: header
    });
  }

  getCurrent(username: string, ctRatio: string){
    return this.http.get<any>(environment.baseUrl + `/scada/current`, {params: {
      userId: username,
      ctRatio: ctRatio
    }});
  }
}
