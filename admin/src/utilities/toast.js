import Swal from "sweetalert2";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  //   color: "white",
  background: "#F3F9FA",
});

const toastForDelete = (deleteRes) => {
  if (deleteRes) {
    Toast.fire({
      icon: "success",
      title: "Item Deleted Successfully",
    });
  } else {
    Toast.fire({
      icon: "error",
      title: "There was some Error. Try again later",
    });
  }
};

const toastForCreate = (createRes) => {
  if (createRes) {
    Toast.fire({
      icon: "success",
      title: "Item Created Successfully",
    });
  } else {
    Toast.fire({
      icon: "error",
      title: "There was some Error. Try again later",
    });
  }
};

export { toastForDelete, toastForCreate };
