import category from "../models/category.js"

export const getAll = (req, res) => {

    category.find()
        .then(list => {
            res.status(200).send(list)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

export const add = (req, res) => {

    const newCategory = new category(req.body)
    
    newCategory.save()
        .then(category => {
            res.status(200).send({ message: `create a category ${category._id} succeed!` })
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}