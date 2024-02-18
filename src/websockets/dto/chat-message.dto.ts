import { IsNotEmpty, IsString } from 'class-validator';

export class ChatMessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;
}
