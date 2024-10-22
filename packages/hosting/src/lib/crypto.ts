// [フロントエンド開発者のためのハッシュ関数入門](https://zenn.dev/bosushi/articles/3353a1b28ef93b#5.-%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89%E3%81%A7%E3%81%AE%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5%E9%96%A2%E6%95%B0%E3%81%AE%E9%81%A9%E7%94%A8)

// 仮パスワードとハッシュ値を取得
// const params = new URLSearchParams(window.location.search);
// const temporaryPassword = params.get('tempPass');
// const hashedPassword = params.get('hash');

// ハッシュ関数（SHA-256）を用いて仮パスワードをハッシュ化
const encoder = new TextEncoder();
export async function getHash(tempPass: string) {
  const msgUint8 = encoder.encode(tempPass);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const binaryArray = new Uint8Array(hashBuffer);
  const hashArray = Array.from(binaryArray);
  const hashedPass = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashedPass;
}

/**
 * compare password; if true, same
 * @param temporaryPassword
 * @param hashedPassword
 * @returns 
 */
export async function comparePassword(temporaryPassword: string, hashedPassword: string) {
  const hashedTempPass = await getHash(temporaryPassword);
  return hashedTempPass === hashedPassword
}

// getHash(temporaryPassword).then((hashedTempPass) => {
//   // 仮パスワードのハッシュ値とURLから取得したハッシュ値を比較
//   if(hashedTempPass === hashedPassword) {
//     // 新しいパスワードの入力と更新処理を実行
//     const newPassword = prompt("新しいパスワードを入力してください：");
//     // updatePassword(newPassword);  // updatePasswordはサーバーと通信してパスワードを更新する関数とする
//   } else {
//     alert("URLが無効です。");
//   }
// });
