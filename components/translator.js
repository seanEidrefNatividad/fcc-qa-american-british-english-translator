const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  translate(locale,text) {
    const helper = new Helper;
    let currText = helper.capitalizeFirstLetter(text);
    const americanToBritishTitlesCapitalized =  helper.capitalizeTitles(americanToBritishTitles, locale);

    if (locale == 'american-to-british') {
      const americanToBritish = {...americanToBritishTitlesCapitalized, ...americanOnly, ...americanToBritishSpelling}
      currText = helper.replaceWordsKeyValue(currText, americanToBritish)
      currText = helper.replaceWordsValueKey(currText, britishOnly)
      currText = helper.replaceTime(currText, ':', '.')
      return currText;
    } else {
      const americanToBritish = {...americanToBritishTitlesCapitalized, ...americanOnly, ...americanToBritishSpelling}
      currText = helper.replaceWordsValueKey(currText, americanToBritish)
      currText = helper.replaceWordsKeyValue(currText, britishOnly)
      currText = helper.replaceTime(currText, ':', '.')
      return currText;
    }
  }
}
class Helper {
  capitalizeFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1);
  } 
  capitalizeTitles(titlesObject, locale) {
    return Object.fromEntries(
      Object.entries(titlesObject).map(([key, value]) => {
        const newKey = locale == 'american-to-british' ? key : value;
        const newValue = locale == 'american-to-british' ? value : key
        return [
        newKey,
        this.capitalizeFirstLetter(newValue)
      ]})
    );
  }
  replaceWordsKeyValue(text, libraryOfWords) {
    let currText = text
    for (const [key, value] of Object.entries(libraryOfWords)) {
      let pattern = new RegExp(`${key}`, 'gi');
      currText = currText.replace(pattern, `<span class="highlight">${value}</span>`) //white space important
    }
    return currText;
  }
  replaceWordsValueKey(text, libraryOfWords) {
    let currText = text
    for (const [key, value] of Object.entries(libraryOfWords)) {
      let pattern = new RegExp(`${value}`, 'gi');
      currText = currText.replace(pattern, `<span class="highlight">${key}</span>`) //white space important
    }
    return currText;
  }
  replaceTime(text, delimiterBefore, delimiterAfter){
    let pattern = new RegExp(`(\\d{2})${delimiterBefore}(\\d{2})`, 'g');
    let currentText = text.replace(pattern, `<span class="highlight">$1${delimiterAfter}$2</span>` )
    return currentText;
  }
}

module.exports = Translator;