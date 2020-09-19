import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export type EnvConfig = Record<string, any>;

@Injectable()
export class ConfigService {
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));
        console.log(config);
        this.envConfig = this.validateInput(config);
    }

    //#region Public Properties Getters

    /*
    * https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_process_env
    */
    get NODE_ENV(): string {
        return String(this.envConfig.NODE_ENV);
    }

    get TWAPI_CONSUMER_KEY(): string {
        return String(this.envConfig.TWAPI_CONSUMER_KEY);
    }

    get TWAPI_CONSUMER_SECRET(): string {
        return String(this.envConfig.TWAPI_CONSUMER_SECRET);
    }

    get TWAPI_ACCESS_TOKEN(): string {
        return String(this.envConfig.TWAPI_ACCESS_TOKEN);
    }

    get TWAPI_ACCESS_TOKEN_SECRET(): string {
        return String(this.envConfig.TWAPI_ACCESS_TOKEN_SECRET);
    }

    get TWAPI_TIMEOUT_MS(): number {
        return Number(this.envConfig.TWAPI_TIMEOUT_MS);
    }

    get TWAPI_STRICT_SSL(): boolean {
        return Boolean(this.envConfig.TWAPI_STRICT_SSL);
    }

    get TW_CACHE_TTL_MIN(): number {
        return Number(this.envConfig.TW_CACHE_TTL_MIN);
    }

    /* As Example of usage Refer to 'count' param on following:
    * https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline
    * https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-followers-list
    */
    get TWAPI_MAX_RECORDS_NUM_PER_REQUEST(): number {
        return Number(this.envConfig.TWAPI_MAX_RECORDS_NUM_PER_REQUEST);
    }

    get MAX_TWEETS_PER_REQUEST(): number {
        return Number(this.envConfig.MAX_TWEETS_PER_REQUEST);
    }

    get TWEETS_LANG(): string {
        return String(this.envConfig.TWEETS_LANG);
    }

    get MONGO_DB_HOST(): string {
        return String(this.envConfig.MONGO_DB_HOST);
    }

    get MONGO_DB_PORT(): number {
        return Number(this.envConfig.MONGO_DB_PORT);
    }

    get MONGO_DB_NAME(): string {
        return String(this.envConfig.MONGO_DB_NAME);
    }
    //#endregion

    /**
     * Ensures all needed variables are set, and returns the validated JavaScript object
     * including the applied default values.
     */
    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid('dev', 'pro', 'test')
                .default('dev'),
            TWAPI_CONSUMER_KEY: Joi.string().required(),
            TWAPI_CONSUMER_SECRET: Joi.string().required(),
            TWAPI_ACCESS_TOKEN: Joi.string().required(),
            TWAPI_ACCESS_TOKEN_SECRET: Joi.string().required(),
            TWAPI_TIMEOUT_MS: Joi.number().default(60000),
            TWAPI_STRICT_SSL: Joi.boolean().default(true),
            TWAPI_MAX_RECORDS_NUM_PER_REQUEST: Joi.number().default(200),
            MAX_TWEETS_PER_REQUEST: Joi.number().default(1000),
            TWEETS_LANG: Joi.string().default('en'),
            MONGO_DB_HOST: Joi.string(),
            MONGO_DB_PORT: Joi.number(),
            MONGO_DB_NAME: Joi.string(),
        });

        const { error, value: validatedEnvConfig } = envVarsSchema.validate(
            envConfig,
        );
        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }
        return validatedEnvConfig;
    }
}