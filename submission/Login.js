proxy = "https://hasocsubmission.el.r.appspot.com"
    //proxy = "http://192.168.43.246:5000"

function validate() {
    var email = document.getElementById("username");
    var password = document.getElementById("password");
}

function setCookie(name, value, daysToLive) {
    // Encode value in order to escape semicolons, commas, and whitespace
    var cookie = name + "=" + encodeURIComponent(value);

    if (typeof daysToLive === "number") {
        /* Sets the max-age attribute so that the cookie expires
            after the specified number of days */
        cookie += "; max-age=" + daysToLive * 24 * 60 * 60;

        document.cookie = cookie;
    }
}

function getCookie(name) {
    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function check_token() {
    if (getCookie('token') != null && getCookie('user') != null && getCookie('team') != null) {
        window.location = 'index.html';
    }
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

function login() {
    var email = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (email == "") {
        nameerr = document.getElementById("Nameerror");
        nameerr.innerHTML = "Username Missing";
        nameerr.removeAttribute("hidden");
    } else if (password == "") {
        passerr = document.getElementById("passerror");
        passerr.innerHTML = "Password Missing";
        passerr.removeAttribute("hidden");
    } else {
        $.ajax({
            type: "POST",
            url: proxy + "/user/login",
            headers: {
                "content-type": "application/json",
            },
            data: JSON.stringify({
                team_name: email,
                password: password,
            }),
            success: function(result) {
                var token = result.token;
                setCookie("token", token, 7);
                setCookie("user", email, 7);
                setCookie("team", result.team, 7)
                window.location = "index.html";
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 402) {
                    Swal.fire({
                        icon: "error",
                        title: "Invalid password",
                    });
                }
                if (jqXHR.status == 404) {
                    Swal.fire({
                        icon: "error",
                        title: "Team does not exist",
                    });
                }
                if (jqXHR.status == 400) {
                    Swal.fire({
                        icon: "error",
                        title: "Bad request",
                    });
                }
            },
        });
    }
}


async function forgot_password() {
    Swal.fire({
        title: 'Enter your registered email',
        input: 'email',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Reset',
        showLoaderOnConfirm: true,
        preConfirm: (email) => {
            return fetch(proxy + '/forgot_password', {
                method: 'post',
                body: JSON.stringify({ 'email': email }),
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(response => {
                if (response.status == 404) {
                    Swal.showValidationMessage('Request Failed: Email is not registered')
                } else if (response.status != 200) {
                    Swal.showValidationMessage('Request Failed: Error')
                }
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: `Reset link sent to your registered email id`,
                html: `<span class="text-mute">link is valid for 5 minutes. please check your spam before requesting again. If you face any issue please write us at hasocfire@gmail.com</mute>`
            })
        }
    })
}