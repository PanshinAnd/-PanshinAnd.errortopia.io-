const {Schema, model, Types} = require('mongoose')


//В примере пользователи харнят массивы ссылок.
//Потому 4-я строка у меня и называется links. Первый парам-р - связка модели
//пользователя и записей в базе данных. Второй  - ссылка на коллекцию (модель)
// В примере коллекция links, пока оставил так.
})
const schema = Schema ({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true, unique: true},
  links: [{type: Types.ObjectId, ref: 'Link'}]

module.exports = model(name: 'User', schema)
