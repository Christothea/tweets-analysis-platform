export class ApiTweetsRequestParams {
    /* Ref: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
    */
    q?: string;
    /* depending on endpoint can be either an id or a comma separated list of ids
    */
    user_id?: any;
    /* depending on endpoint can be either an id or a comma separated list of screen_names
    */
    screen_name?: any;
    since_id?: number;
    max_id?: number;
    count?: number;
    trim_user?: boolean;
    exclude_replies?: boolean;
    include_rts?: boolean;

    include_entities?: boolean;

    /* Ref: https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-lookup
    */
    map?: boolean;
    /* Ref: https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-lookup
    */
    include_ext_alt_text?: boolean;
    /* Ref: https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-lookup
    */
    include_card_uri?: boolean;


    /* Ref: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
    */
    geocode?: any;
    /* Ref: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
    */
    lang?: string;
    /* Ref: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
    */
    locale?: string;
    /* Ref: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
    */
    result_type?: string;
    /* Ref: https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets
    */
    until?: Date;
}
