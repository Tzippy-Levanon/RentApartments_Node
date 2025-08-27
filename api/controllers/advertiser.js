import advertiser from "../models/advertiser.js"
import jwt from "jsonwebtoken"

// הרשמה למשתמש חדש
export const signIn = (req, res) => {
    const { email, password, phone, anotherPhone, arrApartments } = req.body

    advertiser.find()
        .where({ email: { $eq: email } })
        .then(x => {
            if (x.length > 0) {
                return res.status(400).send({ error: 'email has been exists already!' })
            }
            const newAdvertiser = new advertiser({
                email, password, phone, anotherPhone, arrApartments
            })

            newAdvertiser.save()
                .then(async advertiser => {
                    // יצירת טוקן:
                    // מקבלת שלשה פרמטרים:
                    // 1. נתונים של המשתמש מהם יווצר הטוקן - אין לתת נתונים רגישים כמו סיסמה
                    // 2. מחרוזת יחודית למערכת
                    // 3. אובייקט אפשרויות - לא חובה
                    const token = await jwt.sign(
                        { advertiser: advertiser.email, phone },
                        process.env.SECRET,
                        {
                            // ניתן להגדיר תוקף לטוקן
                            // expiresIn: '1hr' // hours
                            // expiresIn: '1d', // days
                            expiresIn: '10m', // minutes
                            // expiresIn: '20ms', // mili seconds
                            // expiresIn: '60s', // second
                            // expiresIn: '3 months', 
                        }
                    )
                    return res.status(200).send({ advertiser, token })
                })
                .catch(err => {
                    return res.status(500).send({ error: err.message })
                })
        })

}

// התחברות למערכת
export const logIn = (req, res) => {

    // שליפה לפי שם מפתח
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send({ error: `email is required!` })
    }

    advertiser.find()
        // חיפוש לפי אימייל
        .where({ email: { $eq: email } })
        .then(async users => {
            // לא נמצאו משתמשים מתאימים
            if (users.length == 0) {
                return res.status(404).send({ error: `email is not match!` })
            }

            // מערך - שליפה לפי מיקום
            let [user] = users

            // הסיסמה לא תואמת
            if (user.password !== password) {
                return res.status(404).send({ error: `email and password are not match!` })
            }

            // יצירת טוקן:
            // מקבלת שלשה פרמטרים:
            // 1. נתונים של המשתמש מהם יווצר הטוקן - אין לתת נתונים רגישים כמו סיסמה
            // 2. מחרוזת יחודית למערכת
            // 3. אובייקט אפשרויות - לא חובה
            const token = await jwt.sign(
                { username: user.username, email },
                process.env.SECRET,
                {
                    // ניתן להגדיר תוקף לטוקן
                    // expiresIn: '1hr' // hours
                    // expiresIn: '1d', // days
                    expiresIn: '30m' // minutes
                    // expiresIn: '20ms', // mili seconds
                    // expiresIn: '10s', // second
                    // expiresIn: '3 months', 
                }
            )

            // המשתמש נמצא - נשלח חזרה לצד לקוח
            res.status(200).send({ user, token })
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}
