import { Injectable } from '@angular/core';
import { Keyword } from '../../models/keyword';
import { SummaryStatistics } from '@dch/data-models';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  public keywords: Keyword[] = [];
  public summaryStatistics: SummaryStatistics = new SummaryStatistics();

  constructor() { }

  public addKeyword(keyword: Keyword) {
    let exists;

    for (const k of this.keywords) {
      if (k.text.trim().toLocaleLowerCase() == keyword.text.trim().toLocaleLowerCase()) {
        exists = true;
        break;
      }
    }

    if (exists) {
      return;
    }

    this.keywords.push(keyword);
  }

  public removeKeyword(keyword) {
    const index = this.keywords.indexOf(keyword);

    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  public getKeywords(): string[] {
    return this.keywords.map(k => k.text);
  }

  public updateSummaryStatistics(stats) {
    this.summaryStatistics = stats;
  }

}
