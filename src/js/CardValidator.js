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
            <input class="card__input-field" type="text" name="number" id="number" maxlength="19" placeholder="0000 0000 0000 0000" autocomplete="off" inputmode="numeric">
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
    return '.card';
  }

  static get cardVendorSelector() {
    return '.card__vendor';
  }

  static get inputSelector() {
    return '#number';
  }

  /**
   * Проверка корректности номера по алгоритму Луна
   * @param {string} number - номер карты
   * @returns - true или false
   */
  static algorithmLunaValidate(number) {
    let sumItems = 0;
    let resultCheckSum = null;
    let data = number.split('');
    const controlCheckSum = Number.parseInt(data.pop(), 10); // Получаем последний элемент и удаляем
    data = data.reverse()
      .map((item, idx) => {
        let num = Number.parseInt(item, 10);
        if (idx % 2 === 0) num *= 2;
        if (num >= 10) num = 1 + (num % 10);
        return num;
      });

    sumItems = data.reduce((acc, item) => acc + item, 0);
    resultCheckSum = 10 - (sumItems % 10 || 10);
    return resultCheckSum === controlCheckSum;
  }

  /**
   * Добавляет разметки и обработчики в родительский элемент
   */
  bindToDOM() {
    this.parentEl.innerHTML = this.constructor.markup;
    this.input = this.parentEl.querySelector(this.constructor.inputSelector);
    this.input.addEventListener('input', (event) => this.inputHandler(event));
  }

  /**
   * Обработка ввода и номера
   * @param {*} event - event
   */
  inputHandler(event) {
    let number = event.target.value;
    number = number.replace(/\s/g, ''); // Удаляем пробелы в строке
    if (/^\d+$/g.test(number)) {
      const type = this.identifyCardVendor(number); // Определяем тип карты
      this.showCardType(type); // Показываем тип карты
    } else {
      this.input.value = this.input.value.replace(/\D/g, ''); // Разрешаем ввод только цифр
      this.showCardType('unknown');
    }
    this.validateNumber(number);
  }

  /**
   * Получаем тип карты
   * @param {string} number - номер карты
   * @returns - тип карты
   */
  identifyCardVendor(number) {
    if (/^4\d{0,15}/.test(number)) {
      return 'visa';
    }

    if (/^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/.test(number)) {
      return 'mastercard';
    }

    if (/^3[47][0-9]{13}$/.test(number)) {
      return 'amexp';
    }

    if (/^(?:2131|1800|35\d{3})\d{3,}$/.test(number)) {
      return 'jcb';
    }

    if (/^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/.test(number)) {
      return 'discover';
    }

    if (/^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/.test(number)) {
      return 'diners';
    }

    if (/^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/.test(number)) {
      return 'maestro';
    }

    if (/^62\d{0,14}/.test(number)) {
      return 'unionpay';
    }

    if (/^220[0-4]\d{0,12}/.test(number)) {
      return 'mir';
    }

    return 'unknown';
  }

  /**
   * Отображение типа карты
   * @param {string} type - тип карты
   */
  showCardType(type) {
    this.parentEl.querySelector(this.constructor.cardSelector).className = 'card';
    this.parentEl.querySelector(this.constructor.cardVendorSelector).className = 'card__vendor';

    if (type !== 'unknown') {
      this.parentEl.querySelector(this.constructor.cardSelector).classList.add(`${type}-color`);
      this.parentEl.querySelector(this.constructor.cardVendorSelector).classList.add(type);
    }
  }

  /**
   * Проверка валидности номера карты и отображение иконки
   * @param {*} number - номер карты
   * @returns -
   */
  validateNumber(number) {
    if (number.length < 12) {
      this.parentEl.querySelector('.card__input').classList = 'card__input';
      return;
    }
    const isValid = this.constructor.algorithmLunaValidate(number);
    this.showValidationIcon(isValid);
  }

  /**
   * Показывает иконку в зависимости от статуса проверки
   * @param {boolean} status - trie или false
   */
  showValidationIcon(status) {
    const cardInput = this.parentEl.querySelector('.card__input');

    if (status && !cardInput.classList.contains('card__valid_icon-ok')) {
      cardInput.classList.add('card__valid_icon-ok');
      cardInput.classList.remove('card__valid_icon-error');
    }

    if (!status && !cardInput.classList.contains('card__valid_icon-error')) {
      cardInput.classList.add('card__valid_icon-error');
      cardInput.classList.remove('card__valid_icon-ok');
    }
  }
}

// const visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
// const masterCard = /^5[1-5][0-9]{14}$/;
// const americanExpress = /^3[47][0-9]{13}$/;
// const jcb = /^(?:2131|1800|35\d{3})\d{11}$/;
// const discover = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
// const dinersClub = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;

// Tests number
// Visa - 4960147956718208, 4960146786703588, 4057041042296622, 4057046555752994
// MasterCard - 5472146019720845, 5488425857118979, 5482267921718780, 5472141708819537
// AmExpress - 375117485929854, 379990909986304, 375118381494795, 379990234263346,372001311345357
// JCB - 3562995574833351, 3562991552967999480, 3562994038155730108, 3562998133916273013
// Discover - 6011991981279367588, 6011996393728897, 6011997739520964, 6011993660126278671
// Diners - 36076941062307, 36076998936601, 36076996996797, 3607696822477619741
// Maestro - 6772742259014549862, 6774967515373170853, 6775387581799705903, 6771221983256168006
// Mir - 2200238127479053, 2200238966114035, 2200235875117869, 2200234768097726
// Unionpay - 6259427708773239, 6232406812913925, 6210179299438627, 6219765507472993
