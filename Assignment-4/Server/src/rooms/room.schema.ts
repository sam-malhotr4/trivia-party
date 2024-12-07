import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Player, PlayerSchema } from '../players/schemas/player.schema';

@Schema()
export class Room extends Document {
    @Prop({ required: true }) // Unique room code
    roomCode: string;

    @Prop({ type: PlayerSchema, required: true }) // Host player (single Player document)
    host: Player;

    @Prop({ type: [PlayerSchema], default: [] }) // Array of Player documents
    players: Player[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);