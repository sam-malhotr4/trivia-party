import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../users/user.schema';
import { Player } from '../players/schemas/player.schema';

@Schema()
export class Room extends Document {
    @Prop({ required: true })
    roomCode: string;

    @Prop({
        type: { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number, isHost: Boolean },
    })
    players: Array<{ user: User; score: number; isHost: boolean }>;

    @Prop({
        type: { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number, isHost: Boolean },
    })
    host: { user: User; score: number; isHost: boolean };
}

export const RoomSchema = SchemaFactory.createForClass(Room);