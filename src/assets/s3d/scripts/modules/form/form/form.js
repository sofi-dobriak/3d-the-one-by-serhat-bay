import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import initView from './formController';
import { langDetect } from '../../helpers/helpers';
import dispatchTrigger from '../../helpers/triggers';

const sendForm = async data => {
  const response = await axios.post('/wp-admin/admin-ajax.php', data);
  return response.data;
};

const lang = langDetect();
(async () => {
  await i18next.init({
    lng: lang,
    debug: window.status === 'local',
    resources: {
      uk: {
        translation: {
          name: 'Ім’я:*',
          phone: 'Телефон:*',
          email: 'Пошта:*',
          namePlaceholder: 'Ім’я',
          emailPlaceholder: 'Пошта',
          send: 'Надіслати',
          sending: 'Відправлення',
          field_too_short: 'Телефон повинен містити не менше {{cnt}} символів',
          field_too_long: 'Телефон має містити не більше {{cnt}} символів',
          field_only_letter: 'Ім`я повинно містити тільки букви',
          field_more_letter: 'Ім`я повинно містити не більше 30 букв',
          title: 'ЧИ ВИ ВЖЕ ЗНАЙШЛИ СВІЙ МАЙБУТНІЙ ДІМ?',
          subtitle:
            'Заповніть форму, щоб отримати більше інформації про нерухомість та умови придбання.',
          only_number: 'Тут лише цифри',
          'Your phone': 'Ваш телефон:',
          'Your name': "Ваше ім'я:",
          'Your email': 'Ваш email:',
          'Type your message': 'Ваше повідомлення',
          required: 'Це поле є обов`язковим',
          'Your comment': 'Ваш коментар',
          sendingSuccessTitle: 'Дякуємо за ваш запит!',
          sendingSuccessText: 'Чекайте відповіді наших менеджерів',
          sendingErrorText: 'Чекайте відповіді наших менеджерів',
          sendingErrorTitle: 'Сталася помилка',
          send_fail:
            'Повідомлення не було відправлено через невідому помилку сервера. Код: [send_fail] ',
          invalid_form:
            'Повідомлення не було відправлено через невідому помилку сервера. Код: [invalid_form] ',
          front_error:
            'Повідомлення не було відправлено через невідому помилку сервера. Код: [front_error] ',
          invalid_upload_file: 'Помилка завантаження файлу. Код: [invalid_upload_file]',
          invalid_recaptcha: 'Заповніть капчу і спробуйте ще раз знову. Код: [invalid_recaptcha]',
          connectionFailed: "Помилка з'єднання с CRM",
        },
      },
      en: {
        translation: {
          name: 'Name:*',
          phone: 'Phone:*',
          email: 'Email:*',
          namePlaceholder: 'Name',
          emailPlaceholder: 'Email',
          form_info: 'This does not obligate you to make a purchase.',
          send: 'Send message',
          sending: 'Sending',
          title: 'Inquire Now',
          subtitle:
            'Connect with our team to explore floor plans, finishes, and personalized options tailored to your vision.',
          'Your name': 'Your name:',
          'Your phone': 'Your phone:',
          'Your email': 'Your email:',
          'Your comment': 'Your comment:',
          'Type your message': 'Type your message',
          name_too_short: 'Name must be at least {{cnt}} characters',
          field_too_short: 'Phone must be at least {{cnt}} characters',
          field_too_long: 'Phone must be at most {{cnt}} characters',
          field_only_letter: 'Name must contain only letters',
          field_more_letter: 'Name must be at most 30 letters',
          invalid_email_format: 'Invalid email format',
          only_number: 'Only digits here',
          required: 'This field is required',
          sendingSuccessTitle: 'Thank you for your request!',
          sendingSuccessText: 'Wait for the answers of our managers',
          sendingErrorText: 'Wait for the answers of our managers',
          sendingErrorTitle: 'An error has occurred',
          send_fail: 'The message was not sent due to an unknown server error. Code: [send_fail] ',
          invalid_form:
            'The message was not sent for an unknown server error. Code: [invalid_form] ',
          front_error: 'The message was not sent for an unknown server error. Code: [front_error] ',
          invalid_upload_file: 'Error uploading file. Code: [invalid_upload_file] ',
          invalid_recaptcha: 'Please fill in the captcha and try again. Code: [invalid_recaptcha] ',
          connectionFailed: 'Server connection error',
        },
      },
      he: {
        translation: {
          name: 'Name:*',
          phone: 'Phone:*',
          email: 'Email:*',
          namePlaceholder: 'Name',
          emailPlaceholder: 'Email',
          send: 'Send message',
          sending: 'Sending',
          title: 'ARE YOU LOOKING TO GET MORE INFORMATION?',
          subtitle:
            'Fill out the form to get more information about the property and purchase details.',
          'Your name': 'Your name:',
          'Your phone': 'Your phone:',
          'Your email': 'Your email:',
          'Your comment': 'Your comment:',
          'Type your message': 'Type your message',
          field_too_short: 'Phone must be at least {{cnt}} characters',
          field_too_long: 'Phone must be at most {{cnt}} characters',
          field_only_letter: 'Name must contain only letters',
          field_more_letter: 'Name must be at most 30 letters',
          only_number: 'Only digits here',
          required: 'This field is required',
          sendingSuccessTitle: 'Thank you for your request!',
          sendingSuccessText: 'Wait for the answers of our managers',
          sendingErrorText: 'Wait for the answers of our managers',
          sendingErrorTitle: 'An error has occurred',
          send_fail: 'The message was not sent due to an unknown server error. Code: [send_fail] ',
          invalid_form:
            'The message was not sent for an unknown server error. Code: [invalid_form] ',
          front_error: 'The message was not sent for an unknown server error. Code: [front_error] ',
          invalid_upload_file: 'Error uploading file. Code: [invalid_upload_file] ',
          invalid_recaptcha: 'Please fill in the captcha and try again. Code: [invalid_recaptcha] ',
          connectionFailed: 'Server connection error',
        },
      },
      zh: {
        translation: {
          name: 'Name:*',
          phone: 'Phone:*',
          email: 'Email:*',
          namePlaceholder: 'Name',
          emailPlaceholder: 'Email',
          send: 'Send message',
          sending: 'Sending',
          title: 'ARE YOU LOOKING TO GET MORE INFORMATION?',
          subtitle:
            'Fill out the form to get more information about the property and purchase details.',
          'Your name': 'Your name:',
          'Your phone': 'Your phone:',
          'Your email': 'Your email:',
          'Your comment': 'Your comment:',
          'Type your message': 'Type your message',
          field_too_short: 'Phone must be at least {{cnt}} characters',
          field_too_long: 'Phone must be at most {{cnt}} characters',
          field_only_letter: 'Name must contain only letters',
          field_more_letter: 'Name must be at most 30 letters',
          only_number: 'Only digits here',
          required: 'This field is required',
          sendingSuccessTitle: 'Thank you for your request!',
          sendingSuccessText: 'Wait for the answers of our managers',
          sendingErrorText: 'Wait for the answers of our managers',
          sendingErrorTitle: 'An error has occurred',
          send_fail: 'The message was not sent due to an unknown server error. Code: [send_fail] ',
          invalid_form:
            'The message was not sent for an unknown server error. Code: [invalid_form] ',
          front_error: 'The message was not sent for an unknown server error. Code: [front_error] ',
          invalid_upload_file: 'Error uploading file. Code: [invalid_upload_file] ',
          invalid_recaptcha: 'Please fill in the captcha and try again. Code: [invalid_recaptcha] ',
          connectionFailed: 'Server connection error',
        },
      },
      uz: {
        translation: {
          name: 'Name:*',
          phone: 'Phone:*',
          email: 'Email:*',
          namePlaceholder: 'Name',
          emailPlaceholder: 'Email',
          send: 'Send message',
          sending: 'Sending',
          title: 'ARE YOU LOOKING TO GET MORE INFORMATION?',
          subtitle:
            'Fill out the form to get more information about the property and purchase details.',
          'Your name': 'Your name:',
          'Your phone': 'Your phone:',
          'Your email': 'Your email:',
          'Your comment': 'Your comment:',
          'Type your message': 'Type your message',
          field_too_short: 'Phone must be at least {{cnt}} characters',
          field_too_long: 'Phone must be at most {{cnt}} characters',
          field_only_letter: 'Name must contain only letters',
          field_more_letter: 'Name must be at most 30 letters',
          only_number: 'Only digits here',
          required: 'This field is required',
          sendingSuccessTitle: 'Thank you for your request!',
          sendingSuccessText: 'Wait for the answers of our managers',
          sendingErrorText: 'Wait for the answers of our managers',
          sendingErrorTitle: 'An error has occurred',
          send_fail: 'The message was not sent due to an unknown server error. Code: [send_fail] ',
          invalid_form:
            'The message was not sent for an unknown server error. Code: [invalid_form] ',
          front_error: 'The message was not sent for an unknown server error. Code: [front_error] ',
          invalid_upload_file: 'Error uploading file. Code: [invalid_upload_file] ',
          invalid_recaptcha: 'Please fill in the captcha and try again. Code: [invalid_recaptcha] ',
          connectionFailed: 'Server connection error',
        },
      },
    },
  });
})();

