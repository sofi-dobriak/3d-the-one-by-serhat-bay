import axios from 'axios';
import { Power1, TimelineMax } from 'gsap';

axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';

const successMessagePopup = message => {
  return `<div class="send-error-popup__wrap">
<div class="send-error-popup bg--success js-popup-send-error">
    <span class="send-error-popup__message">${message}</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" class="send-error-popup__icon" viewBox="0 0 16 16">
      <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z"/>
      <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z"/>
    </svg>
</div>
</div>`;
};

const errorMessagePopup = message => {
  return `<div class="send-error-popup__wrap">
<div class="send-error-popup bg--error js-popup-send-error">
    <svg width="24" height="24" viewBox="0 0 25 24"  class="send-error-popup__icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0666 2.6586C10.2719 4.22548 7.66085 5.49996 5.5 5.49996C5.36739 5.49996 5.24022 5.55264 5.14645 5.64641C5.05268 5.74018 5 5.86735 5 5.99996V13C5 15.3679 5.8229 17.118 7.129 18.4557C8.44872 19.8073 10.2844 20.7598 12.3332 21.4673L12.3446 21.4713L12.3445 21.4714C12.4517 21.5113 12.5694 21.5133 12.6778 21.477C14.7211 20.7645 16.5537 19.8097 17.8719 18.4572C19.1771 17.1181 20 15.3679 20 13V5.99996C20 5.86735 19.9473 5.74018 19.8536 5.64641C19.7598 5.55264 19.6326 5.49996 19.5 5.49996C17.3395 5.49996 14.7385 4.23583 12.9334 2.65855C12.8123 2.55589 12.6588 2.49951 12.5 2.49951C12.3412 2.49951 12.1876 2.55591 12.0666 2.6586ZM11.4152 1.89981C11.7176 1.64146 12.1023 1.49951 12.5 1.49951C12.8977 1.49951 13.2824 1.64146 13.5848 1.89981L13.5891 1.90352L13.5891 1.90354C15.2839 3.38524 17.6614 4.49996 19.5 4.49996C19.8978 4.49996 20.2794 4.658 20.5607 4.9393C20.842 5.22061 21 5.60214 21 5.99996V13C21 15.632 20.0729 17.6318 18.5881 19.1552C17.1168 20.6647 15.1203 21.6846 13.0046 22.4221L13.0005 22.4235L13.0005 22.4235C12.6758 22.5335 12.3233 22.529 12.0017 22.4108C9.88241 21.6784 7.88509 20.6614 6.4135 19.1543C4.9271 17.6319 4 15.632 4 13V5.99996C4 5.60214 4.15804 5.22061 4.43934 4.9393C4.72064 4.658 5.10217 4.49996 5.5 4.49996C7.33819 4.49996 9.72581 3.37558 11.4111 1.9034L11.4152 1.89979L11.4152 1.89981ZM12.5 7.49996C12.7761 7.49996 13 7.72382 13 7.99996V12C13 12.2761 12.7761 12.5 12.5 12.5C12.2239 12.5 12 12.2761 12 12V7.99996C12 7.72382 12.2239 7.49996 12.5 7.49996ZM12 16C12 15.7238 12.2239 15.5 12.5 15.5H12.51C12.7861 15.5 13.01 15.7238 13.01 16C13.01 16.2761 12.7861 16.5 12.51 16.5H12.5C12.2239 16.5 12 16.2761 12 16Z" fill="#E7473A"/>
    </svg>
    <span class="send-error-popup__message">${message}</span>
</div>
</div>`;
};

const getMessage = typeError => {
  if (typeError === 'success') {
    return 'Send-error-popup.success';
  }
  return 'Send-error-popup.failed';
};

const mappingRenderError = {
  success: successMessagePopup,
  error: errorMessagePopup,
};

const renderMessages = (i18n, { type, wrapper = 'body' }) => {
  const messageText = i18n.t(getMessage(type), '');
  if (!messageText) return;
  const form = mappingRenderError[type] && mappingRenderError[type](messageText);
  if (!form) return;
  const timeline = new TimelineMax();
  if (!document.querySelector(wrapper)) return;
  document.querySelector(wrapper).insertAdjacentHTML('beforeend', form);
  const container = document.querySelector('.js-popup-send-error');

  timeline.to(container, {
    y: 0,
    duration: 0.4,
    ease: Power1.easeOut,
  });
};

const sendError = (i18n, hostname, keyMessage, type = '', err) => {
  const description = i18n.t(keyMessage);

  const fd = new FormData();
  fd.append('action', 'errorsLog');
  fd.append('hostname', hostname);
  fd.append('description', description);
  fd.append('type', type);
  fd.append('data', JSON.stringify(err.data));

  axios
    .post('/wp-admin/admin-ajax.php', fd)
    .then(res => {
      if (res.data.code === 200) {
        const props = {
          type: 'success',
          wrapper: '.errorPopup',
        };
        setTimeout(() => {
          renderMessages(i18n, props);
        }, 500);
        return;
      }
      throw new Error();
    })
    .catch(err => {
      const props = {
        type: 'error',
        wrapper: '.errorPopup',
      };
      setTimeout(() => {
        renderMessages(i18n, props);
      }, 500);
    });
};

export default sendError;
