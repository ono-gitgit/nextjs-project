//日付を「YYYY-MM-DD」の形式で表示させる処理
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year + "-" + month + "-" + day;
}

export function formatDateToString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year + "年" + month + "月" + day + "日";
}

//数値を３桁区切りで表示させる処理
export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("ja-JP").format(value);
};
