function check(arr) {
  let p1 = 0,
    p2 = arr.length - 1;
  let increase = true;
  let t;
  let found = false;
  let v = [];
  let rectangle_V = 0;
  while (p1 < p2) {
    if (increase) {
      t = p1 + 1;
      if (t > p2) break;
      if (arr[t] < arr[p1]) {
        found = false;
        while (t <= p2 && arr[t] < arr[p1]) {
          t++;
        }
        if (arr[t] >= arr[p1]) {
          found = true;
          rectangle_V = (t - p1 - 1) * arr[p1];
          for (let i = p1 + 1; i < t; i++) {
            rectangle_V -= arr[i];
          }
          v.push(rectangle_V);
          p1 = t - 1;
        }
        if (!found) {
          increase = false;
        }
      }
      if (increase) {
        p1++;
      }
    } else {
      t = p2 - 1;
      if (t < p1) break;
      if (arr[t] < arr[p2]) {
        while (t >= p1 && arr[t] < arr[p2]) {
          t--;
        }
        if (arr[t] >= arr[p2]) {
          rectangle_V = (p2 - t - 1) * arr[p2];
          for (let i = p2 - 1; i > t; i--) {
            rectangle_V -= arr[i];
          }
          v.push(rectangle_V);
          p2 = t + 1;
        }
      }
      p2--;
    }
  }
  let volume = 0;
  for (let i = 0; i < v.length; i++) {
    volume += v[i];
  }
  console.log(v.toString());
  return volume;
}
console.log(check([9, 0, 0, 1, 8]));
