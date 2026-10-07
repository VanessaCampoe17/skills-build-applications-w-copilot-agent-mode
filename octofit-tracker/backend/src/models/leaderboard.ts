import { model, Schema, Types } from 'mongoose';

export interface LeaderboardRecord {
  user: Types.ObjectId;
  team?: Types.ObjectId;
  points: number;
  rank: number;
}

const leaderboardSchema: Schema<LeaderboardRecord> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, required: true, min: 0, default: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

export default model('Leaderboard', leaderboardSchema, 'leaderboard');
