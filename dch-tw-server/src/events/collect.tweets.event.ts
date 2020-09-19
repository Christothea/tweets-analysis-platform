import { TweetsSearchParams } from '../models/tweets.search.params';

export class CollectTweetsEvent {
    constructor(public params: TweetsSearchParams) { }
}
