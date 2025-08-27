import jwt from "jsonwebtoken"
import category from "./models/category.js"
import apartment from "./models/apartment.js"
import multer from 'multer'
import path from "path"

export const checkEmail = (req, res, next) => {
    const { email } = req.body
    if (email && email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return next()
    }
    res.status(400).send({ error: 'invalid email!' })
}

// בדיקה האם נשלח טוקן והאם הוא תקין ותקף
export const checkToken = (req, res, next) => {
    if (!req.headers.authorization) {
        // אין הרשאה
        return res.status(401).send({ error: 'Authorization failed1!' })
    }

    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
        return res.status(401).send({ error: 'Authorization failed2!' })
    }

    // decoded - פיענוח
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error || !decoded) {
            // האימות נכשל
            return res.status(401).send({ error: 'Authorization failed3!' })
        }
        if (decoded) {
            // האובייקט יכיל את הנתונים של המשתמש לפיהם נוצר הטוקן
            // באם יהיה צורך נוכל לשמור אותם באובייקט הבקשה ואז להשתמש בפונקציות הבאות
            next()
        }
    })

}

//בדיקת תקינות למחיקת דירה
export const remove1 = (req, res, next) => {
    const { id, idAdver } = req.params
    apartment.findById(id)
        .then(list => {
            console.log("advertiserCode: " + list.advertiserCode);
            console.log("idAdver: " + idAdver);
            if (list.advertiserCode != idAdver)
                return res.status(400).send({ message: "you can update only your apartments!⚠️" })
            else
                next()
        }
        ).catch(err => {
            next()
            // return res.status(400).send({ err: err.message})
        })
}


const fileFilter = (req, file, cb) => {
    //במקרה שלנו נאפשר רק קבצי בסיומת תמונה
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/webp' || file.mimetype === 'image/jpg') {
        //true אם הקובץ מסוג מתאים נחזיר 
        cb(null, true)
    }
    //ואם לא - false
    cb(null, false)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

// module.exports = {
//     logUrl: (req, res, next) => {
//         console.log(req.url);
//         next()
//     },

export const logUrl = (req, res, next) => {
    console.log(req.url);
    next();
}


export const checkAuth = (req, res, next) => {

    if (!req.headers.authorization) {
        res.status(401).send({ error: 'Authentication failed!' })
    }

    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
        return res.status(401).send({ error: 'Authentication failed!' })
    }

    //jwt.verify = יצירת צופן
    //מקבל שלשה ארגומנטים
    //1. הצופן ששלחנו בכותרת
    //2. מזהה יחודי של המערכת שישלח בכל הצפנה ובכל פענוח
    //3. callback פונקציית 
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'Authorization failed!' })
        }
        if (decoded) {
            next()
        }
    })

}

export const upload = multer({
    // dest: 'uploads/',
    storage,
    //הגדרות לגבי הקובץ המועלה
    limits: {
        //2MB הקובץ יכול להיות עד גודל של 
        fileSize: 1024 * 1024 * 2
    },
    fileFilter
})

