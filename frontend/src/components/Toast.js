import { toast } from 'react-toastify';
import { css } from 'glamor';

const customToast = {
  // Keep the signature of the original toast object
  // Doing so you can pass additionnal options
  success(msg, options = {}){
    return toast.success(msg + ' ✅', {
      // Merge additionals options
      ...options,
      progressClassName: css({
        backgroundColor: 'purple !important'
      })
    });
  },
  error(msg, options = {}){
    return toast.error(msg + ' ❌', {
      ...options,
      progressClassName: css({
        backgroundColor: '#007aff !important'
      })
    });
  }
}

export default customToast