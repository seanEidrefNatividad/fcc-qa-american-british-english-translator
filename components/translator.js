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

    if (locale == 'american-to-british') {

      // capitalize titles
      const americanToBritishTitlesCapitalized =  helper.capitalizeTitles(americanToBritishTitles);

      // merge objects
      const americanToBritish = {...americanToBritishTitlesCapitalized, ...americanOnly, ...americanToBritishSpelling}

      // for loop replace words
      currText = helper.replaceWords(currText, americanToBritish)

      // replace time
      currText = helper.replaceTime(currText, ':', '.')

      // return data
      return currText;
    } else {

    }
  }
}
class Helper {
  capitalizeFirstLetter(text) {
    return text[0].toUpperCase() + text.slice(1);
  } 
  capitalizeTitles(titlesObject) {
    return Object.fromEntries(
      Object.entries(titlesObject).map(([key, value]) => [
        key,
        this.capitalizeFirstLetter(value)
      ])
    );
  }
  replaceWords(text, libraryOfWords) {
    let currText = text
    for (const [key, value] of Object.entries(libraryOfWords)) {
      let pattern = new RegExp(`\\b${key}\\b`, 'gi');
      currText = currText.replace(pattern, ` <span class="highlight">${value}</span> `) //white space important
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