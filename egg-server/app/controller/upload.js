'use strict';

const Controller = require('egg').Controller;
const fs = require('fs-extra');
const path = require('path');
const pump = require('mz-modules/pump');
const moment = require('moment');

class UploadController extends Controller {
  async upload() {
    const { ctx, config } = this;
    const stream = await ctx.getFileStream();
    if (!stream) {
      ctx.helper.fail({ m: '非法参数' })
      return
    }
    // 上传基础目录
    const uploadTempPath = 'public/temp';
    const uploadBasePath = 'public/upload';
    // 生成文件夹
    const dirName = moment().format('YYYYMMDD');
    // 判断文件夹是否存在，不存在则直接创建文件夹
    const tempFilePath = path.join(config.baseDir, 'app', uploadTempPath, dirName)
    const uploadFilePath = path.join(config.baseDir, 'app', uploadBasePath, dirName)

    fs.ensureDirSync(tempFilePath)
    fs.ensureDirSync(uploadFilePath)
    // 生成文件名
    const fileName = moment().format('YYYYMMDDHHmmssSSS') + path.extname(stream.filename).toLowerCase();
    const target = path.join(tempFilePath, fileName);
    const writeStream = fs.createWriteStream(target);
    await pump(stream, writeStream);

    ctx.helper.success({ s: true, d: path.join(uploadTempPath, dirName, fileName) })
  }
}

module.exports = UploadController;