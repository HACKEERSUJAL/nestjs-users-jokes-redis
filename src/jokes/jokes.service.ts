import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class JokesService {
    private readonly logger = new Logger(JokesService.name);
    constructor(private readonly redisService: RedisService) { }

    async getJoke() {
        const cacheKey = "random_joke";
        try {
            const cached = await this.redisService.get(cacheKey);
            if (cached) {
                this.logger.log("Using cached data");
                return { source: "cache", joke: cached };
            }
            const { data } = await axios.get("https://official-joke-api.appspot.com/random_joke");

            await this.redisService.set(cacheKey, data, 10);
            this.logger.log("Returning joke from API ⚡");
            return { source: "api", joke: data };
        } catch (error) {
            this.logger.error("Failed to get joke", error);
            throw new Error("Failed to get joke");
        }
    }
}
