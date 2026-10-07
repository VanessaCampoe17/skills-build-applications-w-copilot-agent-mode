import { model, Schema, Types } from 'mongoose';

export interface ActivityRecord {
  user: Types.ObjectId;
  type: string;
  durationMinutes: number;
  calories: number;
  date: Date;
}

const activitySchema: Schema<ActivityRecord> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    calories: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default model('Activity', activitySchema, 'activities');
