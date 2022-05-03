// TODO: write code here
import CardValidator from './CardValidator';

const element = document.querySelector('body');
const app = new CardValidator(element);

app.bindToDOM();
