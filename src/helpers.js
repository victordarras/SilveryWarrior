export function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function newUID() {
  return ('' + Math.random()).substr(2, 9)
}

export function groupBy(data, key) {
  return data.reduce(function(acc, cur) {
    (acc[cur[key]] = acc[cur[key]] || []).push(cur);
    return acc;
  }, {});
}
