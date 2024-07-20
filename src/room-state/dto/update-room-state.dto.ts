import { PartialType } from '@nestjs/swagger';
import { CreateRoomStateDto } from './create-room-state.dto';

export class UpdateRoomStateDto extends PartialType(CreateRoomStateDto) {}
