export enum ApiEndpoint {
    // Users Endpoints

    /* Search for specific user by specific user_id and/or screen_name
    * Ref: https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-show
    */
    TWITTER_PROFILE = 'users/show',
    /* Retreive a collection of user objects, Search by list of screen_name(s) and/or user_id(s)
    * Ref: https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-lookup
    */
    TWITTER_PROFILES_LOOKUP = 'users/lookup',
    /* Retreive a collection of user objects, Search by a query
    * Ref: https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-users-search
    */
    TWITTER_PROFILES_SEARCH = 'users/search',
    /* Returns a cursored collection of user objects for users following the specified user_id and/or screen_name
    * Ref: https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-followers-list
    */
    TWITTER_FOLLOWERS = 'followers/list',
    /* Returns a cursored collection of user objects for every user the specified user_id and/or username is following (otherwise known as their "friends").
    * Ref: https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-friends-list
    */
    TWITTER_FOLLOWING = 'friends/list',

    // Tweets endpoints

    /* Retrieve a collection of the most recent Tweets by specific user_id and/or screen_name
    * Ref: https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline
    */
    TWITTER_TWEETS = 'statuses/user_timeline',

    /* Returns a collection of relevant Tweets matching a specified query
    * Ref: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
    */
    TWITTER_TWEETS_SEARCH = 'search/tweets',

    /* Returns fully-hydrated Tweet objects for up to 100 Tweets per request, as specified by comma-separated values passed to the id parameter
     * Ref: https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-lookup
     */
    TWITTER_TWEETS_LOOKUP = 'statuses/lookup',

    /* Returns the 200 most recent Tweets liked by the authenticating or specified user_id and/or screen_name
    * Ref: https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-favorites-list
    */
    TWITTER_LIKES = 'favorites/list',

    // Tweets Trends Endpoints

    /* Returns the top 50 trending topics for a specific WOEID, if trending information is available for it
    * Ref: https://developer.twitter.com/en/docs/trends/trends-for-location/api-reference/get-trends-place
    */
    TWITTER_TRENDS_PLACE = 'trends/place',

    /* Returns the locations that Twitter has trending topic information for, closest to a specified location (required lat/long)
    * Ref: https://developer.twitter.com/en/docs/trends/locations-with-trending-topics/api-reference/get-trends-closest
    */
    TWITTER_TRENDS_CLOSEST = 'trends/closest',

    /* Returns the locations that Twitter has trending topic information for.
     * Ref: https://developer.twitter.com/en/docs/trends/locations-with-trending-topics/api-reference/get-trends-available
     */
    TWITTER_TRENDS_AVAILABLE = 'trends/available',
}
