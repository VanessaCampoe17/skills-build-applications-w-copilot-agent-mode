import mongoose from 'mongoose';
import Activity from '../models/activity';
import Leaderboard from '../models/leaderboard';
import Team from '../models/team';
import User from '../models/user';
import Workout from '../models/workout';
import { connectDatabase } from '../config/database';

const usersData = [
  { name: 'Avery Chen', email: 'avery.chen@example.com', teamName: 'Trailblazers' },
  { name: 'Jordan Patel', email: 'jordan.patel@example.com', teamName: 'Trailblazers' },
  { name: 'Morgan Rivera', email: 'morgan.rivera@example.com', teamName: 'Pace Setters' },
  { name: 'Riley Thompson', email: 'riley.thompson@example.com', teamName: 'Pace Setters' },
];

const teamsData = [
  {
    name: 'Trailblazers',
    description: 'A team focused on building consistency outdoors.',
    memberEmails: ['avery.chen@example.com', 'jordan.patel@example.com'],
  },
  {
    name: 'Pace Setters',
    description: 'A team that keeps each other moving every week.',
    memberEmails: ['morgan.rivera@example.com', 'riley.thompson@example.com'],
  },
];

const activitiesData = [
  { email: 'avery.chen@example.com', type: 'Run', durationMinutes: 32, calories: 310, date: '2026-10-06T07:30:00.000Z' },
  { email: 'avery.chen@example.com', type: 'Strength training', durationMinutes: 40, calories: 260, date: '2026-10-04T16:00:00.000Z' },
  { email: 'jordan.patel@example.com', type: 'Cycling', durationMinutes: 45, calories: 390, date: '2026-10-06T17:15:00.000Z' },
  { email: 'jordan.patel@example.com', type: 'Yoga', durationMinutes: 25, calories: 100, date: '2026-10-03T08:00:00.000Z' },
  { email: 'morgan.rivera@example.com', type: 'Run', durationMinutes: 28, calories: 275, date: '2026-10-05T07:00:00.000Z' },
  { email: 'morgan.rivera@example.com', type: 'Swimming', durationMinutes: 35, calories: 320, date: '2026-10-02T18:00:00.000Z' },
  { email: 'riley.thompson@example.com', type: 'Hiking', durationMinutes: 60, calories: 430, date: '2026-10-05T09:00:00.000Z' },
  { email: 'riley.thompson@example.com', type: 'Strength training', durationMinutes: 30, calories: 210, date: '2026-10-01T17:30:00.000Z' },
];

const workoutsData = [
  {
    name: 'Easy Starter Run',
    description: 'A conversational-pace run with a short warm-up and cool-down.',
    type: 'Running',
    durationMinutes: 25,
    difficulty: 'beginner' as const,
  },
  {
    name: 'Full-Body Strength',
    description: 'A balanced circuit of bodyweight squats, push-ups, and core work.',
    type: 'Strength',
    durationMinutes: 35,
    difficulty: 'intermediate' as const,
  },
  {
    name: 'Recovery Flow',
    description: 'A gentle mobility and stretching session for recovery days.',
    type: 'Yoga',
    durationMinutes: 20,
    difficulty: 'beginner' as const,
  },
];

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const users = await Promise.all(
      usersData.map(async ({ name, email }) => {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          existingUser.name = name;
          await existingUser.save();
          return existingUser;
        }
        return User.create({ name, email });
      }),
    );
    const usersByEmail = new Map(users.map((user) => [user.email, user]));
    const teams = await Promise.all(
      teamsData.map(async ({ name, description, memberEmails }) => {
        const members = memberEmails.map((email) => {
          const user = usersByEmail.get(email);
          if (!user) {
            throw new Error(`Cannot find seeded user ${email} for team ${name}`);
          }
          return user._id;
        });
        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
          existingTeam.description = description;
          existingTeam.members = members;
          await existingTeam.save();
          return existingTeam;
        }
        return Team.create({ name, description, members });
      }),
    );
    const teamsByName = new Map(teams.map((team) => [team.name, team]));

    for (const { email, teamName } of usersData) {
      const user = usersByEmail.get(email);
      const team = teamsByName.get(teamName);
      if (!user || !team) {
        throw new Error(`Cannot assign seeded user ${email} to team ${teamName}`);
      }
      user.team = team._id;
      await user.save();
    }

    for (const { email, type, durationMinutes, calories, date } of activitiesData) {
      const user = usersByEmail.get(email);
      if (!user) {
        throw new Error(`Cannot find seeded user ${email} for activity ${type}`);
      }
      const activityDate = new Date(date);
      const existingActivity = await Activity.findOne({ user: user._id, type, date: activityDate });
      if (existingActivity) {
        existingActivity.durationMinutes = durationMinutes;
        existingActivity.calories = calories;
        await existingActivity.save();
      } else {
        await Activity.create({ user: user._id, type, durationMinutes, calories, date: activityDate });
      }
    }

    const leaderboardData = [
      { email: 'avery.chen@example.com', points: 820, rank: 1 },
      { email: 'morgan.rivera@example.com', points: 760, rank: 2 },
      { email: 'jordan.patel@example.com', points: 640, rank: 3 },
      { email: 'riley.thompson@example.com', points: 590, rank: 4 },
    ];
    for (const { email, points, rank } of leaderboardData) {
      const user = usersByEmail.get(email);
      if (!user) {
        throw new Error(`Cannot find seeded user ${email} for leaderboard`);
      }
      const existingEntry = await Leaderboard.findOne({ user: user._id });
      if (existingEntry) {
        existingEntry.team = user.team;
        existingEntry.points = points;
        existingEntry.rank = rank;
        await existingEntry.save();
      } else {
        await Leaderboard.create({ user: user._id, team: user.team, points, rank });
      }
    }

    await Promise.all(
      workoutsData.map(async ({ name, ...workout }) => {
        const existingWorkout = await Workout.findOne({ name });
        if (existingWorkout) {
          existingWorkout.set(workout);
          await existingWorkout.save();
          return existingWorkout;
        }
        return Workout.create({ name, ...workout });
      }),
    );
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

seedDatabase();
