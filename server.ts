import express, {json, urlencoded} from 'express';

import router from './router';

const { PORT = 3000 } = process.env;

const app = express();

app.use(json({ limit: '5mb' }));

app.use(urlencoded({ limit: '5mb', extended: true }));

app.use('/api/stats', router);

app.listen(PORT, () => console.log('Server started at', PORT));