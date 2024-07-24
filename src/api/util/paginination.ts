import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaginationParamsDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interface/pagination.interface';

@Injectable()
export class PaginationService {
  constructor(private prisma: PrismaService) {}

  async paginate<T>(
    model: string,
    params: PaginationParamsDto,
    where: any = {},
    select: any = {},
    orderBy: any = {}
  ): Promise<PaginatedResult<T>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma[model].findMany({
        where,
        select,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma[model].count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }
}