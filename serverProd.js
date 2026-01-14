import express from 'express';
import bodyParser from 'body-parser';
import log from 'npmlog';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJSDoc from 'swagger-jsdoc';

// 🔹 ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 ROUTES (IMPORTANT: .js extension)
import roleRouter from './server/routes/roleRoutes.js';
import userRouter from './server/routes/userRoutes.js';
import documentRouter from './server/routes/documentRoutes.js';
import searchRouter from './server/routes/searchRoutes.js';

const app = express();

// 🔹 Swagger
const pathurl = path.join(__dirname, '/server/routes/*.js');

const swaggerDefinition = {
  info: {
    title: 'DocumentIT API Endpoints',
    version: '1.0.0',
    description: 'Describing the API Endpoints with Swagger',
  },
  host: 'localhost:7000',
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: [pathurl],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 🔹 PORT FIX
const port = process.env.PORT || 10000;

// 🔹 Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'client/dist')));

// 🔹 Routes
app.use('/api/roles', roleRouter);
app.use('/api/users', userRouter);
app.use('/api/documents', documentRouter);
app.use('/api/search', searchRouter);

app.get('*', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Document Management System API',
  });
});

// 🔹 Start Server
app.listen(port, () => {
  log.info('Express app started on port', port);
});

export default app;
