export default function algorithmLunaValidate(value) {
  let sumItems = 0;
  let resultCheckSum = null;
  let data = value.split('');
  const controlCheckSum = Number.parseInt(data.pop(), 10); // Получаем последний элемент и удаляем
  data = data.reverse()
    .map((item, idx) => {
      let num = Number.parseInt(item, 10);
      if (idx % 2 === 0) num *= 2;
      if (num >= 10) num = 1 + (num % 10);
      return num;
    });

  sumItems = data.reduce((acc, item) => acc + item, 0);
  resultCheckSum = 10 - (sumItems % 10 || 10);
  return resultCheckSum === controlCheckSum;
}

// const res = algorithmLunaValidate(test);
// console.log(res);
