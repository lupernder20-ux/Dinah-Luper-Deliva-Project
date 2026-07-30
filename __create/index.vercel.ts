import { createHonoServer } from 'react-router-hono-server/node';
import app from './app';

export default await createHonoServer({
  app,
  defaultLogger: false,
});
