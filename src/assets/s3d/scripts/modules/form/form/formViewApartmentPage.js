import FormMonster from './form.js';
import SexyInput from '../input/input.js';
import i18next from 'i18next';
import * as yup from 'yup';
import ButtonWithoutIcon from '../../../../../s3d2/scripts/templates/common/ButtonWithoutIcon.js';
import ButtonIconLeft from '../../../../../s3d2/scripts/templates/common/ButtonIconLeft.js';
import TextInput from '../../../../../s3d2/scripts/templates/common/inputs/TextInput.js';
import s3d2spriteIcon from '../../../../../s3d2/scripts/templates/spriteIcon.js';
import Textarea from '../../../../../s3d2/scripts/templates/common/inputs/Textarea.js';
import UIProgressButton from '../UIProgressButton.js';
import SuccessFormPopup from '../SuccessFormPopup.js';

export default class FormViewPage {
  constructor(props) {
    this._id = `form-${(Math.random() * 1000).toFixed(0)}`;
    this.inited = false;
    this.i18n = props.i18n;
    this.config = props.config || {};
    this.target = props.target || document.body;
    this.init();
  }

  init() {
    if (!this.inited) {
      const targetElement =
        typeof this.target === 'string' ? document.querySelector(this.target) : this.target;

      if (!targetElement) {
        console.error(`Target element "${this.target}" not found.`);
        return;
      }

      // targetElement.insertAdjacentHTML('beforeend', this.getTemplate());
      targetElement.insertAdjacentHTML('beforeend', this.s3d2_getTemplate());
      const bttn = this.get$Form().querySelector('.form-progress-button');

      this.uIProgressButton = new UIProgressButton(bttn, {
        statusTime: 3000,
      });
      this.initValidation();
      this.inited = true;
    }
  }

  updateHiddenFields(fields = []) {
    // delete all hidden fields in form
    const $form = document.querySelector(`#${this._id} form`);
    const hiddenFields = $form.querySelectorAll('input[type="hidden"]');
    if (hiddenFields.length > 0) {
      hiddenFields.forEach(field => field.remove());
    }
    // add new hidden fields
    fields.forEach(field => {
      const $field = document.createElement('input');
      $field.type = 'hidden';
      $field.name = field.name;
      $field.value = field.value;
      $form.appendChild($field);
    });
  }

  getTemplate() {
    return `
        <div class="form-layout-page" id="${this._id}">
            <div class="form">
                <form data-home-page="data-home-page" autocomplete="off">
                  <div class="form-overflow">
                    <div class="form-field form-field-input" data-field-input="data-field-input" data-field-name="data-field-name" data-status="field--inactive">
                        <div class="s3d-villa__contact__form__title">
                          ${i18next.t('Your name')}*
                        </div>
                        ${TextInput({
                          text: i18next.t('namePlaceholder'),
                          className: '',
                          attributes: 'name="name"',
                          type: 'text',
                          value: '',
                        })}
                        <div class="input-message" data-input-message="data-input-message"></div>
                    </div>
                    <div class="form-field disabled form-field-input" data-field-input="data-field-input" data-field-phone="data-field-phone" data-status="field--inactive">
                        <div class="s3d-villa__contact__form__title">
                          ${i18next.t('Your phone')}*
                        </div>
                        ${TextInput({
                          text: '',
                          className: '',
                          attributes: 'name="phone"',
                          type: 'text',
                          value: '',
                        })}
                        <div class="input-message" data-input-message="data-input-message"></div>
                    </div>
                    <div class="form-field form-field-input" data-field-input="data-field-input" data-field-message="data-field-message" data-status="field--inactive">
                        <div class="s3d-villa__contact__form__title">
                          ${i18next.t('Your comment')}
                        </div>
                        ${Textarea({
                          text: i18next.t('Type your message'),
                          className: '',
                          attributes: 'name="message"',
                          type: 'text',
                          value: '',
                        })}
                        <div class="input-message" data-input-message="data-input-message"></div>
                    </div>
                  </div>
                  <div class="submit-wrapper">
                    <div class="form-progress-button">
                      <button type="submit" data-btn-submit><span>${i18next.t(
                        'send',
                      )}</span></button>
                      <svg class="form-progress-circle" width="70" height="70"><path d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z"/></svg>
                      <svg class="checkmark" width="70" height="70"><path d="m31.5,46.5l15.3,-23.2"/><path d="m31.5,46.5l-8.5,-7.1"/></svg>
                      <svg class="cross" width="70" height="70"><path d="m35,35l-9.3,-9.3"/><path d="m35,35l9.3,9.3"/><path d="m35,35l-9.3,9.3"/><path d="m35,35l9.3,-9.3"/></svg>
                    </div>
                  </div>
                </form>
            </div>
        </div>
    `;
  }

