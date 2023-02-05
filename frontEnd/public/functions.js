function addedAlert() {
  $(".added").removeClass("hide");
  $(".added").addClass("show");
  $(".added").addClass("showAlert");
  setTimeout(function () {
    $(".added").addClass("hide");
    $(".added").removeClass("show");
  }, 1000);
}

function successAlert() {
  $(".success").removeClass("hide");
  $(".success").addClass("show");
  $(".success").addClass("showAlert");
  setTimeout(function () {
    $(".success").addClass("hide");
    $(".success").removeClass("show");
  }, 1000);
}

function notFountAlert() {
  $(".notFound").removeClass("hide");
  $(".notFound").addClass("show");
  $(".notFound").addClass("showAlert");
  setTimeout(function () {
    $(".notFound").addClass("hide");
    $(".notFound").removeClass("show");
  }, 1000);
}

function onAddActor() {
  if (localStorage.getItem("showAddedAlert") === "true") {
    addedAlert();
    localStorage.removeItem("showAddedAlert");
  }
  $("#addActor").click(function () {
    var fName = $("#fName").val();
    var lName = $("#lName").val();
    var data = '{"fName":"' + fName + '", "lName":"' + lName + '"}';
    if (fName === "" && lName === "") {
     noEntriesAlert()
    } else {
      // proceed with sending the AJAX request
      $.ajax({
        headers: { authorization: localStorage.getItem("token") },
        url: "http://localhost:8081/addActor", //Specifies the URL to send the request to. Default is the current page.
        type: "POST", //Specifies the type of request. (GET or POST)
        data: data, //Specifies data to be sent to the server.
        contentType: "application/json; charset=utf-8", //The content type used when sending data to the server. Default is: “application/x-www-form-urlencoded”.
        dataType: "json", //The data type expected of the server response.
        success: function (data, textStatus, xhr) {
          if (data != null) {
            localStorage.setItem("showAddedAlert", "true");
            window.location.assign("http://localhost:3000/addActor.html");
          } else {
            console.log("err");
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          console.log("Error in Operation");
        },
      });
      return false;
    }
  });
}

function onAddCustomer() {
  if (localStorage.getItem("showAddedAlert") === "true") {
    addedAlert();
    localStorage.removeItem("showAddedAlert");
  }
  $("#addCustomer").click(function () {
    var fName = $("#fName").val();
    var lName = $("#lName").val();
    var email = $("#email").val();
    var password = $("#password").val();
    var storeid = $("#store-names li.active").val();
    var address1 = $("#address1").val();
    var address2 = $("#address2").val();
    var city = $("#city-names li.active").val();
    var district = $("#district").val();
    var postalcode = $("#postalcode").val();
    var number = $("#phone").val();

    var data =
      '{"fName":"' +
      fName +
      '", "lName":"' +
      lName +
      '", "storeid":"' +
      storeid +
      '", "email":"' +
      email +
      '", "password":"' +
      password +
      '", "address": {"address1": "' +
      address1 +
      '", "address2":"' +
      address2 +
      '", "district":"' +
      district +
      '", "city":"' +
      city +
      '", "postalcode":"' +
      postalcode +
      '", "phone":"' +
      number +
      '"}}';
    console.log(data);
    if (
      fName === "" ||
      lName === "" ||
      email === "" ||
      password === "" ||
      storeid === "" ||
      address1 === "" ||
      city === "" ||
      district === "" ||
      postalcode === "" ||
      number === ""
    ) {
      noEntriesAlert();
    } else {
      // proceed with sending the AJAX request
      $.ajax({
        headers: { authorization: localStorage.getItem("token") },
        url: "http://localhost:8081/addCustomers", //Specifies the URL to send the request to. Default is the current page.
        type: "POST", //Specifies the type of request. (GET or POST)
        data: data, //Specifies data to be sent to the server.
        contentType: "application/json; charset=utf-8", //The content type used when sending data to the server. Default is: “application/x-www-form-urlencoded”.
        dataType: "json", //The data type expected of the server response.
        success: function (data, textStatus, xhr) {
          if (data != null) {
            console.log(data);
            localStorage.setItem("showAddedAlert", "true");
            window.location.assign("http://localhost:3000/addCustomer.html");
          } else {
            console.log("err");
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          if ((xhr.status == 409)) {
            duplicateEmailAlert();
          }
        },
      });
      return false;
    }
  });
}

function loginAlert() {
  $(".loggedIn").removeClass("hide");
  $(".loggedIn").addClass("show");
  $(".loggedIn").addClass("showAlert");
  setTimeout(function () {
    $(".loggedIn").addClass("hide");
    $(".loggedIn").removeClass("show");
  }, 800);
}

function noEntriesAlert() {
  $(".enter").removeClass("hide");
  $(".enter").addClass("show");
  $(".enter").addClass("showAlert");
  setTimeout(function () {
    $(".enter").addClass("hide");
    $(".enter").removeClass("show");
  }, 800);
}

function duplicateEmailAlert() {
  $(".dupEmail").removeClass("hide");
  $(".dupEmail").addClass("show");
  $(".dupEmail").addClass("showAlert");
  setTimeout(function () {
    $(".dupEmail").addClass("hide");
    $(".dupEmail").removeClass("show");
  }, 800);
}

function onLoginClick() {
  $("#login").click(function () {
    //on click of login btn
    var email = $("#email").val(); //returns the value of form fields
    var password = $("#password").val();
    var data = '{"email":"' + email + '", "password":"' + password + '"}';
    console.log(data);
    $.ajax({
      url: "http://localhost:8081/user/login", //Specifies the URL to send the request to. Default is the current page.
      type: "POST", //Specifies the type of request. (GET or POST)
      data: data, //Specifies data to be sent to the server.
      contentType: "application/json; charset=utf-8", //The content type used when sending data to the server. Default is: “application/x-www-form-urlencoded”.
      dataType: "json", //The data type expected of the server response.
      success: function (data, textStatus, xhr) {
        if (data != null) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userType", data.userType);
          localStorage.setItem("storeid", data.storeid);
          localStorage.setItem("id", data.id);
          loginToLogout();
          $(".wrapper").removeClass("active-popup"); //closes login popup
          loginAlert();
        } else {
          console.log("err");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.log("Error in Operation");
      },
    });
    return false;
  });
}

function loginToLogout() {
  if (sessionStorage.getItem("showLogoutAlert") === "true") {
    logoutAlert();
    sessionStorage.removeItem("showLogoutAlert");
  }
  if (
    localStorage.getItem("token") !== null &&
    localStorage.getItem("userType") !== null
  ) {
    var btnLogin = document.getElementById("btnLogin");
    btnLogin.innerHTML = "Logout";
    btnLogin.onclick = function () {
      btnLogin.innerHTML = "Login";
      // Clear the token and userType from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      $(".wrapper").removeClass("active-popup");
      sessionStorage.setItem("showLogoutAlert", "true");

      window.location.assign("http://localhost:3000/index.html");
    };
  }
}

function getCategoryName() {
  $.ajax({
    url: "http://localhost:8081/getCategoryNames",
    type: "GET",
    success: function (data, textStatus, xhr) {
      if (data != null) {
        localStorage.setItem("categoryNames", JSON.stringify(data));
      } else {
        console.log("err");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log("Error in Operation");
    },
  });
}

function getStoreName() {
  $.ajax({
    url: "http://localhost:8081/getStoreNames",
    type: "GET",
    success: function (data, textStatus, xhr) {
      if (data != null) {
        localStorage.setItem("storeNames", JSON.stringify(data));
      } else {
        console.log("err");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log("Error in Operation");
    },
  });
}

function getCountryName() {
  $.ajax({
    url: "http://localhost:8081/getCountryNames",
    type: "GET",
    success: function (data, textStatus, xhr) {
      if (data != null) {
        localStorage.setItem("countryNames", JSON.stringify(data));
      } else {
        console.log("err");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log("Error in Operation");
    },
  });
}

function getCityName() {
  $.ajax({
    url: "http://localhost:8081/getCityNames",
    type: "GET",
    success: function (data, textStatus, xhr) {
      if (data != null) {
        localStorage.setItem("cityNames", JSON.stringify(data));
      } else {
        console.log("err");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.log("Error in Operation");
    },
  });
}

function onSearch() {
  $("#search").click(function () {
    var title = $("#title").val();
    var categoryid = parseInt($("#category-names li.active").val());
    var maxPrice = $("#price").val();
    if (title === "" && $("#category-names li.active").val() === undefined) {
      noEntriesAlert();
    } else {
      // proceed with sending the AJAX request
      $.ajax({
        url:
          "http://localhost:8081/film/details?title=" +
          title +
          "&categoryid=" +
          categoryid +
          "&maxPrice=" +
          maxPrice, //Specifies the URL to send the request to. Default is the current page.
        type: "GET", //Specifies the type of request. (GET or POST)
        success: function (data, textStatus, xhr) {
          if (data != null) {
            localStorage.setItem("data", JSON.stringify(data));
            window.location.assign("http://localhost:3000/results.html");
          } else {
            console.log("err");
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          console.log("Error in Operation");
        },
      });
      return false;
    }
  });
}

function cart() {
  $("#cart").click(function () {
    if (localStorage.getItem('token') !== null && localStorage.getItem("userType") == "customer") {
      window.location.assign("http://localhost:3000/shoppingCart.html");
    } else {
      $(".alertCart").removeClass("hide");
      $(".alertCart").addClass("show");
      $(".alertCart").addClass("showAlert");
      setTimeout(function () {
        $(".alertCart").addClass("hide");
        $(".alertCart").removeClass("show");
      }, 5000);
      $(".close-btn-2").click(function () {
        $(".alertCart").addClass("hide");
        $(".alertCart").removeClass("show");
      });
    }
  });
}

function onCheckoutClick() {
  if (localStorage.getItem("showAlert") === "true") {
    successAlert();
    localStorage.removeItem("showAlert");
  }
  $(document).on("click", ".checkout", function () {
    //check if avail and store inventory id in session storage
    var storeID = localStorage.getItem("storeid");
    filmDetails = JSON.parse(sessionStorage.getItem("sc"));
    for (var i = 0; i < filmDetails.length; i++) {
      (function (i) {
        $.ajax({
          url:
            "http://localhost:8081/checkAvailability?storeID=" +
            storeID +
            "&filmID=" +
            filmDetails[i][3],
          type: "GET",
          success: function (data, textStatus, xhr) {
            if (data != null) {
              if (data.length == 0) {
                notFountAlert();
                return;
              } else {
                var inventory_id = data;
                var rental_date = dateFormat(new Date());
                var return_date = dateFormat(
                  addDays(new Date(), filmDetails[i][4])
                );
                var customer_id = localStorage.getItem("id");
                var staff_id = localStorage.getItem("storeid");
                var amount = filmDetails[i][2];
                var data =
                  '{"inventory_id":"' +
                  inventory_id +
                  '", "rental_date":"' +
                  rental_date +
                  '", "return_date":"' +
                  return_date +
                  '", "customer_id":"' +
                  customer_id +
                  '", "staff_id":"' +
                  staff_id +
                  '"}';
                $.ajax({
                  url: "http://localhost:8081/rental",
                  type: "POST",
                  data: data,
                  contentType: "application/json; charset=utf-8",
                  dataType: "json",
                  success: function (data, textStatus, xhr) {
                    if (data != null) {
                      rental_id = data;
                      data2 =
                        '{"customer_id":"' +
                        customer_id +
                        '", "staff_id":"' +
                        staff_id +
                        '", "rental_id":"' +
                        rental_id +
                        '", "amount":"' +
                        amount +
                        '", "payment_date":"' +
                        rental_date +
                        '"}';
                      $.ajax({
                        url: "http://localhost:8081/payment",
                        type: "POST",
                        data: data2,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data, textStatus, xhr) {
                          if (data != null) {
                            sessionStorage.clear("sc");
                            localStorage.setItem("showAlert", "true");
                            location.reload();
                          } else {
                            console.log("err");
                          }
                        },
                        error: function (xhr, textStatus, errorThrown) {
                          console.log("Error in Operation");
                        },
                      });
                    } else {
                      console.log("err");
                    }
                  },
                  error: function (xhr, textStatus, errorThrown) {
                    console.log("Error in Operation");
                  },
                });
              }
            } else {
              console.log("err");
            }
          },
          error: function (xhr, textStatus, errorThrown) {
            console.log("Error in Operation");
          },
        });
      })(i);
    }
    return false;
  });
}

function onAdminClick() {
  $("#admin").click(function () {
    if (localStorage.getItem("userType") == "staff") {
      window.location.assign("http://localhost:3000/admin.html");
    } else {
      $(".alert").removeClass("hide");
      $(".alert").addClass("show");
      $(".alert").addClass("showAlert");
      setTimeout(function () {
        $(".alert").addClass("hide");
        $(".alert").removeClass("show");
      }, 5000);
      $(".close-btn").click(function () {
        $(".alert").addClass("hide");
        $(".alert").removeClass("show");
      });
    }
  });
}

function logoutAlert() {
  $(".loggedOut").removeClass("hide");
  $(".loggedOut").addClass("show");
  $(".loggedOut").addClass("showAlert");
  setTimeout(function () {
    $(".loggedOut").addClass("hide");
    $(".loggedOut").removeClass("show");
  }, 800);
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function dateFormat(date) {
  var dateStr =
    date.getFullYear() +
    "-" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getDate()).slice(-2) +
    " " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2);
  return dateStr;
}
