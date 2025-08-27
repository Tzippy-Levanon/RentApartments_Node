import express from 'express'
import {
      add, getAll, getApartmentByAdvertiserCode,
      getApartmentByCategoryCode, getApartmentByCityCode,
      getByNumBeds, getByPrice, getById, remove, update, update1
} from '../controllers/apartment.js';

import { checkEmail, checkToken, remove1, upload } from '../middlewares.js';

const router = express.Router()

router.get('', getAll)
router.get('/getById/:id', getById)
router.get('/getByCategory/:id', getApartmentByCategoryCode)
router.get('/getByCity/:id', getApartmentByCityCode)
router.get('/getByNumBeds/:numBeds/:num', getByNumBeds)
router.get('/getByPrice/:price/:num', getByPrice)
router.get('/getByAdvertiser/:id', getApartmentByAdvertiserCode)
router.post('', checkToken,upload.single('pic'), add)
router.patch('/:id', checkToken,upload.single('pic'),update1, update)
router.delete('/:id/:idAdver', checkToken, remove1, remove)

export default router;
