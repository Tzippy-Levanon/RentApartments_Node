// import advertiser from "./models/advertiser"
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// const Admin = require("../models/admin")
// const User = require('../models/user')

// const nodemailer = require('nodemailer')

// const jwt = require('jsonwebtoken')

// const dotenv = require('dotenv')
dotenv.config()

export const sendMail = (req, res) => {

    // const token = jwt.sign(
    //     { name: req.body.name, password: req.body.password },
    //     process.env.TOKEN)

    // const newUser = new User(req.body)
    // newUser.save()
    //     .then((user) => {
    //         if (user) {
    //             Admin.findByIdAndUpdate({ _id: user.admin }, { $push: { users: user._id } })
    //                 .then(() => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rentapartments1234@gmail.com',
            pass: '...'
        }
    });
    let mailOptions = {
        from: 'rentapartments1234@gmail.com',
        to: 'rentapartments1234@gmail.com',
        subject: 'Hi, ',
        // text: 'Wellcome to our organization!\n Your registeration got successfull.',
        html: '<h1>Hello</h1><p>Welcome to our organization!</p>'
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return res.status(500).send("Error sending email");
        } 
        else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send("Email sent successfully");
        }
    });
    // })
    // .catch((error) => {
    //     res.status(400).send(error.message)
    // })
    //     }
    // })
    // .catch((error) => {
    //     res.status(400).send(error.message)
    // })
}

// const userLogin = (req, res) => {
//     User.findOne({ password: { $eq: req.params.password } })
//         .then((user) => {
//             if (user.name == req.params.name)
//                 res.send("WELLCOME USER 📱🤙☎!!!")
//             else
//                 res.send("password and name not correct:(")
//         })
//         .catch((error) => {
//             res.status(400).send(error.message)
//         })
// }

// const getAllUsersById = (req, res) => {
//     Admin.findById(req.params.id)
//         .populate({ path: 'users', select: 'name password email' })
//         .then((admin) => {
//             res.status(200).send(admin.users)
//         })
//         .catch((error) => {
//             res.status(400).send(error.message)
//         })
// }

// const deleteUserByAdmin = (req, res) => {
//     Admin.findByIdAndUpdate({ _id: req.params.adminId }, { $pull: { 'users': req.params.userId } }, { new: true })
//         .then(async () => {
//             const user = await User.findById({ _id: req.params.userId })
//             user.deleteOne()
//                 .then(() => {
//                     res.status(200).send('delete user succeed')
//                 })
//                 .catch((error) => {

//                     res.status(400).send(error.message)
//                 })
//         })
//         .catch((error) => {
//             res.status(400).send(error.message)
//         })
// }

// module.exports = { userRegister, userLogin, getAllUsersById, deleteUserByAdmin, sendMail }