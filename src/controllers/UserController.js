import * as Yup from 'yup';
import User from '../models/user.js';
import Account from '../models/account.js';
import Institution from '../models/institution.js';
 
class UserController {
	async index(req, res) {
		const user = await User.findAll({
			where: { cpf: req.params.cpf }
		})

		return res.json(user);
	}

	async store(req, res) { //validador caseiro
		const schema = Yup.object().shape({
			cpf: Yup.string().required().min(11).max(11),
			name: Yup.string().required(),
			email: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Falha na validacao.' });
		}

		const userExists = await User.findOne({
			where: { cpf: req.body.cpf },
		});

		if (userExists) {
			return res.status(400).json({ error: 'Usuario ja existe.' });
		}

		const { cpf, name, email } = await User.create(req.body);

		return res.json({
			cpf,
			name,
			email,
		});
	}

	async update(req, res) {
		const cpf = req.params.cpf;

		const user = await User.findByPk(cpf);

		if (!user) {
			return res.status(400).json({ error: 'Usuario nao existe.' });
		}

		await user.update(req.body);
		return res.json(user);
	}

	async delete(req, res) {
		const cpf = req.params.cpf;

		const user = await User.findByPk(cpf);

		if (!user) {
			return res.status(400).json({ error: 'Usuario nao existe.' });
		}

		await user.destroy();
		return res.send();
	}

	async getBalance(req, res) {
		const institution = req.query.instituicao;

		if (institution) {
			const instituicao = await Institution.findOne({
				where: { name: req.query.instituicao },
			});

			if (!instituicao) {
				return res.status(400).json({ error: 'Instituicao nao encontrada.' });
			}

			const accounts = await Account.findAll({
				where: {
					cpf: req.params.cpf,
					institution_id: instituicao.id,
				},
			});

			if (accounts.length === 0) {
				return res.status(400).json({ error: 'Conta nao existe.' });
			}

			let totalBalance = 0;

			for (let index = 0; index < accounts.length; index++) {
				totalBalance += accounts[index].balance;
			}

			return res.json({
				totalBalance,
			});
		}
		else {
			const accounts = await Account.findAll({
				where: { cpf: req.params.cpf }
			})

			if (!accounts) {
				return res.status(400).json({ error: 'Conta nao existe.' });
			}

			let totalBalance = 0;

			for (let index = 0; index < accounts.length; index++) {
				totalBalance += accounts[index].balance;
			}

			return res.json({
				totalBalance,
			});
		}

	}
}

export default new UserController();