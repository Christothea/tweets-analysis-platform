import { Component, OnInit } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { CacheService } from '../services/cache/cache.service';
import { Keyword } from '../models/keyword';
import { ThemePalette } from '@angular/material';
import { TwitterService } from '../services/tw/twitter.service';

@Component({
  selector: 'app-keywords',
  templateUrl: './keywords.component.html',
  styleUrls: ['./keywords.component.css']
})
export class KeywordsComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER];

  constructor(private readonly cacheService: CacheService,
              private readonly twService: TwitterService) { }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.cacheService.addKeyword({ text: value.trim(), color: this.getChipColor(value) });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(keyword: Keyword): void {
    this.cacheService.removeKeyword(keyword);
  }

  verify() {
    this.twService.collectRequest();
  }

  getChipColor(text: string): ThemePalette {
    if (text.startsWith('@')) {
      return 'warn';
    }

    if (text.startsWith('#')) {
      return 'accent';
    }

    return 'primary';
  }
}
