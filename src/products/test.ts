const attributes = [
  {
    name: 'Size',
    values: ['S', 'XL', 'XXL'],
  },
  {
    name: 'Màu',
    values: ['Xanh', 'Đỏ', 'TÍm than'],
  },
  {
    name: 'Giới tính',
    values: ['Nam', 'Nữ'],
  },
  { name: 'Chất liệu', values: ['Cotton', 'Nỉ'] },
];

// // const attributes = {
// //   color: ['Red', 'Blue'],
// //   sizes: ['Small', 'Medium', 'Large'],
// //   material: ['Cotton', 'Wool'],
// //   gender: ['Men', 'Women'],
// //   type: ['Casual', 'Sport'],
// // };

// type MapItem = { name: string; value: string };
// type MapItems = MapItem[];
// const maps = [];
// attributes.forEach((items) => {
//   maps.push(items.values?.flatMap((i) => ({ name: items.name, value: i })));
// });
// console.log(maps);
// let variants = [];
// variants = maps.reduce((a, b) =>
//   a.flatMap((a1) =>
//     b.map((b1) => {
//       if (Array.isArray(a1)) return a1.concat(b1);
//       return [a1, b1];
//     }),
//   ),
// );
// console.log(variants);

// // let attrs = [];

// // for (const [attr, values] of Object.entries(attributes))
// //   attrs.push(values.map((v) => ({ [attr]: v })));
// // console.log(attrs);

// // attrs = attrs.reduce((a, b) =>
// //   a.flatMap((d) => b.map((e) => ({ ...d, ...e }))),
// // );

// // console.log(attrs);
