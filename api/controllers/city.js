import city from "../models/city.js"

export const getAll = (req, res) => {

    city.find()
        .then(list => {
            res.status(200).send(list)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

export const add = (req, res) => {

    const newCity = new city(req.body)
    console.log(newCity);

    newCity.save()
        .then(city => {
            res.status(200).send({ message: `add a city ${city._id} succeed!` })
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}