import express from 'express'

import { logIn, signIn } from '../controllers/advertiser.js'
import { checkEmail } from '../middlewares.js'

const router = express.Router()

router.post('/getByEmail&password', checkEmail, logIn)
router.post('', checkEmail, signIn)

export default router;