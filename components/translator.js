const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
  translate(locale,text) {
    //load helper class
    const helper = new Helper;

    // capitalize the first word
    let currText = helper.capitalizeFirstLetter(text);

    // capitalize titles
    const americanToBritishTitlesCapitalized =  helper.capitalizeTitles(americanToBritishTitles, locale);

    if (locale == 'american-to-british') {

      // merge objects
      const americanToBritish = {...americanToBritishTitlesCapitalized, ...americanOnly, ...americanToBritishSpelling}

      //console.log(currText)
      // for loop replace words
      currText = helper.replaceWordsKeyValue(currText, americanToBritish)
      currText = helper.replaceWordsValueKey(currText, britishOnly)

      // replace time
      currText = helper.replaceTime(currText, ':', '.')

      // return data
      return currText;
    } else {

      // merge objects
      const americanToBritish = {...americanToBritishTitlesCapitalized, ...americanOnly, ...americanToBritishSpelling}

      // for loop replace words
      currText = helper.replaceWordsValueKey(currText, americanToBritish)
      currText = helper.replaceWordsKeyValue(currText, britishOnly)

      // replace time
      currText = helper.replaceTime(currText, ':', '.')

      // return data
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
      let pattern = new RegExp(`\\b${key}\\b`, 'gi');
      currText = currText.replace(pattern, ` <span class="highlight">${value}</span> `) //white space important
    }
    return currText;
  }
  replaceWordsValueKey(text, libraryOfWords) {
    let currText = text
    for (const [key, value] of Object.entries(libraryOfWords)) {
      let pattern = new RegExp(`\\b${value}\\b`, 'gi');
      currText = currText.replace(pattern, ` <span class="highlight">${key}</span> `) //white space important
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