export default class FormMonster {
  constructor(setting) {
    this.elements = setting.elements;
    this.$body = document.querySelector('body');
    this.showSuccessMessage = setting.showSuccessMessage || true;

    this.state = {
      serverError: null,
      error: true,
      form: setting.elements.fields,
      status: 'filling',
    };
    this.fieldsKey = Object.keys(this.elements.fields);
    this.onStartSubmit = setting.onStartSubmit || (() => {});
    this.onEndSubmit = setting.onEndSubmit || (() => {});
    this.onEndSubmitResult = setting.onEndSubmitResult || (() => {});
    this.watchedState = initView(this.state, this.elements);

    this.init();
  }

  validate(formData) {
    const formDataObj = this.fieldsKey.reduce((acc, key) => {
      acc[key] = formData.get(key);
      return acc;
    }, {});
    const shapeObject = this.fieldsKey.reduce((acc, key) => {
      acc[key] = this.elements.fields[key].rule;
      return acc;
    }, {});
    const schema = yup.object().shape(shapeObject);
    try {
      schema.validateSync(formDataObj, { abortEarly: false });
      return null;
    } catch (err) {
      return err.inner;
    }
  }

  changeInput() {
    return e => {
      e.preventDefault();

      const changedFieldName = e.target.name;
      if (!changedFieldName || !this.elements.fields[changedFieldName]) {
        return null;
      }

      this.watchedState.status = 'filling';

      const formData = new FormData(this.elements.$form);
      // const error = this.validate(formData);
      const allErrors = this.validate(formData);

      // Очищаємо помилки для ВСІХ полів
      this.fieldsKey.forEach(key => {
        this.watchedState.form[key].valid = true;
        this.watchedState.form[key].error = [];
      });

      // Якщо є помилки - шукаємо помилку для поточного поля
      if (allErrors) {
        const currentFieldError = allErrors.find(err => err.path === changedFieldName);

        if (currentFieldError) {
          this.watchedState.form[changedFieldName].valid = false;
          this.watchedState.form[changedFieldName].error = [currentFieldError.message];
          this.watchedState.status = 'renderErrorValidation';
          return null;
        }
      }

      this.watchedState.error = false;
      this.watchedState.status = 'renderSuccessValidation';
      return null;

      // this.fieldsKey.map(key => {
      //   const field = this.elements.fields[key];
      //   field.valid = true;
      //   field.error = [];
      //   return null;
      // });

      // if (error) {
      //   error.forEach(({ path, message }) => {
      //     this.watchedState.form[path].valid = false;
      //     this.watchedState.form[path].error.push(message);
      //     return null;
      //   });
      //   this.watchedState.error = true;
      //   this.watchedState.status = 'renderErrorValidation';
      //   return null;
      // }
    };
  }

