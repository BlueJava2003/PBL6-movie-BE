import { Body, Controller, Post, Query } from '@nestjs/common';
import { GenaraterDataService } from './genarater-data.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GeneratorDataDto } from './dto/generator.dto';
import { ModelDto } from './dto/model.dto';

@ApiBearerAuth()
@ApiTags('generator data')
@Controller('data')
export class GenaraterDataController {
    constructor(private readonly genaratorservice:GenaraterDataService){}

    @Post('genarator-category')
    async generatorCategory():Promise<{message:string,res:any}>{
        const result = await this.genaratorservice.createCategory();
        return { message: 'Create successfully!', res: result };
    }

    @Post('genarator-movie')
    async generatorMovie():Promise<{message:string,res:any}>{
        const result = await this.genaratorservice.createMovie();
        return { message: 'Create successfully!', res: result };
    }

    @Post('genarator-room')
    async generatorRoom():Promise<{message:string,res:any}>{
        const result = await this.genaratorservice.createRoom();
        return { message: 'Create successfully!', res: result };
    }

}
