import { User } from '../users/user.schema';

export interface Player {
  user: User;             // Link to the User object
  score: number;          // Game-specific attribute
  isHost: boolean;        // Indicates if the player is the host
}