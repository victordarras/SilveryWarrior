export function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function newUID() {
  return ('' + Math.random()).substr(2, 9)
}
