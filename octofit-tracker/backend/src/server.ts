import express from 'express';
import { connectDatabase } from './config/database';
import Activity from './models/activity';
import Leaderboard from './models/leaderboard';
import Team from './models/team';
import User from './models/user';
import Workout from './models/workout';

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
]);

app.use(express.json());
app.use((request, response, next) => {
  const origin = request.get('origin');
  if (origin && !allowedOrigins.has(origin)) {
    if (request.method === 'OPTIONS') {
      response.sendStatus(403);
      return;
    }
    next();
    return;
  }

  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.sendStatus(204);
    return;
  }
  next();
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});


app.get('/api/', (_request, response) => {
  response.json({
    baseUrl,
    endpoints: [
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/',
    ],
  });
});

app.get('/api/users/', async (_request, response) => {
  response.json(await User.find().lean());
});

app.get('/api/teams/', async (_request, response) => {
  response.json(await Team.find().lean());
});

app.get('/api/activities/', async (_request, response) => {
  response.json(await Activity.find().sort({ date: -1 }).lean());
});

app.get('/api/leaderboard/', async (_request, response) => {
  response.json(await Leaderboard.find().sort({ rank: 1, points: -1 }).lean());
});

app.get('/api/workouts/', async (_request, response) => {
  response.json(await Workout.find().lean());
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening on port ${port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Unable to start OctoFit API:', error);
  process.exitCode = 1;
});