  submitForm() {
    return async e => {
      e.preventDefault();
      // this.changeInput()(e);

      // Валідуємо форму
      const formData = new FormData(this.elements.$form);
      const allErrors = this.validate(formData);

      // Очищаємо всі помилки
      this.fieldsKey.forEach(key => {
        this.watchedState.form[key].valid = true;
        this.watchedState.form[key].error = [];
      });

      // Якщо є помилки - показуємо їх для всіх полів
      if (allErrors) {
        allErrors.forEach(({ path, message }) => {
          this.watchedState.form[path].valid = false;
          this.watchedState.form[path].error = [message];
        });

        this.watchedState.error = true;
        this.watchedState.status = 'renderErrorValidation';
        return null; // НЕ відправляємо
      }

      // Якщо помилок немає - відправляємо
      this.watchedState.error = false;
      this.onStartSubmit();

      if (this.watchedState.error === false) {
        this.onStartSubmit();
        if (window.status === 'local') {
          this.onEndSubmit();
          this.watchedState.status = 'successSand';
          wait(2000).then(() => {
            this.onEndSubmitResult(1);
          });
          return true;
        }
        try {
          this.watchedState.status = 'loading';
          const formData = new FormData(this.elements.$form);
          formData.append('action', 'app');
          const { error, code_error } = await sendForm(formData);
          this.onEndSubmit();
          if (error === 0) {
            this.watchedState.status = 'successSand';
            dispatchTrigger('successFormSend', {});
            this.onEndSubmitResult(1);
            return true;
          }
          this.watchedState.serverError = code_error;
          this.watchedState.status = 'failed';
        } catch (err) {
          this.watchedState.error = err.message;
          this.watchedState.serverError = 'front_error';
          this.watchedState.status = 'failed';
          this.onEndSubmitResult(0);
        }
      }
      return null;
    };
  }

  listers() {
    this.elements.$form.addEventListener('submit', this.submitForm(this.watchedState));
    this.fieldsKey.map(key => {
      const { input } = this.elements.fields[key].inputWrapper;
      input.addEventListener('input', this.changeInput(this.watchedState));
      return null;
    });
  }

  init() {
    this.listers();
  }
}

async function wait(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
