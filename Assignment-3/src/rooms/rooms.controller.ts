import { Controller, Get, Query, Post, Body } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { User } from '../users/user.schema'
import { Player } from "./player.interface";
import { Room } from "./rooms.model";

@Controller('rooms') // this controller targets endpoints with /rooms in the path
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post('create_room') //maps to /rooms/create-room
    async createRoom(@Body('username') username: string): Promise<Room> {
        return this.roomsService.createRoom(username); 
        // const room = await this.roomsService.createRoom(user);

        // const populatedRoom = await this.roomsService.getRoomWithPlayers(room.roomCode);
        // return {
        //     message: 'Room created successfully',
        //     roomCode: populatedRoom.roomCode,
        //     host: populatedRoom.host.user.username, // Now accessible
        //     players: populatedRoom.players.map((player) => ({
        //         username: player.user.username,
        //         score: player.score,
        //         isHost: player.isHost,
        //       })),
        // };
    }

    @Post('join_room')
    async joinRoom(@Body() body: {roomCode: string; username: string}) {
        const { roomCode, username } = body;
        const room = await this.roomsService.joinRoom(roomCode, username);
        if(!room) {
            return { message: 'Room not found' };
        }

        return {
            message: 'Joined room successfully',
            roomCode: room.roomCode,
            players: room.players.map((player) => player.user.username),
        }
    }

    @Post('leave_room')
    async leaveRoom(@Body() body: { username: string }) {
        const { username } = body;
        const room = await this.roomsService.leaveRoom(username);

        if (!room) {
            return { message: 'User not currently in any room' };
        }

        return {
            message: 'Left room successfully',
            roomCode: room.roomCode,
            players: room.players.map((player) => player.user.username),
        };
    }

    @Get('get_players')
    async getPlayers(@Query('roomCode') roomCode: string) {
        const room = await this.roomsService.getRoomWithPlayers(roomCode);

        if (!room) {
            return { message: 'Room not found' };
        }

        return {
            message: 'Players fetched successfully',
            roomCode: room.roomCode,
            players: room.players.map((player) => ({
                username: player.user?.username || 'Unknown', // Assuming `populate` is working correctly
                score: player.score,
                isHost: player.isHost,
            })),
        };
    }
}
