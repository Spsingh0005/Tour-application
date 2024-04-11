/*eslint-disable*/

import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "api/users/login",

      data: {
        email: email,
        password: password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Successfully logged in...");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", "Either email or password is invalid");
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "api/users/logout",
    });
    console.log(res);
    if (res.data.status === "success") {
      location.assign("/");
    }
  } catch (error) {
    alert("Error logging out ! Try again.");
  }
};

// Accounts page

export const updateSettings = async (data) => {
  try {
    const url = "api/users/updateMe";
    const res = await axios({
      method: "POST",
      url,
      data,
    });

    if (res.data.status === "success") {
      location.reload(true);
    }
  } catch (error) {
    alert("error");
  }
};

export const updatePassword = async (data) => {
  try {
    const url = "api/users/update-password";
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });

    if (res.data.status === "success") {
      showAlert("success", "Password changed successfully");

      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (error) {
    showAlert("error", "Password does not match");
    if (error) {
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  }
};
