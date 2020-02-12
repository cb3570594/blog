'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DATE, VARCHAR, TEXT } = Sequelize;
    await queryInterface.createTable('posts', {
      id: { type: VARCHAR(40), primaryKey: true },
      title: VARCHAR(100),
      intro: VARCHAR(200),
      content: TEXT,
      category: VARCHAR(40),
      img: VARCHAR(1000),
      tag: VARCHAR(1000),
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('posts');
  },
};
