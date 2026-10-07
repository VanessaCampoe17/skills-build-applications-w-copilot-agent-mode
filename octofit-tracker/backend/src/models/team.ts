import { model, Schema, Types } from 'mongoose';

export interface TeamRecord {
  name: string;
  description?: string;
  members: Types.ObjectId[];
}

const teamSchema: Schema<TeamRecord> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export default model('Team', teamSchema, 'teams');
