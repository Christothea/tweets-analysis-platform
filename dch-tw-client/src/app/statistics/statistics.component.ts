import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { TwitterService } from '../services/tw/twitter.service';
import { SummaryStatistics, SummaryStatRecord } from '@dch/data-models';
import { CloudOptions, CloudData } from 'angular-tag-cloud-module';
import { Observable, of } from 'rxjs';
import { CacheService } from '../services/cache/cache.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  @ViewChild('tweetingChart', { static: false }) tweetingchart: BaseChartDirective;
  @ViewChild('mentionedChart', { static: false }) mentionedchart: BaseChartDirective;
  @ViewChild('wordsCountChart', { static: false }) wordsCountchart: BaseChartDirective;

  // Common Charts Options
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartColors: Color[] = [
    { backgroundColor: 'blue' }
  ];

  // Most Tweeting Users chart
  tweetingLabels: Label[] = new Array();
  tweetingChartData: ChartDataSets[] = new Array();

  // Most mentioned users chart
  mentionedLabels: Label[] = new Array();
  mentionedChartData: ChartDataSets[] = new Array();

  // Most used words chart
  wordsCountLabels: Label[] = new Array();
  wordsCountChartData: ChartDataSets[] = new Array();

  // Words Cloud
  wordsCloudOptions: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value
    width: 1000,
    height: 400,
    overflow: false,
  };

  wordsCloudData: CloudData[] = [{ text: 'Words Cloud', weight: 5 }];

  constructor(private readonly twService: TwitterService,
    private readonly cacheService: CacheService) { }

  ngOnInit() {
    this.initCharts();
    this.twService.getStatistics().subscribe(this.processStatistics.bind(this));
  }

  initCharts() {
    this.tweetingLabels = [''];
    this.tweetingChartData = [
      { data: [], label: 'Most Tweeting Users' }
    ];

    this.mentionedLabels = [''];
    this.mentionedChartData = [
      { data: [], label: 'Most Mentioned Users' }
    ];

    this.wordsCountLabels = [''];
    this.wordsCountChartData = [
      { data: [], label: 'Most Used Words' }
    ];
  }

  processStatistics(stats: SummaryStatistics) {
    if (!stats) {
      return;
    }

    this.cacheService.updateSummaryStatistics(stats);

    // Most Tweeting Users
    const tweetingUsers: SummaryStatRecord[] = Object.values(this.cacheService.summaryStatistics.usersTweetsCount);
    const topTweetingNum = tweetingUsers.length < 20 ? tweetingUsers.length : 20;
    const topTweeting = tweetingUsers.sort((u1, u2) => u2.count - u1.count).slice(0, topTweetingNum - 1);

    this.tweetingLabels = topTweeting.map(r => r.label);
    this.tweetingChartData = [{ data: topTweeting.map(r => r.count), label: `Most Tweeting Users` }];

    // // Most Mentioned Users
    const mentionedUsers: SummaryStatRecord[] = Object.values(this.cacheService.summaryStatistics.mentionedCount);
    const topMentionedNum = mentionedUsers.length < 20 ? mentionedUsers.length : 20;
    const topMentioned = mentionedUsers.sort((u1, u2) => u2.count - u1.count).slice(0, topMentionedNum - 1);

    this.mentionedLabels = topMentioned.map(r => r.label);
    this.mentionedChartData = [{ data: topMentioned.map(r => r.count), label: `Most Mentioned Users` }];

    // // Most Used Words
    const wordsCounts: SummaryStatRecord[] = Object.values(this.cacheService.summaryStatistics.wordsCounts);
    const topUsedWordsNum = wordsCounts.length < 20 ? wordsCounts.length : 20;
    const topUsedWords = wordsCounts.sort((u1, u2) => u2.count - u1.count).slice(0, topUsedWordsNum - 1);

    this.wordsCountLabels = topUsedWords.map(r => r.label);
    this.wordsCountChartData = [{ data: topUsedWords.map(r => r.count), label: `Most Used Words` }];


    // Words Cloud
    const maxWordsNum = wordsCounts.length < 500 ? wordsCounts.length : 500;
    const limitedWordsCounts = wordsCounts.sort((u1, u2) => u2.count - u1.count).slice(0, maxWordsNum - 1);
    const changedData: Observable<CloudData[]> = of(limitedWordsCounts.map(w => ({ text: w.label, weight: w.count })));

    changedData.subscribe(res => this.wordsCloudData = res);
  }
}
