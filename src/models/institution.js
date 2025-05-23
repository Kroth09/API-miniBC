import Sequelize, { Model } from 'sequelize';

class Institution extends Model {
	static init(sequelize) {
		super.init({ 
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		},
			{
				sequelize,
				underscored: true,
				tableName: 'institutions',
			});

		return this;
	}
};

export default Institution;