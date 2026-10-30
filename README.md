# 员工报销汇总网站

完整源代码、锁文件、测试及开源许可证位于 `portal-source.tar.gz`，解压后在 `portal/` 目录中。归档不含服务密钥、员工真实数据或 node_modules。

Render 使用 Free 套餐、新加坡地区；构建命令 `npm run build`，启动命令 `npm start`。环境变量仅通过 Render 管理页面配置，不写入仓库。

功能包括员工申报、中文浏览器 OCR、管理员按人汇总、人工复核、六列 Excel 及先备份后清理六个月前图片。完整部署与限制说明见归档内 README.md。
