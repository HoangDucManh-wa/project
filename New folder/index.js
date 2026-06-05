let a = [10, 1, 3, 1, 10];

function counter() {
  let res = 0;

  let mainCheck = [];

  for (let i = 1; i < a.length - 1; i++) {
    console.log("bat dau tai ", a[i]);

    if (mainCheck.includes(i)) {
      continue;
    }

    let check = [];

    let left = -1;
    let leftValue = -1;
    let right = -1;
    let rightValue = -1;

    for (let j = i - 1; j >= 0; j--) {
      if (a[j] > a[i]) {
        left = j;
        leftValue = a[j];
        break;
      }
    }

    for (let j = i + 1; j < a.length; j++) {
      if (a[j] === a[i]) {
        check.push(j);
      }

      if (a[j] > a[i]) {
        right = j;
        rightValue = a[j];
        break;
      }
    }

    if (left === -1 || right === -1) {
      continue;
    }

    console.log("left", leftValue, "right", rightValue);
    console.log((right - left - 1) * (Math.min(leftValue, rightValue) - a[i]));
    res += (right - left - 1) * (Math.min(leftValue, rightValue) - a[i]);

    mainCheck.push(...check);
  }

  console.log(res);
}

counter();
