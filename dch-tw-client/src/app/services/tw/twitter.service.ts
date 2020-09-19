import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryRequest, SummaryStatistics } from '@dch/data-models';
import { environment } from '../../../environments/environment';
import { CacheService } from '../cache/cache.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private readonly http: HttpClient,
    private readonly cacheService: CacheService) { }

  public collectRequest() {
    if (this.cacheService.getKeywords().length === 0) {
      console.warn('Collect Request: No keywords');
      return;
    }

    const queryReq: QueryRequest = { keyWords: this.cacheService.getKeywords() };

    try {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.http.post(environment.collectRequestUrl, queryReq, httpOptions).subscribe(res => { console.log(res); });
    } catch (ex) {
      console.error(ex);
    }
  }

  public getStatistics(): Observable<SummaryStatistics> {
    try {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      return this.http.get<SummaryStatistics>(environment.statisticsRequestUrl, httpOptions);
      //.subscribe(res => { console.log(res); });
    } catch (ex) {
      console.error(ex);
    }
  }
}
