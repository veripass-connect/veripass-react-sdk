import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const swal = withReactContent(Swal);

const defaultErrorMap = {
  insufficient_permissions: {
    title: 'Insufficient permissions',
    message: 'You do not have sufficient permissions to enter.',
  },
  access_denied: {
    title: 'Access denied',
    message: 'Your account does not have access to this application.',
  },
};

export function useUrlErrorHandler(errorKeyName = 'veripass-error', errorMap = defaultErrorMap) {
  const searchParams = new URLSearchParams(window?.location?.search);

  const showErrorFromUrl = () => {
    const error = searchParams.get(errorKeyName);
    if (!error) return;

    const errorDetails = errorMap[error];

    if (errorDetails) {
      swal.fire({
        title: errorDetails.title,
        text: errorDetails.message,
        icon: 'error',
      }).then(() => {
        searchParams.delete(errorKeyName);
        window.location.replace(`${window?.location?.pathname}?${searchParams.toString()}`);
      });
    }
  };

  return {
    showErrorFromUrl,
  };
}
