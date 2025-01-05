import express from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import organizationRoutes from './routes/organization.routes';
import pccConfigRoutes from './routes/pcc-config.routes';
import facilityRoutes from './routes/facility.routes';
import userRoutes from './routes/user.routes';
import { errorMiddleware } from './middleware/error.middleware';

export const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/organizations', organizationRoutes);
app.use('/api/pcc-config', pccConfigRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/users', userRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;