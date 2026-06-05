function check(arr) {
  let v = [];
  let len = arr.length;
  if (len < 3) {
    return;
  }
  let p1 = 0;
  let p3;
  const d = 1;
  let deta = 0;
  let found = false;
  let max = 0,
    index = 0;
  let rcg;
  while (p1 < len - 1) {
    let p2 = p1 + 1;
    deta = arr[p2] - arr[p1];
    if (deta < 0) {
      found = false;
      while (p2 < len) {
        if (arr[p2] >= arr[p1]) {
          found = true;
          rcg = arr[p1] * (p2 - p1 - 1);
          for (let i = p1 + 1; i < p2; i++) {
            rcg -= arr[i];
          }
          v.push(rcg);
          p1 = p2 - 1;
          break;
        }
        p2++;
      }
      if (!found) {
        p2 = p1 + 2;
        while (p2 < len) {
          if (arr[p2] > max) {
            max = arr[p2];
            index = p2;
          }
          p2++;
        }
        if (max > arr[p1 + 1]) {
          rcg = (index - p1 - 1) * arr[index];
          for (let i = p1 + 1; i < index; i++) {
            rcg -= arr[i];
          }
          v.push(rcg);
          p1 = index - 1;
        }
        max = 0;
        index = 0;
      }
    }
    p1++;
  }
  let volume = 0;
  console.log(v.toString());
  for (let i = 0; i < v.length; i++) {
    volume += v[i];
  }
  return volume;
}
console.log(check([6, 2, 5, 2]));
