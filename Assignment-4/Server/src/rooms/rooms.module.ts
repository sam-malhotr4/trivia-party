import { Module } from "@nestjs/common";
import { UsersModule } from "src/users/users.module";
import { MongooseModule } from "@nestjs/mongoose";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { Room, RoomSchema } from './room.schema'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
        UsersModule,
    ],
    controllers: [RoomsController], // register controller
    providers: [RoomsService], // register service
})
export class RoomsModule {}