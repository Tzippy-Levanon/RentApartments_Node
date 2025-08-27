import Advertiser from "../models/advertiser.js"
import apartment from "../models/apartment.js"
import Apartment from "../models/apartment.js"
import Category from "../models/category.js"
import City from "../models/city.js"

// הוספת דירה
export const add = (req, res) => {

    const image1 = req.file ? `/uploads/${req.file.filename}` : null
    const { apartmentName, description, categoryCode, cityCode, address, numBeds, more, price, advertiserCode } = req.body
    // יצירת מאמר חדש
    const newApart = new apartment({
        apartmentName, description, pic: image1, categoryCode, cityCode, address, numBeds, more, price, advertiserCode
    })

    newApart.save()
        .then(async apart => {
            let x = await Category.findByIdAndUpdate(apart.categoryCode, { $push: { arrApartments: apart._id } })
            if (!x) {
                return res.status(500).send({ message: `create apart ${apart._id} succeed! update category failed!` })
            }
            let y = await City.findByIdAndUpdate(apart.cityCode, { $push: { arrApartments: apart._id } })
            if (!y) {
                return res.status(500).send({ message: `create apart ${apart._id} succeed! update city failed!` })
            }
            let z = await Advertiser.findByIdAndUpdate(apart.advertiserCode, { $push: { arrApartments: apart._id } })
            if (!z) {
                return res.status(500).send({ message: `create apart ${apart._id} succeed! update advertiser failed!` })
            }
            return res.status(200).send({ message: `create apart ${apart._id} succeed!` })
        })
        .catch(err => {
            return res.status(500).send({ error: err.message })
        })

}

//בדיקת תקינות לעדכון דירה
export const update1 = (req, res, next) => {

    const { _id, advertiserCode } = req.body
    if (!_id) {
        return res.status(400).send({ error: "you must enter apartment _id!" })
    }

    if (advertiserCode)
    console.log("aaaaaaaaaaaaaaaa",_id);
        Apartment.findById(_id)
            .then(a => {
                if (a.advertiserCode != advertiserCode)
                    return res.status(400).send({ message: "you can update only your apartments!⚠️" })

            })
            .catch(err => {
                return res.status(400).send(err.message)
            })

    next()
}

