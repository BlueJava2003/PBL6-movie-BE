import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category_movie } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { createCategoryDTO } from './dto/createCategory.dto';
import { updateCategoryDTO } from './dto/updateCategory.dto';

@Injectable()
export class CategoryMovieService {
    constructor(private readonly prisma:PrismaService){}
    //create category
    async createCategoryMovie(data:createCategoryDTO):Promise<Category_movie>{
        try {
            const result = await this.prisma.category_movie.create({data:{...data}});
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
        
    }
    //get all category
    async getAllCategoryMovie():Promise<Category_movie[]>{
        try {
            const result = await this.prisma.category_movie.findMany({
                where:{
                    deleteAt:false
                }
            });
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
        
    }
    //get category id
    async getCategoryMovieId(id:number):Promise<Category_movie|[]>{
        try {
            const result = await this.prisma.category_movie.findUnique({
                where:{
                    id:id,
                    deleteAt:false
                }
            })
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }
    // update category 
    async updateCategoryMovie(updateDate: updateCategoryDTO,id:number):Promise<Category_movie>{
        try {
            const exited = await this.getCategoryById(id);
            if(!exited)
                throw new HttpException('id not found',HttpStatus.BAD_REQUEST)
            const result = await this.prisma.category_movie.update({
                where:{
                    id:id,
                    deleteAt:false
                },
                data:{
                    ...updateDate
                }
            })
            return result;
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
    }
    //delete category
    async deleteCategoryMovie(id:number):Promise<void>{
        try {
            const exited = await this.getCategoryById(id);
            if(!exited)
                throw new HttpException('id not found',HttpStatus.BAD_REQUEST)
            await this.prisma.category_movie.update({
                where:{
                    id:id
                },data:{
                    deleteAt:true
                }
            })
        } catch (error) {
            throw new HttpException(error,HttpStatus.BAD_REQUEST)
        }
        
    }
    async getCategoryById(id:number): Promise< {id:number} >{
        const userId = await this.prisma.category_movie.findUnique({
            where:{
                id:id,
                deleteAt:false
            }
        });
        return userId;
    }
}
