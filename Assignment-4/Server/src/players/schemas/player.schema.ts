import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../users/user.schema';

@Schema()
export class Player extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }) // Reference to User schema
    user: mongoose.Schema.Types.ObjectId;

    @Prop({ type: Number, default: 0 }) // Default score
    score: number;

    @Prop({ type: Boolean, default: false }) // Host flag
    isHost: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);