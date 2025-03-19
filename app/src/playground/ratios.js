
/* for reference: Player.jsx
full frame 375x812
secondary nav 375x73
track details 375x84
player cover 375x316
player timeline 375x67
media controls 375x74
player edit 375x198 */

// also IP 14 Pro res: 430 x 932


const calc = (parts, max, toMax) => {
  const ratios = parts.map((val) => val / max);
  const newParts = ratios.map((val) => val * toMax);
  return newParts;
}

const max = 812;
const parts = [73, 84, 226, 48, 79, 174, 118]
const toMax = 932;
const res = calc(parts, max, toMax);
console.log(res)
