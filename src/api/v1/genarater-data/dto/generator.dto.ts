import { ApiProperty } from '@nestjs/swagger';
export class GeneratorDataDto {
  @ApiProperty({
    description: 'Data array',
    example: [{ a: 'value' }, { b: 'value' }],
  })
  data: Record<string, any>[];
}
