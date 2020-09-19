import twit = require('twit');
import { Injectable } from '@nestjs/common';
import { ApiEndpoint } from './api.endpoint';
import { ConfigService } from '../../env_config/config.service';

@Injectable()
export class ApiClientService {
    private apiClient: any;

    constructor(private readonly envConfig: ConfigService) {
    }

    public start() {
        console.log('Start Twitter API Client Connection');
        try {
            this.apiClient = new twit({
                consumer_key: this.envConfig.TWAPI_CONSUMER_KEY,
                consumer_secret: this.envConfig.TWAPI_CONSUMER_SECRET,
                access_token: this.envConfig.TWAPI_ACCESS_TOKEN,
                access_token_secret: this.envConfig.TWAPI_ACCESS_TOKEN_SECRET,
                timeout_ms: this.envConfig.TWAPI_TIMEOUT_MS,
                strictSSL: this.envConfig.TWAPI_STRICT_SSL,
            });
        } catch (ex) {
            console.error('Error Start Twitter API Client Connection');
        }
    }

    public async fetchRequest(endpointType: ApiEndpoint, params: any): Promise<any> {
        try {
            if (!params) {
                console.error('Error on Fetch Request: Invalid Parameters');
                console.error(params);
                return undefined;
            }

            const response = await this.apiClient.get(endpointType, params).catch((e) => {
                console.error('Error on Twitter API Fetch Request');
                console.error(params);
                console.error(e.stack);
            });

            if (!response || !response.resp) {
                console.error(`Error Twitter API Fetch Request Failed: General Error`);
                console.error(params);
            } else if (response.resp.statusCode === 200) {
                return response.data;
            } else if (response.resp.statusCode === 429) { // Reached requests limit
                console.warn(`Warning Twitter API Reached Requests Limit: ${response.resp.statusCode}`);
                console.warn(params);
            } else {
                console.error(`Error Twitter API Fetch Request Failed: ${response.resp.statusCode}`);
                console.error(params);
            }
        } catch (ex) {
            console.error(`Error Twitter API Fetch Request Exception`);
            console.error(params);
            console.error(ex.stack);
        }

        return undefined;
    }
}
