const tagColor = {
  python: '#ff7291',
  deeplearning: '#FD7A23',
  读书笔记: '#baacc8',
  gatsby: '#543083',
  react: '#67DBF9',
  vue: '#47B785',
  node: '#6A9E66',
  jamstack: '#E3B798',
  pytorch: '#EC4D35',
  javascript: '#ecd336',
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export default tagColor