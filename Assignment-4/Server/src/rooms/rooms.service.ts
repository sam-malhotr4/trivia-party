import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/user.schema";
import { Room } from './rooms.model';
import { Player } from "./player.interface";

export interface LeaveRoomResponse {
    message: string;
    roomCode?: string;
    players?: string[];
}


@Injectable()
export class RoomsService{
    constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<Room>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ){}
    //private rooms: Room[] = [];

    // method to generate roomcodes
    private generateRoomCode() {
        return Math.random().toString(36).substring(2, 9).toUpperCase();
    }

    // create a new room
    async createRoom(username: string): Promise<Room>{
        const user = await this.userModel.findOne({username}).exec();
        console.log("User found:", user);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const roomCode = this.generateRoomCode();
        const hostPlayer = {
            user: user._id, // Reference the User's ID
            score: 0,
            isHost: true,
        };
        
        const newRoom = new this.roomModel({
            roomCode,
            host: hostPlayer,
            players: [hostPlayer],
        });

        return newRoom.save();
    }

    // join an existing room
    async joinRoom(roomCode: string, username: string): Promise<Room | null> {
        const room = await this.roomModel.findOne({roomCode}).exec();
        if (!room){
            return null;
        }

        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isUserInRoom = room.players.some(player => player.user.toString() === user._id.toString());
        if (isUserInRoom) {
            throw new ConflictException('User already in the room');
        }

        const player = {
            user: user._id, // Reference the user
            score: 0, // Default score
            isHost: false, // Joining players are not hosts
        };


        room.players.push(player as Player);
        await room.save();

        return this.roomModel
        .findOne({ roomCode })
        .populate('players.user', 'username')
        .exec();
    }

    // async leaveRoom(username: string): Promise<Room | null> {
    // async leaveRoom(username: string): Promise<{ message: string; roomCode?: string; players?: string[] }> {
    async leaveRoom(username: string): Promise<LeaveRoomResponse> {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        // Find the room where the user is currently a player
        const room = await this.roomModel
            .findOne({ 'players.user': user._id })
            .populate('players.user', 'username') // Populate player details
            .exec();
    
        if (!room) {
            throw new NotFoundException('User is not currently in any room');
        }

        if (room.host.user.toString() === user._id.toString()) {
            // Delete the room if the user is the host
            await this.roomModel.deleteOne({ _id: room._id }).exec();
            return { message: 'Host left the room successfully. Room disbanded.' }; // Return message to indicate the room is deleted since host left
        }

        // Remove the user from the players array
        room.players = room.players.filter(player => (player.user as User)._id.toString() !== user._id.toString());
    
        await room.save();
        return {
            message: 'Left room successfully',
            roomCode: room.roomCode,
            players: room.players.map(player => player.user.username),
        };
    }

    // async getRoomWithPlayers(roomCode: string): Promise<Room | null> {
    //     return this.roomModel
    //       .findOne({ roomCode })
    //       .populate({
    //         path: 'players.user', // Path to populate
    //         select: 'username', // Only fetch the username field
    //     })
    //       .exec();
    // }
    async getRoomWithPlayers(roomCode: string): Promise<Room | null> {
        return this.roomModel
            .findOne({ roomCode })
            .populate({
                path: 'players.user',
                select: 'username email', // Only fetch specific fields
            })
            .populate({
                path: 'host.user',
                select: 'username email', // Populate host details
            })
            .exec();
    }
}