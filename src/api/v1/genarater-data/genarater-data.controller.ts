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

    @Post('genarator-schedule')
    async generatorSchedule():Promise<{message:string,res:any}>{
        const result = await this.genaratorservice.createSchedule();
        return { message: 'Create successfully!', res: result };
    }

    @Post('genarator-seat-type')
    async generatorSeatType():Promise<{message:string,res:any}>{
        const result = await this.genaratorservice.createSeatType();
        return { message: 'Create successfully!', res: result };
    }

    @Post('genarator-seat')
    async generatorSeat():Promise<{message:string,res:any}>{
        const result = await this.genaratorservice.createSeat();
        return { message: 'Create successfully!', res: result };
    }

    @Post('genarator-room-seat')
    async generatorRoomSeat():Promise<{message:string,res:any}>{
        const result = await this.genaratorservice.createRoomSeat();
        return { message: 'Create successfully!', res: result };
    }

}
