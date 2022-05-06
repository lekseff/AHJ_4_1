/**
 * @jest-environment jsdom
 */

import CardValidator from '../CardValidator';

describe('Test DOM elements', () => {
  let wrapper = null;
  let app = null;

  beforeEach(() => {
    document.body.innerHTML = '<div class="wrapper"></div>';
    wrapper = document.querySelector('.wrapper');
    app = new CardValidator(wrapper);
    app.bindToDOM();
  });

  test('test render app', () => {
    expect(wrapper.innerHTML).toEqual(CardValidator.markup);
  });

  test('Add class type card', () => {
    app.showCardType('visa');
    const isColorType = wrapper.querySelector('.visa-color');
    const isType = wrapper.querySelector('.visa');
    expect(isColorType).toBeTruthy();
    expect(isType).toBeTruthy();
  });

  test('Show validation ok icon', () => {
    const status = true;
    app.showValidationIcon(status);
    const iconOk = wrapper.querySelector('.card__valid_icon-ok');
    expect(iconOk).toBeTruthy();
  });

  test('Show validation error icon', () => {
    const status = false;
    app.showValidationIcon(status);
    const iconError = wrapper.querySelector('.card__valid_icon-error');
    expect(iconError).toBeTruthy();
  });
});

describe('Test Luhn algorithm', () => {
  test.each([
    ['4960147956718208'],
    ['4960146786703588'],
    ['5472146019720845'],
    ['5472141708819537'],
    ['375117485929854'],
    ['379990234263346'],
    ['6011996393728897'],
    ['2200238966114035'],
    ['6219765507472993'],
    ['2200234768097726'],
  ])('Test - valid - %s', (number) => {
    const received = CardValidator.algorithmLunaValidate(number);
    expect(received).toBeTruthy();
  });

  test.each([
    ['4960147956'],
    ['4960146786703589'],
    ['54721460197208'],
    ['5472141708819536'],
    ['375117485929850'],
    ['379990234263342'],
    ['6011996493728897'],
    ['2200238966114033'],
    ['6219765507472999'],
    ['2200234768097721'],
  ])('Test - error - %s', (number) => {
    const received = CardValidator.algorithmLunaValidate(number);
    expect(received).toBeFalsy();
  });
});

describe('Test identify card type', () => {
  let wrapper = null;
  let app = null;

  beforeAll(() => {
    document.body.innerHTML = '<div class="wrapper"></div>';
    wrapper = document.querySelector('.wrapper');
    app = new CardValidator(wrapper);
  });

  test.each([
    ['4960147956718208', 'visa'],
    ['4960146786703588', 'visa'],
    ['4057041042296622', 'visa'],
    ['4057046555752994', 'visa'],
  ])('Type - visa - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['5472146019720845', 'mastercard'],
    ['5488425857118979', 'mastercard'],
    ['5482267921718780', 'mastercard'],
    ['5472141708819537', 'mastercard'],
  ])('Type - MasterCard - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['375117485929854', 'amexp'],
    ['379990909986304', 'amexp'],
    ['375118381494795', 'amexp'],
    ['379990234263346', 'amexp'],
  ])('Type - American Express -%s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['3562995574833351', 'jcb'],
    ['3562991552967999480', 'jcb'],
    ['3562994038155730108', 'jcb'],
    ['3562998133916273013', 'jcb'],
  ])('Type - JCB - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['6011991981279367588', 'discover'],
    ['6011997739520964', 'discover'],
    ['6011996393728897', 'discover'],
    ['6011993660126278671', 'discover'],
  ])('Type - Discover - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['36076941062307', 'diners'],
    ['36076998936601', 'diners'],
    ['36076996996797', 'diners'],
    ['3607696822477619741', 'diners'],
  ])('Type - Diners - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['6772742259014549862', 'maestro'],
    ['6774967515373170853', 'maestro'],
    ['6775387581799705903', 'maestro'],
    ['6771221983256168006', 'maestro'],
  ])('Type - Maestro - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['2200238127479053', 'mir'],
    ['2200238966114035', 'mir'],
    ['2200235875117869', 'mir'],
    ['2200234768097726', 'mir'],
  ])('Type - Mir - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['6259427708773239', 'unionpay'],
    ['6232406812913925', 'unionpay'],
    ['6210179299438627', 'unionpay'],
    ['6219765507472993', 'unionpay'],
  ])('Type - UnionPay - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });

  test.each([
    ['', 'unknown'],
    ['00000000000000', 'unknown'],
    ['956179299438627', 'unknown'],
  ])('Type - Unknown - %s', (number, expected) => {
    const received = app.identifyCardVendor(number);
    expect(received).toBe(expected);
  });
});
