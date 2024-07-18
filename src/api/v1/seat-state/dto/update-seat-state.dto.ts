import { PartialType } from '@nestjs/swagger';
import { CreateSeatStateDto } from './create-seat-state.dto';

export class UpdateSeatStateDto extends PartialType(CreateSeatStateDto) {}
