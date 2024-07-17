import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MovieService } from './movie.service';
import { createMovieDTO } from './dto/createMovie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { updateMovieDTO } from './dto/updateMovie.dto';
import { AuthGuard } from '../auth/auth.gruad';
import { RolesGuard } from '../auth/role.gruad';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from '@prisma/client'

@ApiBearerAuth()
@ApiTags('movie')
@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService){}
    //create movie
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('createMovie')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            name:{ type: 'string' },
            duration:{ type: 'integer' },
            releaseDate:{ type: 'date' },
            desc:{ type: 'string' },
            categoryId:{ type: 'integer' },
            director:{ type: 'string' },
            actor:{ type: 'string' },
            language:{ type: 'string' },
            urlTrailer:{ type: 'string' },
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @UseInterceptors(FileInterceptor('file'))
    async createMovie(@UploadedFile() file: Express.Multer.File,@Body() body:createMovieDTO):Promise<{message:string,res:any}>{
 
        const result = await this.movieService.createMovie(body,file);
        return { message:'Create movie successfully',res:result };
    }

    //get all movie
    @Get('getAllMovie')
    async getAllMovie():Promise<{message:string,res:any}>{
        const result = await this.movieService.getAllMovie()
        return { message:'Get list movie successfully',res:result };
    }

    //get movie id
    @Get('getMovieId/:id')
    async getMovieId(@Param('id',ParseIntPipe) id:number):Promise<{message:string,res:any}>{
        const result = await this.movieService.getMovieId(id)
        return { message:`Get movie id ${id} successfully`,res:result };
    }

    //update movie
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            name:{ type: 'string' },
            duration:{ type: 'integer' },
            releaseDate:{ type: 'date' },
            desc:{ type: 'string' },
            categoryId:{ type: 'integer' },
            director:{ type: 'string' },
            actor:{ type: 'string' },
            language:{ type: 'string' },
            urlTrailer:{ type: 'string' },
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @UseInterceptors(FileInterceptor('file'))
    @Put('upadteMovie/:id')
    async updateMovie(
        @Param('id',ParseIntPipe) id:number,
        @Body() body:updateMovieDTO,
        @UploadedFile() file: Express.Multer.File)
        :Promise<{message:string}>
    {
        await this.movieService.updateMovie(body,id,file)
        return {message:`Update movie id ${id} successFully`}
    }

    //delete movie
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('deleteMovie/:id')
    async deleteMovie(@Param('id',ParseIntPipe) id:number):Promise<{message:string}>{
        await this.movieService.deleteMovie(id)
        return {message:`Delete movie id ${id} successFully`}
    }
}
