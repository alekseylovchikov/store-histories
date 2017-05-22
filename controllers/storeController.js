const mongoose = require('mongoose');
const slug = require('limax');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'Не верный формат файла!' }, false);
    }
  }
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Добавить историю' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
  const store = await (new Store(req.body)).save();
  req.flash('success', `История "${store.name}" создана.`);
  res.redirect(`/stores/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Все истории', stores });
};

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  res.render('editStore', { title: `Редактировать ${store.name}`, store });
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const updateStore = Object.assign({}, req.body, { slug: slug(req.body.name) });
  const store = await Store.findOneAndUpdate({ _id: req.params.id }, updateStore, {
    new: true,
    runValidators: true,
  }).exec();
  req.flash('success', `История "${store.name}" обновлена.`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug });
  if (!store) {
    next();
    return;
  }
  res.render('store', { title: store.name, store });
};