//עדכון דירה
export const update = (req, res) => {

    // לא ניתן לעדכן את קוד הכתבה
    const { _id } = req.body

    if (!_id)
        return res.status(400).send({ error: "you must enter apartment _id!" });

    console.log(_id, req.body);

    // הגדרת נתיב לתמונה (אם קיימת)
    const image1 = req.file ? `/uploads/${req.file.filename}` : apartment.pic;
    const { apartmentName, description, categoryCode, cityCode, address, numBeds, more, price, advertiserCode } = req.body
    // יצירת מאמר חדש
    const newApart = new apartment({
        _id, apartmentName, description, pic: image1, categoryCode, cityCode, address, numBeds, more, price, advertiserCode
    })

    return Apartment.findByIdAndUpdate(_id, newApart)
        // האובייקט שנשלח כתשובה - לפני השינוי
        .then(apart => {
            console.log("))))))))", apart);
            // העדכון הצליח
            // בדיקה האם עדכנו את הקטגוריה - האם היא נשלחה בגוף הבקשה
            // מחיקת קוד הכתבה מהקטגוריה הישנה
            // הוספת קוד הכתבה לקטגוריה החדשה
            const { categoryCode } = req.body
            console.log(categoryCode);
            const { cityCode } = req.body
            const { advertiserCode } = req.body

            if (categoryCode) {
                // article.category - החזרנו את האובייקט לפני שהשינוי- הקטגוריה הישנה
                let x = Category.findByIdAndUpdate(apart.categoryCode, { $pull: { arrApartments: _id } })
                    .then(suc => {
                        console.log("suc1", suc)

                    }
                    ).catch(err => {
                        // console.log("fail"),
                        console.log("err1", err);
                    }
                    )
                // category - נשלח בגוף הבקשה - חדשה
                let y = Category.findByIdAndUpdate(categoryCode, { $push: { arrApartments: _id } })
                    .then(x => {
                        console.log("success2", x);
                    }
                    ).catch(err => {
                        console.log("err2", err);
                    })
                if (!x || !y) {
                    return res.status(200).send({ message: `update apartment ${_id} succeed!, upadte categories failed!` })
                }
            }
            if (cityCode) {
                let x1 = City.findByIdAndUpdate(apart.cityCode, { $pull: { arrApartments: _id } })
                    .then(suc => {
                        console.log(suc);
                        // console.log(apart.city,id)
                    })
                    .catch(err => {
                        // console.log("fail"),
                        console.log(err);
                    })

                // category - נשלח בגוף הבקשה - חדשה
                let y1 = City.findByIdAndUpdate(cityCode, { $push: { arrApartments: _id } })
                    .then(suc => {
                        // console.log(city,id);
                        // console.log("succaaaaaa")
                        console.log(suc);
                    })
                    .catch(err => {
                        // console.log("fail"),
                        console.log(err);
                    })

                if (!x1 || !y1) {
                    return res.status(200).send({ message: `update apartment ${_id} succeed!, upadte city failed!` })
                }
            }
            if (advertiserCode) {
                let x2 = Advertiser.findByIdAndUpdate(apart.advertiserCode, { $pull: { arrApartments: _id } })
                    .then(suc => {
                        console.log(suc);
                    })
                    .catch(err => {
                        console.log(err);
                    })

                // category - נשלח בגוף הבקשה - חדשה
                let y2 = Advertiser.findByIdAndUpdate(advertiserCode, { $push: { arrApartments: _id } })
                    .then(suc => {
                        console.log(suc);
                    })
                    .catch(err => {
                        console.log(err);
                    })

                if (!x2 || !y2) {
                    return res.status(200).send({ message: `update apartment ${_id} succeed!, upadte advertiser failed!` })
                }
            }
            return res.status(200).send({ message: `update apartment ${_id} succeed!` })
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

//מחיקת דירה
export const remove = (req, res) => {

    // 1. חיפוש האובייקט הרצוי
    return Apartment.findByIdAndDelete(req.params.id)
        .then(async apart => {
            if (!apart) {
                return res.status(404).send({ error: `apartment not found!` })
            }
            let x = await Category.findByIdAndUpdate(apart.categoryCode, { $pull: { arrApartments: apart._id } })
            if (!x) {
                return res.status(500).send({ message: `delete apart ${apart._id} succeed! update category failed!` })
            }
            let y = await City.findByIdAndUpdate(apart.cityCode, { $pull: { arrApartments: apart._id } })
            if (!y) {
                return res.status(500).send({ message: `delete apart ${apart._id} succeed! update city failed!` })
            }
            let z = await Advertiser.findByIdAndUpdate(apart.advertiserCode, { $pull: { arrApartments: apart._id } })
            if (!z) {
                return res.status(500).send({ message: `delete apart ${apart._id} succeed! update advertiser failed!` })
            }
            return res.status(200).send({ message: `delete apartment ${apart._id} succeed!` })
        })
        .catch(err => {
            return res.status(500).send({ error: err.message })
        })
}

// שליפת כל הדירות
export const getAll = (req, res) => {
    Apartment.find()
        .populate('categoryCode').populate('cityCode').populate('advertiserCode')
        .then(list => {
            res.status(200).send(list)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

// ID שליפת דירה לפי 
export const getById = (req, res) => {
    Apartment.findById(req.params.id)
        .populate('categoryCode').populate('cityCode').populate('advertiserCode')
        .then(apartment => {
            res.status(200).send(apartment)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

// שליפת דירה לפי קוד קטגוריה
export const getApartmentByCategoryCode = (req, res) => {
    Apartment.find()
        .populate('categoryCode').populate('cityCode').populate('advertiserCode')
        .where({ categoryCode: { $eq: req.params.id } })
        .then(category => {
            res.status(200).send(category)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

// שליפת דירה לפי קוד עיר
export const getApartmentByCityCode = (req, res) => {
    Apartment.find()
        .populate('categoryCode').populate('cityCode').populate('advertiserCode')
        .where({ cityCode: { $eq: req.params.id } })
        .then(city => {
            res.status(200).send(city)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

// שליפת דירה לפי מספר מיטות
export const getByNumBeds = (req, res) => {
    if (req.params.num == 0) {
        Apartment.find()
            .populate('categoryCode').populate('cityCode').populate('advertiserCode')
            .where(req.params.num == 0 && { numBeds: { $eq: req.params.numBeds } })
            .then(apartment => {
                res.status(200).send(apartment)
            })
            .catch(err => {
                res.status(500).send({ error: err.message })
            })
    }
    else if (req.params.num == 1) {
        Apartment.find()
            .populate('categoryCode').populate('cityCode').populate('advertiserCode')
            .where(req.params.num == 1 && { numBeds: { $gt: req.params.numBeds } })
            .then(apartment => {
                res.status(200).send(apartment)
            })
            .catch(err => {
                res.status(500).send({ error: err.message })
            })
    }
    else if (req.params.num == -1) {
        Apartment.find()
            .populate('categoryCode').populate('cityCode').populate('advertiserCode')
            .where(req.params.num == -1 && { numBeds: { $lte: req.params.numBeds - 1 } })
            .then(apartment => {
                res.status(200).send(apartment)
            })
            .catch(err => {
                res.status(500).send({ error: err.message })
            })
    }
    else {
        res.status(500).send({ error: err.message })
    }
}

//שליפת דירה לפי מחיר
export const getByPrice = (req, res) => {

    if (req.params.num == 0)
        apartment.find()
            .where({ price: { $eq: req.params.price } }).populate('categoryCode').populate('cityCode').populate('advertiserCode')
            .then(a => {
                res.status(200).send(a)
            })
            .catch(err => {
                res.status(500).send({ error: err.message })
            })

    else if (req.params.num > 0)
        apartment.find()
            .where({ price: { $gt: req.params.price } }).populate('categoryCode').populate('cityCode').populate('advertiserCode')
            .then(a => {
                res.status(200).send(a)
            })
            .catch(err => {
                res.status(500).send({ error: err.message })
            })

    else

        apartment.find()
            .where({ price: { $lte: req.params.price - 1 } }).populate('categoryCode').populate('cityCode').populate('advertiserCode')
            .then(a => {
                res.status(200).send(a)
            })
            .catch(err => {
                res.status(500).send({ error: err.message })
            })

}

// שליפת דירה לפי קוד מפרסם
export const getApartmentByAdvertiserCode = (req, res) => {
    Apartment.find()
        .populate('categoryCode').populate('cityCode').populate('advertiserCode')
        .where({ advertiserCode: { $eq: req.params.id } })
        .then(advertiser => {
            res.status(200).send(advertiser)
            console.log(advertiser);
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}