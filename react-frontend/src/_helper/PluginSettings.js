// Plugin / third-party library settings and configurations

export const toastSettings = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const datePickerSettings = {
  dateFormat: 'MM/dd/yyyy',
  showMonthDropdown: true,
  showYearDropdown: true,
  dropdownMode: 'select',
};

export const tableSettings = {
  pagination: true,
  pageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  sortable: true,
};

export const editorSettings = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
  theme: 'snow',
};
