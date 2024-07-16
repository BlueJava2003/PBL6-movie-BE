import { Body, Controller, HttpCode, Param, ParseIntPipe,Put, Post,Get,Delete, UseGuards } from '@nestjs/common';
import { CategoryMovieService } from './category-movie.service';
import { createCategoryDTO } from './dto/createCategory.dto';
import { updateCategoryDTO } from './dto/updateCategory.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.gruad';
import { RolesGuard } from '../auth/role.gruad';
import { Roles } from 'src/api/decorator/role.decorator';
import { Role } from '@prisma/client';
@ApiBearerAuth()
@ApiTags('category-movie')
@Controller('category-movie')
export class CategoryMovieController {
    constructor(private readonly categoryMovieService:CategoryMovieService){}
    //create category movie
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('createCategoryMovie')
    @HttpCode(200)
    async createCategoryMovie(@Body() body:createCategoryDTO):Promise<{message:string,res:any}>{
        const result = await this.categoryMovieService.createCategoryMovie(body)
        return {message:'Create category movie successfully', res:result}
    }
    //update category movie
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put('updateCategoryMovie/:id')
    @HttpCode(200)
    async updateCategoryMovie(@Body() body:updateCategoryDTO, @Param('id',ParseIntPipe) id:number):Promise<{message:string,res:any}>{
        const result = await this.categoryMovieService.updateCategoryMovie(body,id)
        return {message:'Update category movie successfully', res:result}
    }
    //get all category movie
    @Get('getAllCategoryMovie')
    @HttpCode(200)
    async getAllCategoryMovie (): Promise<{message:string,res:any}>{
        const result = await this.categoryMovieService.getAllCategoryMovie()
        return {message:'Get list category movie successfully', res:result}
    }
    // get category moive id
    @Get('getCategoryMovieId/:id')
    @HttpCode(200)
    async getCategoryMovieId (@Param('id',ParseIntPipe) id:number): Promise<{message:string,res:any}>{
        const result = await this.categoryMovieService.getCategoryMovieId(id)
        return {message:`Get category movie id ${id} successfully`, res:result}
    }
    //delete category movie
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('deleteCategory/:id')
    @HttpCode(200)
    async deleteCategory (@Param('id',ParseIntPipe) id:number): Promise<{message:string}>{
        await this.categoryMovieService.deleteCategoryMovie(id)
        return {message:`Delete category movie id ${id} successfully`}
    }
}
