/* eslint-disable class-methods-use-this */
export default class CardValidator {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.input = null;
  }

  static get markup() {
    return `
      <div class="container">
        <div class="card">
          <div class="card__logo">
            <div class="card__chip"></div>
            <div class="card__vendor"></div>
          </div>
          <div class="card__input">
            <label style="display:none;" for="number">Card Number</label>
            <span class="card__input-title">Card Number</span>
            <input class="card__input-field" type="text" name="number" id="number" maxlength="19" placeholder="0000 0000 0000 0000" autocomplete="off"> 
          </div>
          <div class="card__info">
            <span>FULL NAME</span>
            <span>MM/YY</span>
          </div>
        </div>
      </div>
    `;
  }

  static get cardSelector() {
    return 'card';
  }

  static get cardVendorSelector() {
    return 'card__vendor';
  }

  static get inputSelector() {
    return '#number';
  }

  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;
    this.input = this.parentEl.querySelector(this.constructor.inputSelector);
    this.input.addEventListener('input', (event) => this.inputHandler(event));
  }

  inputHandler(event) {
    const number = event.target.value;
    if (/^\d+$/g.test(number)) {
      this.identifyCardVendor(number);
    } else {
      this.input.value = this.input.value.replace(/\D/g, '');
      console.warn('Не верный символ');
    }
  }

  identifyCardVendor(number) {
    console.log(number);

    if (/^4\d{0,15}/.test(number)) {
      console.log('visa');
    }

    if (/^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/.test(number)) {
      console.log('mastercard');
    }

    if (/^3[47][0-9]{13}$/.test(number)) {
      console.log('americanExpress');
    }

    if (/^(?:2131|1800|35\d{3})\d{11}$/.test(number)) {
      console.log('jcb');
    }

    if (/^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/.test(number)) {
      console.log('discover');
    }

    if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(number)) {
      console.log('dinersClub');
    }

    if (/^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/.test(number)) {
      console.log('maestro');
    }

    if (/^62\d{0,14}/.test(number)) {
      console.log('unionpay');
    }

    if (/^220[0-4]\d{0,12}/.test(number)) {
      console.log('mir');
    }
  }
}

// const visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
// const masterCard = /^5[1-5][0-9]{14}$/;
// const americanExpress = /^3[47][0-9]{13}$/;
// const jcb = /^(?:2131|1800|35\d{3})\d{11}$/;
// const discover = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
// const dinersClub = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
