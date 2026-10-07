import { model, Schema } from 'mongoose';

export interface WorkoutRecord {
  name: string;
  description: string;
  type: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const workoutSchema: Schema<WorkoutRecord> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
  },
  { timestamps: true },
);

export default model('Workout', workoutSchema, 'workouts');
