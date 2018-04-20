export function encrypto (str, xor = 123, hex = 16) {
  if (typeof str !== 'string' || typeof xor !== 'number' || typeof hex !== 'number') {
    return
  }

  let resultList = []
  hex = hex <= 25 ? hex : hex % 25

  for (let i = 0; i < str.length; i++) {
    // 提取字符串每个字符的ascll码
    let charCode = str.charCodeAt(i)
    // 进行异或加密
    charCode = (charCode * 1) ^ xor
    // 异或加密后的字符转成 hex 位数的字符串
    charCode = charCode.toString(hex)
    resultList.push(charCode)
  }

  let splitStr = String.fromCharCode(hex + 97)
  let resultStr = resultList.join(splitStr)
  return resultStr
}

