'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const {locale, text} = req.body;
      
      if (!locale || text === undefined) {res.send({ error: 'Required field(s) missing' });return;}
      if (text.trim() === '') { res.send({ error: 'No text to translate' });return;}
      if (locale !== 'american-to-british' && locale !== 'british-to-american') {res.send({ error: 'Invalid value for locale field' });return;}

      const translatedText = translator.translate(locale,text)

      if (text == translatedText) {
        res.send({
          text,
          translation:'Everything looks good to me!'
        });
        return;
      }
      res.send({
        text,
        translation: translatedText
      })
    });
};
