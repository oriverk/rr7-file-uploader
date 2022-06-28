/**
 * 入力されたファイルサイズを元に計算につかうバイト数と単位を返却
 * @param size
 * @return
 */
function getTarget(size: number) {
  const kb = 1024;
  const mb = kb ** 2;
  const gb = kb ** 3;
  const tb = kb ** 4;

  if (size >= tb) return { target: tb, unit: "TB" };
  if (size >= gb) return { target: gb, unit: "GB" };
  if (size >= mb) return { target: mb, unit: "MB" };
  if (size >= kb) return { target: kb, unit: "KB" };

  return { target: null, unit: "byte" };
}

/**
 * ファイルサイズを適切な単位に変換(小数点第二位まで求める)
 * @param size
 * @param decimal 小数点以下第n位まで求めるか
 * @return
 */
export function convertByteWithUnit(size: number, decimal = 2) {
  const { target, unit } = getTarget(size);
  const d = 10 ** decimal;

  const newSize = target !== null ? Math.floor((size / target) * d) / d : size;

  return newSize + unit;
}
