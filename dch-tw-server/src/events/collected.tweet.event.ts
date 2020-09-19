import {TweetDataDb} from '../cache/models/tweet.data';

export class CollectedTweetEvent {
    constructor(public tweetData: TweetDataDb) {}
}