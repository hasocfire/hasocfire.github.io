//const url = "https://pavanpandya.pythonanywhere.com/register";
const url = "http://127.0.0.1:5000/register";

function postData(e) {
  e.preventDefault();

  let team_name = document.getElementById("teamname").value;
  let email = document.getElementById("email").value;
  let total_members = document.getElementById("totalmembers").value;
  let heard_about = document.querySelector('input[name="question_1"]:checked').value;

  const team_details = {}  
  for (var i = 0; i < total_members; i++) { 
    // let membername = membername + i 
    // let affiliation = affiliation + i 
    var k = document.getElementsByName("membername" + i)[0].value
    var v = document.getElementsByName("affiliation" + i)[0].value
    console.log(k, v)
    team_details[k]=v; 
  }
  
  let additional_message = document.getElementById("additional_message").value;
  
  var checkboxes = document.getElementsByName("question_2[]");
  var interested_task = "";
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    if (checkboxes[i].checked) { interested_task += "," + checkboxes[i].value;}
  }
  if (interested_task) interested_task = interested_task.substring(1);
  
  let myfile = document.getElementById("formFile").files[0];
  
  // let formData = new FormData()
  // formData.append('team_name', team_name)
  // formData.append('email', email)
  // formData.append('total_members', total_members)
  // formData.append('team_details', team_details)
  // formData.append('heard_about', heard_about)
  // formData.append('additional_message', additional_message)
  // formData.append('interested_task', interested_task)
  // formData.append('myfile', myfile)
  
  console.log(team_name, email, total_members, heard_about, additional_message, interested_task, myfile);

  filetype = myfile.name.split(".").pop();
  if (filetype != "pdf") {
    Swal.fire({
      icon: "error",
      title: "Please upload only pdf file",
    });
  }
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      team_name,
      email,
      total_members,
      team_details,
      heard_about,
      additional_message,
      interested_task,
      myfile
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
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
