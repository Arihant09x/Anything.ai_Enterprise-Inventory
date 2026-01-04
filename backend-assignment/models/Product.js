const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ProductLogo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'https://tse2.mm.bing.net/th/id/OIP.o27PVWSehFHkhiMMkUR8ZAHaE7?pid=Api&P=0&w=300&h=300'
    },
    description: {
        type: DataTypes.STRING
    }

});

module.exports = Product;