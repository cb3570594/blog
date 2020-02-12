'use strict';

module.exports = app => {
  const { STRING, UUIDV4, UUID, NOW, DATE } = app.Sequelize;

  const Category = app.model.define('category', {
    category_id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    category_name: { type: STRING(200), unique: true },
  });

  return Category;
};