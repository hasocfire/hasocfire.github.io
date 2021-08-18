proxy = `https://hasocsubmission.el.r.appspot.com`
    //proxy = `http://192.168.43.246:5000`

var task_titles = {
    "1A_English": "English Subtask A",
    "1B_English": "English Subtask B",
    "1A_Hindi": "Hindi Subtask A",
    "1B_Hindi": "Hindi Subtask B",
    "1A_Marathi": "Marathi Subtask A",
    "2_ICHCL": "Subtask 2"
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
    if (getCookie('token') == null || getCookie('user') == null || getCookie('team') == null) {
        window.location = 'login.html';
    } else {
        team_data_new()
    }
}


async function submission() {
    const url = proxy + "/dashboard/submission";
    let submission_name = `</span><input type=text id="Subname" class="swal2-input mb-2" placeholder="Enter submission name" style="width:70%;" maxlength="40"></input>`
    let desc = `<textarea id="Desc" placeholder="Enter submission description(optional)" class="swal2-input mb-3" style="width:70%;height:30%" maxlength="256"></textarea>`
    let select_box_html = `<select id="subtask_name" class="swal2-input" style="width:70%;">
    <option value="" selected hidden>Select Subtask</option>
    <option value="1A_English">English Subtask A</option>
    <option value="1B_English">English Subtask B</option>
    <option value="1A_Hindi">Hindi Subtask A</option>
    <option value="1B_Hindi">Hindi Subtask B</option>
    <option value="1A_Marathi">Marathi Subtask A</option>
    <option value="2_ICHCL">Subtask 2</option></select>`
    Swal.fire({
        html: `${select_box_html}${submission_name}${desc}<input type="file" id="file" placeholder="Submission File">`,
        confirmButtonText: 'SUBMIT',
        focusConfirm: false,
        customClass: 'swal-height-submission',
        preConfirm: () => {
            Swal.showLoading()
            var team_name = getCookie('user')
            if (team_name == null) {
                window.location = "login.html"
            }
            var des = document.getElementById("Desc").value
            var input = document.getElementById("file");
            var ex = document.getElementById("file").value;
            var sel = document.getElementById("subtask_name")
            var subname = document.getElementById("Subname").value
            var opt = sel.options[sel.selectedIndex];
            var tasks_name = opt.value;
            ex = ex.split('.').pop()

            if (tasks_name == "") {
                Swal.showValidationMessage(
                    `Please Select Subtask`
                )
            } else if (subname.length == 0) {
                Swal.showValidationMessage(
                    `Please Enter Submission Name`
                )
            } else if (input.files.length == 0) {
                Swal.showValidationMessage(`Please Select File`)
            } else if (ex != "csv") {
                Swal.showValidationMessage(
                    `Please Submit CSV File only`
                )
            } else {
                if (input.files && input.files[0]) {
                    const formData = new FormData();
                    formData.append('file', input.files[0])
                    formData.append('task_name', tasks_name);
                    formData.append('team_name', team_name);
                    formData.append('description', des);
                    formData.append('submission_name', subname)
                    return fetch(url, {
                            method: 'post',
                            body: formData,
                            headers: {
                                "x-access-token": getCookie('token')
                            }
                        })
                        .then(response => {
                            if (response.status == 401) {
                                window.location = "login.html"
                            }
                            if (response.status != 200) {
                                throw new Error(response.status)
                            }
                            return response.json()
                        })
                        .catch(error => {
                            if (error == 'Error: 408') {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Maximum Submission Limit Exceed!'
                                })
                            }
                            if (error == 'Error: 406') {
                                Swal.showValidationMessage(
                                    `Missing or Unknown Tweet ID found Please Upload Proper Submission Files`
                                )
                            }
                            if (error == 'Error: 405') {
                                Swal.showValidationMessage(
                                    `Unknown or Empty Labels Found Please Upload Proper Submission Files`
                                )
                            }
                            if (error == 'Error: 403') {
                                Swal.showValidationMessage(
                                    `Wrong Column Names Please Upload Proper Submission Files`
                                )
                            }
                            if (error == 'Error: 409') {
                                Swal.showValidationMessage(
                                    `Can't Use Same Submission Name For Multiple Submissions`
                                )
                            }
                        })
                }
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Run Submitted Successfully! 🥳🎉🥳',
                icon: 'success',
                timer: 2000,
                showConfirmButton: true
            })
            team_data_new();
        }
    })
}


function logout() {
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.clear()
    window.location = 'login.html'
}


