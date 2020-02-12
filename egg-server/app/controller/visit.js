'use strict';

const Controller = require('egg').Controller;
class VisitController extends Controller {
  async setVisit() {
    const { ctx, app, service } = this;
    let { visit_id, remark } = ctx.request.body;
    const res = await service.visit.setVisit(visit_id, remark);
    ctx.helper.success({ d: res.visit_count });
  }
}


module.exports = VisitController;