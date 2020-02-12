'use strict';

module.exports = app => {
  const { INTEGER, STRING, UUID } = app.Sequelize;

  const Visit = app.model.define("visit", {
    visit_id: {
      type: UUID,
      primaryKey: true,
      unique: true
    },
    remark: {
      type: STRING(50)
    },
    visit_count: {
      type: INTEGER,
    }
  })

  return Visit
}
