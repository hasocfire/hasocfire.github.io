//const url = "https://pavanpandya.pythonanywhere.com/register";
const url = "https://hasocgermanannotation.el.r.appspot.com/register";

function postData(e) {
  e.preventDefault();
  var submitBtn = document.getElementById("submitBtn");
  var loadingBtn = document.getElementById("loading");
  submitBtn.classList.add("hide");
  loadingBtn.classList.remove("hide");

  let team_name = document.getElementById("teamname").value;
  let email = document.getElementById("email").value;
  let total_members = document.getElementById("totalmembers").value;
  let heard_about = document.querySelector('input[name="question_1"]:checked').value;

  var team_details = {}
  for (var i = 0; i < total_members; i++) {
    var k = document.getElementsByName("membername" + i)[0].value
    k = k.replace(/[.,\/#!$%\^&\*;:{}=\-_`'~()]/g, "").replace(/\s{2,}/g, " ").replace(/\s/g, '_');
    var v = document.getElementsByName("affiliation" + i)[0].value
    v = v.replace(/[.,\/#!$%\^&\*;:{}=\-_`'~()]/g, "").replace(/\s{2,}/g, " ").replace(/\s/g, '_');
    // console.log(k, v)
    team_details[k] = v;
  }
  console.log(team_details)


  let additional_message = document.getElementById("additional_message").value;

  var checkboxes = document.getElementsByName("question_2[]");
  var interested_task = "";
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    if (checkboxes[i].checked) { interested_task += "," + checkboxes[i].value; }
  }
  if (interested_task) interested_task = interested_task.substring(1);

  let myfile = document.getElementById("formFile").files[0];

  let formData = new FormData();
  formData.append('team_name', team_name)
  formData.append('email', email)
  formData.append('total_members', total_members)
  formData.append('team_details', JSON.stringify(team_details))
  formData.append('heard_about', heard_about)
  formData.append('additional_message', additional_message)
  formData.append('interested_task', interested_task)
  formData.append('myfile', myfile)

  console.log(team_name, email, total_members, heard_about, additional_message, interested_task, myfile);

  filetype = myfile.name.split(".").pop();
  if (filetype != "pdf") {
    setTimeout(function () {
      Swal.fire({
        icon: "error",
        title: "Please upload only pdf file",
      });
    }, 5)()
    formElm.reset();
    window.location.reload();
  }
  fetch(url, {
    method: "post",
    body: formData
  })
    .then((res) => {
      console.log(res)
      return res.json()
    })
    .then((data) => {
      loadingBtn.classList.add("hide");
      submitBtn.classList.remove("hide");
      if (data['message'] == 'Team created successfully') {
        Swal.fire(
          'Good job!',
          data['message'],
          'success'
        ).then(function () {
          window.location.reload();
        });
      } else {
        Swal.fire(
          'Error',
          data['message'],
          'error'
        )
      }
      // document.getElementById("add").innerHTML = ""
      // formElm.reset();
      console.log(data)
    })
    .catch((err) => console.log(err));
}

/*  Wizard */
jQuery(function ($) {
  "use strict";
  // $('form#wrapped').attr('action', 'main.py');
  $("#wizard_container")
    .wizard({
      stepsWrapper: "#wrapped",
      submit: ".submit",
      beforeSelect: function (event, state) {
        if ($("input#website").val().length != 0) {
          return false;
        }
        if (!state.isMovingForward) return true;
        var inputs = $(this).wizard("state").step.find(":input");
        return !inputs.length || !!inputs.valid();
      },
    })
    .validate({
      errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
          error.insertBefore(element.next());
        } else {
          error.insertAfter(element);
        }
      },
    });
  //  progress bar
  $("#progressbar").progressbar();
  $("#wizard_container").wizard({
    afterSelect: function (event, state) {
      $("#progressbar").progressbar("value", state.percentComplete);
      $("#location").text(
        "(" + state.stepsComplete + "/" + state.stepsPossible + ")"
      );
    },
  });

  // Validate select
  $("#wrapped").validate({
    ignore: [],
    rules: {
      select: {
        required: true,
      },
    },
    errorPlacement: function (error, element) {
      if (element.is("select:hidden")) {
        error.insertAfter(element.next(".nice-select"));
      } else {
        error.insertAfter(element);
      }
    },
  });
});

// Summary
function getVals(formControl, controlType) {
  switch (controlType) {
    case "question_1":
      // Get the value for a radio
      var value = $(formControl).val();
      $("#question_1").text(value);
      break;

    case "question_2":
      // Get name for set of checkboxes
      var checkboxName = $(formControl).attr("name");

      // Get all checked checkboxes
      var value = [];
      $("input[name*='" + checkboxName + "']").each(function () {
        // Get all checked checboxes in an array
        if (jQuery(this).is(":checked")) {
          value.push($(this).val());
        }
      });
      $("#question_2").text(value.join(", "));
      break;

    case "question_3":
      // Get the value for a radio
      var value = $(formControl).val();
      $("#question_3").text(value);
      break;

    case "additional_message":
      // Get the value for a textarea
      var value = $(formControl).val();
      $("#additional_message").text(value);
      break;
  }
}

// Add Required
function addRequired() {
  ans = document.querySelector('input[name="question_1"]:checked').value;
  if (ans == "Other") {
    console.log("Inside If Condition");
    document.getElementById("additional_message").classList.add("required");
  } else {
    document.getElementById("additional_message").classList.remove("required");
  }
}
