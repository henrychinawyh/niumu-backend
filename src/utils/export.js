const dayjs = require("dayjs");
const xlsx = require("node-xlsx");

/**
 * 导出excel
 * @param {Object} ctx koa上下文
 * @param {String} name 导出文件名
 * @param {Array} titleArr 标题集合
 * @param {Array} dataArr 要导出的数据集合
 * @param {Object} sheetOptions xslx-sheet选项
 * @param {Number} colWidth 列宽
 */
const exportExcel = ({
  ctx,
  name = "导出表格",
  titleArr = [],
  dataArr = [],
  sheetOptions = {},
  colWidth = 24,
}) => {
  try {
    const defaultName = `${name}-${dayjs().format("YYYY-MM-DD")}`;
    const defaultSheetOptions = {
      "!cols": titleArr.map(() => ({
        wch: colWidth,
      })),
      ...sheetOptions,
    };

    let xlsxObj = [
      {
        name: defaultName,
        data: [],
      },
    ];

    dataArr.forEach((item, idx) => {
      if (idx === 0) {
        xlsxObj[0].data.push(titleArr);
      }
      xlsxObj[0].data.push(item);
    });

    const buffer = xlsx.build(xlsxObj, { sheetOptions: defaultSheetOptions });

    ctx.set(
      "Content-disposition",
      `attachment; filename=${encodeURIComponent(name)}.xlsx`
    );
    ctx.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    ctx.set("Access-Control-Expose-Headers", "Content-Disposition");

    ctx.body = buffer;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  exportExcel,
};
