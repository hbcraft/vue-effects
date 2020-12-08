const ue = typeof Float32Array === 'function' // 是否有Float32Array
function de (t: number, e: number) {
  return 1 - 3 * e + 3 * t
}
function me (t: number, e: number) {
  return 3 * e - 6 * t
}
function pe (t: number) {
  return 3 * t
}
function he (t: number, e: number, i: number) {
  return ((de(e, i) * t + me(e, i)) * t + pe(e)) * t
}
function fe (t: number, e: number, i: number) {
  return 3 * de(e, i) * t * t + 2 * me(e, i) * t + pe(e)
}
function ve (t: number) {
  return t
}
export default function be (t: number, e: number, i: number, a: number) {
  // 如果t和i不在0-1之间
  if (!(t >= 0 && t <= 1 && i >= 0 && i <= 1)) {
    // 抛出错误
    throw new Error('bezier x values must be in [0, 1] range')
  }
  // 如果 前两个参数相等，后两个参数也相等
  if (t === e && i === a) {
    // 返回一个返回传入值的函数
    return ve
  }
  const n = ue ? new Float32Array(11) : new Array(11)
  for (let o = 0; o < 11; ++o) {
    // he((0~1,间隔0.1),传入的第一个参数，传入的第三个参数)
    n[o] = he(0.1 * o, t, i)
  }
  function r (e: number) {
    let o = 1
    let a = 0
    for (; o !== 10 && n[o] <= e; ++o) { a += 0.1 }
    --o
    const r = a + 0.1 * ((e - n[o]) / (n[o + 1] - n[o]))
    const s = fe(r, t, i)
    return s >= 0.001 ? (function (t, e, i, a) {
      for (let n = 0; n < 4; ++n) {
        const o = fe(e, i, a)
        if (o === 0) { return e }
        e -= (he(e, i, a) - t) / o
      }
      return e
    }(e, r, t, i)) : s === 0 ? r : (function (t, e, i, a, n) {
      let o; let r; let s = 0
      do {
        (o = he(r = e + (i - e) / 2, a, n) - t) > 0 ? i = r : e = r
      } while (Math.abs(o) > 1e-7 && ++s < 10);return r
    }(e, a, a + 0.1, t, i))
  }
  return function (t: number) {
    return t === 0 || t === 1 ? t : he(r(t), e, a)
  }
}
