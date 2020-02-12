const Service = require('egg').Service;

class VisitService extends Service {

  async setVisit(visit_id, remark) {
    const [visit, created] = await this.ctx.model.Visit.findOrCreate({
      where: { visit_id },
      defaults: { visit_id, remark, visit_count: 1 }
    })
    if (!created) {
      visit.visit_count++;
      await visit.save();
    }
    return visit;
  }

}

module.exports = VisitService;