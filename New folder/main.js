//Tao khôngn nhớ rõ đề lắm, hình như đề là cho một mảng vào, mỗi phần tử đại diện cho chiều cao một cột,
//tính xem khe nao chứa được nhiều nước nhất, ở đây t sẽ giả sử cho chiều rộng của mỗi cột là như nhau và bằng 1
//tất nhiên nếu đế có biến hóa thêm như chiều rộngn bằng chiều cao hay in ra 3 cột tạo thành khe nước lớn nhất t cx đều làm được
function check(arr) {
  let v = [];
  let len = arr.length;
  if (len < 3) {
    return;
  }
  let p1 = 0,
    p2 = 1;
  const d = 1;
  let h1 = 0,
    h2 = 0;
  let h = 0;
  while (p2 < len) {
    h1 = arr[p2] - arr[p1];
    if (h1 < 0) {
      p1++;
      p2++;
      if (p2 >= len) break;
      h2 = arr[p2] - arr[p1];
      if (h2 > 0) {
        h = Math.min(-h1, h2);
        v.push(h * d);
        p1++;
        p2++;
      }
    } else {
      p1++;
      p2++;
    }
  }
  console.log(v.toString());
  if (v.length === 0) return 0;
  let max = 0;
  for (let i = 0; i < v.length; i++) {
    if (max < v[i]) max = v[i];
  }
  return max;
}
console.log(check([3, 1, 2, 8, 5, 10]));
