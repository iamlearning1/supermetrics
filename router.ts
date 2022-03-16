import {Router} from 'express';

import {getStats} from './controller';

const router =  Router();

router.post('/', getStats);

export default router;