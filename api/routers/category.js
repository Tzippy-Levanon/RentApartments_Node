import express from 'express'

import { checkToken } from '../middlewares.js'
import { add, getAll } from '../controllers/category.js'

const router = express.Router()

router.get('', getAll)
router.post('', checkToken, add)

export default router;
