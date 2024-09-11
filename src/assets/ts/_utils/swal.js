import Swal from 'sweetalert2';

const buttonStyles = `
  .swal2-confirm, .swal2-cancel {
    padding: 10px 30px;
    font-size: 16px;
    min-width: 100px;
  }
`;

const injectStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = buttonStyles;
  document.head.appendChild(styleElement);
};
injectStyles();

export const SuccessAlert = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonText: '확인',
    customClass: {
      confirmButton: 'swal2-confirm',
    }
  });
};

export const ErrorAlert = (title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonText: 'OK',
    customClass: {
      confirmButton: 'swal2-confirm',
    }
  });
};

export const WarningAlert = (title, text) => {
  return Swal.fire({
    // title: "<h1 style='color:black'>" + title + "</h1>",
    title: title,
    text: text,
    // confirmButtonColor: '#d33',
    cancelButtonColor: '#6e7d88',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '예',
    cancelButtonText: '아니오',
    customClass: {
      confirmButton: 'swal2-confirm',
      cancelButton: 'swal2-cancel',
    }
  });
};
