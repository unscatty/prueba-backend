function hasUniqueCharacters(str) {
  let charSet = {};

  for (let i = 0; i < str.length; i++) {
    let char = str[i];

    if (charSet[char]) {
      return false;
    }

    charSet[char] = true;
  }

  return true;
}
