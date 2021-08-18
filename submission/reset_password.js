proxy = "https://hasocsubmission.el.r.appspot.com"
    //proxy = "http://192.168.43.246:5000"

async function reset_password() {
    const urlParams = new URLSearchParams(window.location.search);
    tkn = urlParams.get('tkn')
    if (tkn == null) {
        document.body.innetHTML = `<h1 class="text-center text-danger">Invalid Link</h1><br><a href="login.html"><h2 class="text-center text-info">Redirect to login</h2></a>`
    } else {
        window.history.pushState({}, document.title, "" + "reset_password.html");
        password = document.getElementById("inputPasswordNew").value;
        confirm_pass = document.getElementById("inputPasswordConfirm").value;
        if (password == confirm_pass) {
            fetch(proxy + '/reset_password/' + tkn, {
                method: 'post',
                body: JSON.stringify({ 'new_password': password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(responce => {
                if (responce.status == 200) {
                    document.body.innerHTML = `<h1 class="text-success text-center">Password Updated Succssfully</h1><br>
                    <a href="login.html"><h2 class="text-center text-info">Redirect to login</h2></a>`
                } else {
                    document.getElementById("fail_pass").removeAttribute("hidden")
                }
            })
        } else {
            document.getElementById("not_match").removeAttribute("hidden");
        }
    }
}