async function changepassword() {
    var password = document.getElementById("Password").value
    var new_password = document.getElementById("NewPassword").value
    var confirm_passowrd = document.getElementById("ConfirmPassword").value
    if (new_password == confirm_passowrd) {
        $.ajax({
            type: 'POST',
            url: proxy + "/user/change_password",
            headers: {
                "x-access-token": getCookie('token'),
                'content-type': 'application/json'
            },
            data: JSON.stringify({
                "team_name": getCookie('user'),
                "password": password,
                "new_password": new_password
            }),
            success: function(result) {
                $('#close_modal').click() //document.getElementById('myModal4').style.display = "none";
                Swal.fire({
                    icon: 'success',
                    title: 'Password Updated Successfully'
                })
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 402) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Invalid password',
                    })
                }
                if (jqXHR.status == 401) {
                    window.location = "login.html"
                }
            }

        });
    } else {
        var passerr = document.getElementById('passworderr');
        passerr.innerHTML = "Password and Confirm Password Must be Same"
        passerr.removeAttribute("hidden")
    }
}


async function details(_id) {
    $.ajax({
        type: 'POST',
        url: proxy + `/dashboard/submission_details`,
        headers: {
            "x-access-token": getCookie('token'),
            'content-type': 'application/json'
        },
        data: JSON.stringify({
            "_id": _id
        }),
        success: function(result) {
            result = result[0]
            document.getElementById("modal_submission_time").innerHTML = result.timestamp
            tab = `<table class="table table-hover">
            <thead style="color:cadetblue">
                <tr>
                    <th class="text-center" colspan="2">${task_titles[result.task_name]}</th>
                </tr>
                <tr>
                    <th class="text-center" colspan="2">${result.submission_name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Macro F1</td>
                    <td>${result.f1_score.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Macro Precision</td>
                    <td>${result.precision.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Macro Recall</td>
                    <td>${result.recall.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Accuracy</td>
                    <td>${result.accuracy.toFixed(5)*100}%</td>
                </tr>
            </tbody>
        </table>`
            if (result.description != "") {
                tab += `<div><p class="text-justify border p-2">${result.description}</p></div>`
            }
            document.getElementById("details_modal_body").innerHTML = tab
        },
        error: function(jqXHR, textStatus, errorThrown) {

        }
    });
}

async function team_data_new() {
    var sort_param = "task_name";
    sort_param = document.getElementById("sort_param").value;
    document.getElementById("navbarDropdownMenuLink").innerHTML = `Welcome, Team ${getCookie('team')} 🤗`
    $.ajax({
        type: 'POST',
        url: proxy + `/dashboard/team_data/${sort_param}`,
        headers: {
            "x-access-token": getCookie('token'),
            'content-type': 'application/json'
        },
        data: JSON.stringify({
            "team_name": getCookie('user')
        }),
        success: function(result) {
            if (result.length <= 2) {
                document.getElementById("footer_div").classList.add("position-fixed")
            }
            if (result.length >= 2) {
                if (document.getElementsByClassName('footer position-fixed bg-dark').length > 0) {
                    document.getElementById("footer_div").classList.remove("position-fixed")

                }
            }
            var table_body = document.getElementById("team_data_table_body")
            var tab = ``;

            for (var i = 0; i < result.length; i++) {
                tab += `<tr class="text-center">
                    <td class="text-left align-middle">${result[i].timestamp}</td>
                    <td class="text-center align-middle">${result[i].submission_name}</td>
                    <td class="text-center align-middle">${task_titles[result[i].task_name]}</td>
                    <td class="text-center align-middle">${result[i].f1_score.toFixed(4)}</td>
                    <td class="text-center align-middle"><button class="btn btn-outline-info" id="${result[i]._id}" onclick="details(this.id)" name="details" data-toggle="modal" data-target="#myModal3">Details</button></td>
                    <td class="text-center align-middle"> <button class="btn btn-outline-info" onclick="details(this.id); location.href='leaderboard.html?subtask_name=${result[i].task_name}'"><i class="fas fa-walking"></i></a> </button></td>
                </tr>`
                table_body.innerHTML = tab + `<div class="mb-3"></div>`;
                document.getElementById("loading").setAttribute("hidden", true);
                document.getElementById("zero_submission_div").setAttribute("hidden", true);
                document.getElementById("body_content").removeAttribute("hidden");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 404) {
                //document.getElementById("footer_div").classList.add("position-fixed")
                document.getElementById("loading").setAttribute("hidden", true);
                document.getElementById("zero_submission_div").removeAttribute("hidden");
            }
            if (jqXHR.status == 401) {
                window.location = "login.html"
            }
        }
    });
}