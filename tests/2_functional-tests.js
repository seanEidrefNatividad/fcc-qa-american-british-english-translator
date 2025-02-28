const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

const translator = new Translator();

suite('Functional Tests', () => {
  suite('POST request to /api/translate', () => {
    test('Translation with text and locale fields', (done) => {
      chai
      .request(server)
      .post('/api/translate')
      .send({
        locale: 'american-to-british',
        text: 'Mangoes are my favorite fruit.',
      })
      .end((err,res) => {
        assert.equal(res.status, 200)
        assert.propertyVal(res.body, 'text', 'Mangoes are my favorite fruit.')
        assert.propertyVal(res.body, 'translation', 'Mangoes are my <span class="highlight">favourite</span> fruit.')
      })
      done();
    })
    test('Translation with text and invalid locale field', (done) => {
      chai
      .request(server)
      .post('/api/translate')
      .send({
        locale: 'invalid locale',
        text: 'Mangoes are my favorite fruit.',
      })
      .end((err,res) => {
        assert.equal(res.status, 200)
        assert.propertyVal(res.body, 'error', 'Invalid value for locale field')
      })
      done();
    })
    test('Translation with missing text field', (done) => {
      chai
      .request(server)
      .post('/api/translate')
      .send({
        locale: 'american-to-british',
      })
      .end((err,res) => {
        assert.equal(res.status, 200)
        assert.propertyVal(res.body, 'error', 'Required field(s) missing')
      })
      done();
    })
    
  test('Translation with missing locale field', (done) => {
    chai
    .request(server)
    .post('/api/translate')
    .send({
      text: 'Mangoes are my favorite fruit.',
    })
    .end((err,res) => {
      assert.equal(res.status, 200)
      assert.propertyVal(res.body, 'error', 'Required field(s) missing')
    })
    done();
  })

  test('Translation with empty text', (done) => {
    chai
    .request(server)
    .post('/api/translate')
    .send({
      locale: 'american-to-british',
      text: '',
    })
    .end((err,res) => {
      assert.equal(res.status, 200)
      assert.propertyVal(res.body, 'error', 'No text to translate')
    })
    done();
  })

  test('Translation with text that needs no translation', (done) => {
    chai
    .request(server)
    .post('/api/translate')
    .send({
      locale: 'british-to-american',
      text: 'Mangoes are my favorite fruit.',
    })
    .end((err,res) => {
      assert.equal(res.status, 200)
      assert.propertyVal(res.body, 'text', 'Mangoes are my favorite fruit.')
      assert.propertyVal(res.body, 'translation', 'Everything looks good to me!')
    })
    done();
  })
  })

});