  s3d2_getTemplate() {
    return `
        <div class="form-layout-page" id="${this._id}">
            <div class="s3d2__contact__form">
                <form data-home-page="data-home-page" autocomplete="off">
                  <div class="s3d2__contact__form__overflow">
                    <div class="s3d2-form-field s3d2-form-field-input" data-field-input="data-field-input" data-field-name="data-field-name" data-status="field--inactive">
                        <div class="s3d2__contact__form__title">
                          ${i18next.t('Your name')}*
                        </div>
                        ${TextInput({
                          text: i18next.t('Type your name'),
                          className: 's3d2-TextInput',
                          attributes: 'name="name"',
                          type: 'text',
                          value: '',
                        })}
                        <div class="input-message" data-input-message="data-input-message"></div>
                    </div>
                    <div class="form-field disabled form-field-input" data-field-input="data-field-input" data-field-phone="data-field-phone" data-status="field--inactive">
                        <div class="s3d2__contact__form__title">
                          ${i18next.t('Your phone')}*
                        </div>
                        ${TextInput({
                          text: '',
                          className: '',
                          attributes: 'name="phone"',
                          type: 'text',
                          value: '',
                        })}
                        <div class="input-message" data-input-message="data-input-message"></div>
                    </div>
                    <div class="form-field form-field-input" data-field-input="data-field-input" data-field-email="data-field-email" data-status="field--inactive">
                        <div class="s3d2__contact__form__title">
                          ${i18next.t('Your email')}
                        </div>
                        ${TextInput({
                          text: i18next.t('Type your email'),
                          className: '',
                          attributes: 'name="email"',
                          type: 'email',
                          value: '',
                        })}
                        <div class="input-message" data-input-message="data-input-message"></div>
                    </div>
                  </div>
                  <div class="s3d2__contact__form__submit-wrapper">
                    <div class="form-progress-button ">
                      <button type="submit" data-btn-submit><span>${i18next.t(
                        'send',
                      )}</span></button>
                      <svg class="form-progress-circle" width="30" height="30" viewBox="0 0 70 70">
                        <path d="m35,2.5c17.955803,0 32.5,14.544199 32.5,32.5c0,17.955803 -14.544197,32.5 -32.5,32.5c-17.955803,0 -32.5,-14.544197 -32.5,-32.5c0,-17.955801 14.544197,-32.5 32.5,-32.5z"/>
                      </svg>

                      <svg class="checkmark" width="50" height="50" viewBox="0 0 70 70"><path d="m31.5,46.5l15.3,-23.2"/>
                        <path d="m31.5,46.5l-8.5,-7.1"/></svg>
                      <svg class="cross" width="30" height="30" viewBox="0 0 70 70"><path d="m35,35l-9.3,-9.3"/>
                        <path d="m35,35l9.3,9.3"/><path d="m35,35l-9.3,9.3"/><path d="m35,35l9.3,-9.3"/>
                      </svg>
                    </div>
                  </div>
                </form>
                <p class="s3d2__contact__info">${i18next.t('form_info')}</p>
            </div>
        </div>
    `;
  }

  initValidation() {
    const $form = document.querySelector(`#${this._id} form`);
    new FormMonster({
      onEndSubmitResult: status => {
        this.uIProgressButton.stop(status, stat => {
          if (stat >= 0) {
            new SuccessFormPopup({
              i18n: this.i18n,
            }).open();
          }
        });
      },
      onEndSubmit: () => {
        this.uIProgressButton.startLoad();
      },
      onStartSubmit: () => {
        this.uIProgressButton.startSubmit();
      },
      elements: {
        $form,
        showSuccessMessage: false,
        successAction: () => {},
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          name: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-name]'),
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(2, i18next.t('name_too_short', { cnt: 2 }))
              .trim(),
            defaultMessage: i18next.t('name'),
            config: this.config,
            valid: false,
            error: [],
          },
          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              config: this.config,
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .test('phone-validation', i18next.t('field_too_short', { cnt: 10 }), function(value) {
                if (!value) return false;
                const digitsOnly = value.replace(/\D/g, '');
                return digitsOnly.length >= 10;
              }),
            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
          email: {
            inputWrapper: new SexyInput({
              animation: 'none',
              config: this.config,
              $field: $form.querySelector('[data-field-email]'),
              typeInput: 'email',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .test('email-validation', i18next.t('invalid_email_format'), function(value) {
                if (!value) return false;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
              }),
            defaultMessage: i18next.t('email'),
            valid: false,
            error: [],
          },
        },
      },
    });
  }
  get$Form() {
    return document.querySelector(`#${this._id}`);
  }
}
