import { toast } from 'react-toastify';

export default async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.warn('Clipboard API failed, falling back to execCommand', err);
      copyTextFallback(text);
    }
  } else {
    copyTextFallback(text);
  }
  toast('Успешно скопировано', {
    type: 'success',
  });
}

function copyTextFallback(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;

  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.opacity = '0';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    console.log('Fallback: Copying was ' + (successful ? 'successful' : 'unsuccessful'));
  } catch (err) {
    console.error('Fallback: Copy command failed', err);
  }

  document.body.removeChild(textarea);
}
