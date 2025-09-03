import { Controller, Get } from '@nestjs/common';
import { JokesService } from './jokes.service';
import { catchError, successResponse } from 'src/utils/response.util';

@Controller('jokes')
export class JokesController {
    constructor(private readonly jokesService: JokesService) { }

    @Get()
    async getJoke() {
        try {
            const data = await this.jokesService.getJoke();
            return successResponse("Jokes Fetched Successfully", data);
        } catch (error) {
            return catchError(error);
        }
    }
}
