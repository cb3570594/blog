'use strict';

module.exports = app => {
  const { TEXT, STRING, UUIDV4, UUID, NOW, DATE } = app.Sequelize;

  const Tag = app.model.define('tag', {
    tag_id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
    tag_name: { type: STRING(200), unique: true },
  });

  return Tag;
};