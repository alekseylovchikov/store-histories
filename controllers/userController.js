const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
	res.render('login', { title: 'Войти' });
};

exports.registerForm = (req, res) => {
	res.render('register', { title: 'Регистрация' });
};

exports.validateRegister = (req, res, next) => {
	req.sanitizeBody('name');
	req.checkBody('name', 'Имя должно быть заполнено!').notEmpty();
	req.checkBody('email', 'Неверный email!').isEmail();
	req.sanitizeBody('email').normalizeEmail({
		remove_dots: false,
		remove_extension: false,
		gmail_remove_subaddress: false
	});
	req.checkBody('password', 'Пароль не может быть пустым!').notEmpty();
	req.checkBody('password-confirm', 'Подтверждение пароля не может быть пустым!').notEmpty();
	req.checkBody('password-confirm', 'Ваши пароли не совпадают!').equals(req.body.password);

	const errors = req.validationErrors();
	if (errors) {
		req.flash('error', errors.map(err => err.msg));
		res.render('register', { title: 'Регистрация', body: req.body, flashes: req.flash() });
		return;
	}
	next();
};
