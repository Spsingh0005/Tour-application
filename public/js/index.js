/*eslint-disable*/

import { login, logout, updateSettings, updatePassword } from "./login";
import { bookTour } from "./stripe";

const tourBookBtn = document.querySelector("#book-tour");
if (tourBookBtn) {
  tourBookBtn.addEventListener("click", function (e) {
    e.target.textContent = "Processing...";
    const tourId = e.target.dataset.tourId;

    bookTour(tourId);
  });
}

// Login form

const form = document.querySelector(".form--login");
if (form) {
  document.querySelector(".form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

// Logout button

const logOutBtn = document.querySelector(".nav__el--logout");

if (logOutBtn) logOutBtn.addEventListener("click", logout);

// User data form

const userDataForm = document.querySelector(".form-user-data");

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);

    updateSettings(form);
  });
}

// update password form

const passwordForm = document.querySelector(".form-user-settings");

if (passwordForm) {
  passwordForm.addEventListener("submit", (e) => {
    const currentPassword = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    e.preventDefault();

    updatePassword({
      currentPassword,
      password,
      passwordConfirm,
    });
  });
}

// if (bookBtn) {
//   bookBtn.addEventListener("click", (e) => {

//     e.target.textContent = "Processing...";
//     const tourId = e.target.dataset.tourId;
//     bookTour(tourId);
//   });
// }
