import express from 'express'

import { add, getAll } from '../controllers/city.js'
import { checkToken } from '../middlewares.js'

const router = express.Router()

router.get('', getAll)
router.post('', checkToken, add)

export default router;
