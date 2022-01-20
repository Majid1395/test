//  global variables
//  global variables
let ScenarioCounter = 0;
let editor_id_num = 0;
let photo_id_num = 0;
let last_scenario_active = 0;
let last_url_and_id_info = [];
let taxonomie_file_view = 0;
let haupt_taxonomie = 0;
let icon_id = 0;
let label_left_id = 0;
let pin_storage_array = [];
let inter_storage_array = [];
let canvas_images_storage = [];
let PinCounter = 0;
let pinColor;
let check;
let positionIcon;
let SzenarioHeadItemChanged = true;
let altKat = "";

/*---------------------------------------------------------------------------------------------------*/
// text editor  set_tinymce_selector_for_editor function
// Here, the textarea will be identified and given all the tools that allow text modification.
function set_tinymce_selector_for_editor(editor_id) {
  return tinymce.init({
    selector: editor_id,

    plugins: ["insertdatetime  table paste wordcount", "textcolor"],

    toolbar:
      "undo redo | bold italic underline |fontselect fontsizeselect  |  alignleft aligncenter alignright alignjustify | forecolor backcolor removeformat |ltr rtl",
  });
}

//----------------------------------------------------------------------------------------------------------------------------
/*Here the main textarea are defined on the page (the first two areas)*/
set_tinymce_selector_for_editor("#editor_thema_beschreibung");
set_tinymce_selector_for_editor("#editor_lernziele_beschreibung");
//-------------------------------------start function-------------------------------------------------------------------------------
//Note: This function calls itself once automatically , see the end of this function
(function start() {
  // Here, the main section will be created that contains the scenarios bar
  // and the location of the scenarios’ attachments below this bar,
  //  just above of the place where there is a button to add and delete the scenario
  /*scenarios_container the container that will contain all the scenarios and the scenario bar*/
  const scenarios_container = document.createElement("div");
  scenarios_container.className = "SzenariosContainer";

  /* creat the scenarios bar  container
  This container is where the containers of the scenario heads will be placed and is scrollable in a horizontal axis */
  const scenarios_tap = document.createElement("div");
  scenarios_tap.className = "SzenariosTap";
  scenarios_container.appendChild(scenarios_tap);
  scenarios_tap.id = "scenariosTapId";
  /* append  scenarios_container above of the place where there is a button to add and delete the scenario*/
  $(".SzenarioAddierenContainer").before(scenarios_container);

  CreatTaxonomieStufe(0);
  WatchMenuBtn();
})();
// --------------------------------------------------------------------------------------------------------------------------------
// When the Add Scenario button at the bottom of the page is pressed, these functions will be called
// The global variable "ScenarioCounter" will be increased according to the number of scenarios added
$(".AddIcon").on("click", function () {
  // ScenarioCounter is used in the process of giving scenarios their own id --- So id of scenario is  "scenario" + ScenarioCounter----
  ScenarioCounter++;
  /*The Scenario and its attachments will be created in this function */
  CreatScenario(ScenarioCounter);
  /*Here, the scenario that was being worked on at the time of
   adding the new scenario is hidden,
   and the new scenario and its related items are activated and shown*/
  DeactivateAllExceptThisScenario(ScenarioCounter);
  inter_storage_array[ScenarioCounter] = new Array();
});

// -----------------------------------ScenarioHeadItemActive function--------------------------------------------------------------
function DeactivateAllExceptThisScenario(scenario_number) {
  /*Here the number of the last scenario that was being worked on is always kept so that
   when another scenario is pressed in the scenarios bar, the activation of the last scenario will be deactivated
   and its entire contents are hidden
   and the new scenario that was pressed in the scenarios bar
   will be activated and its contents are shown.*/

  if (last_scenario_active > 0 && last_scenario_active < ScenarioCounter + 1) {
    /* last_scenario_active < ScenarioCounter + 1
   Because when a scenario is deleted, the number of scenarios will be reduced by one
   */

    /*Deactivate "change color" it from the scenarios bar */
    /* "SzenarioHeadItem" + last_scenario_active : This is the Scenario head ID in the Scenario Bar */
    $("#SzenarioHeadItem" + last_scenario_active)[0].style.color = "#4b5af3";
    $("#scenarioParagraph" + last_scenario_active)[0].style.color = "#4b5af3";

    $("#SzenarioHeadItem" + last_scenario_active)[0].style.backgroundColor =
      "#e0e9fc";
    $("#tab__indicator" + last_scenario_active)[0].style.backgroundColor =
      "#fff";
    /*hide its contents */
    $("#scenario" + last_scenario_active).hide();
  }

  /*Activate "change color" the clicked scenario in the scenarios bar */
  $("#SzenarioHeadItem" + scenario_number)[0].style.color = "#e0e9fc";
  $("#scenarioParagraph" + scenario_number)[0].style.color = "#e0e9fc";
  $("#SzenarioHeadItem" + scenario_number)[0].style.backgroundColor = "#4b5af3";
  $("#tab__indicator" + scenario_number)[0].style.backgroundColor = "#4b5af3";
  /*show its contents */
  $("#scenario" + scenario_number).show();

  /*last_scenario_active initialization*/

  last_scenario_active = scenario_number;
}

//--------------------------------------Delete function-----------------------------------------------------------------------------
// this function deletes the last scenario when the delete button is pressed
let DeleteIcon = $(".DeleteIcon");
DeleteIcon.on("click", function () {
  if (ScenarioCounter > 0) {
    /*Confirm the deletion as popUp menu */
    swal({
      title: " Bist du sicher ?",
      text:
        "Dadurch werden das Szenario " +
        ScenarioCounter +
        " und seine Anhänge gelöscht ! ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      /*When the deletion is confirmed, the last scenario will be deleted*/
      if (willDelete) {
        /* delete the container of the scenario.
         ("#scenario" + ScenarioCounter) is id of scenario
         It consists of the word "scenario" and  the number of scenarios
          because this function only deletes the last scenario
        */
        temp = "#scenario" + ScenarioCounter;
        $(temp).remove();

        /*Here the scenario head will be  deleted from the scenarios bar */
        temp = "#tab__indicator_and_head_container" + ScenarioCounter;
        $(temp).remove();

        /*Decrease the number of scenarios by one, i.e. this global variable*/
        ScenarioCounter--;

        /*If the number of scenarios after deleting the last scenario is greater than zero,
        meaning that there are still scenarios present, at least one */
        if (ScenarioCounter > 0)
          /* Here the scenario preceding the deleted scenario is activated in the scenario bar*/
          DeactivateAllExceptThisScenario(ScenarioCounter);

        /*Here the deleted scenario number will be displayed ..
        . (ScenarioCounter + 1) : because (ScenarioCounter--)*/
        swal(" Szenario " + (ScenarioCounter + 1) + " wurde gelöscht !", {
          icon: "success",
        });
      } else {
        /*Here, if the user does not confirm the deletion of the last scenario, this message will be displayed */
        swal("Scenario  " + ScenarioCounter + " ist gesichert !");
      }
    });
  } else {
    /*Here if there is basically no scenario , this message will be displayed */
    swal({
      title: "🤕",
      text: "Es gibt kein Szenario zum Löschen ! ",
      icon: "error",
      buttons: true,
    });
  }
});

/*-------------------------------------------------------CreatScenario function--------------------------------------------------  */

function CreatScenario(scenario_number) {
  /*Clarification here:
 This container "tab__indicator_and_head_container" will be created for each scenario.
 It contains something similar to a button in which the name of the scenario is placed,
  for example, Scenario 1 and directly below it a thin strip of blue color "indicator".
   All these containers are placed in one horizontal scrollable bar. */

  const tab__indicator_and_head_container = document.createElement("div");

  //give the class name
  tab__indicator_and_head_container.className =
    "tab__indicator_and_head_container";
  //give the id , The ID consists of this name "tab__indicator_and_head_container" and scenario number
  tab__indicator_and_head_container.id =
    "tab__indicator_and_head_container" + scenario_number;

  //SzenarioHeadItem is head_container and tab__indicator is the  a thin strip
  tab__indicator_and_head_container.innerHTML = `
     <div class = "SzenarioHeadItem" id = "${
       "SzenarioHeadItem" + scenario_number
     }"><p class = "scenarioParagraph" id = "${
    "scenarioParagraph" + scenario_number
  }"> ${scenario_number + ".Szenario"}</p></div>
     <div class = "tab__indicator" id = "${
       "tab__indicator" + scenario_number
     }"></div>
    `;

  /*This container "SzenariosTap" is the one in which these containers "tab__indicator_and_head_container" are placed
   and, as mentioned, is scrollable
  It was created in the beginning of the program, see the start function above */
  $(".SzenariosTap")[0].appendChild(tab__indicator_and_head_container);

  const scenario_container = document.createElement("div");
  scenario_container.className = "SzenarioContainer";
  scenario_container.id = "scenario" + scenario_number;
  scenario_container.innerHTML = `
           <div class = "Arbeitsbereich" id = "${
             "workspace" + scenario_number
           }" >

               <div class = "progress" id = "${"progress" + scenario_number}">
                  <div class = "progress_bar"></div>
               </div>

               <main class = "main_full" id = "${
                 "main_full" + scenario_number
               }">

                  <div class = "panel" id = "${"panel" + scenario_number}">
                    <i class= "fas fa-cloud-upload-alt fa-4x"><br></i>

                    <div class = "button_outer" id = "${
                      "button_outer" + scenario_number
                    }">
                      <div class = "btn_upload">Browse File
                         <input type="file"  id = "${
                           "upload_file" + scenario_number
                         }" name = ""/>
                      </div>
                    </div>

                  </div>
                  <div class = "error_msg" id = "${
                    "error_msg" + scenario_number
                  }"></div>

               </main>

           </div>
          <button onclick="topFunction()" id="totopbuttonSzenario" title="Go to top"><i class="fas fa-angle-double-up"></i></button>
          <div class = "buttonsSzenarioContainer" id = "${
            "buttonsSzenarioContainer" + scenario_number
          }">
             <div class = "teil1">
                <button class = "BewertInteraktion" id = "${
                  "scenario" + scenario_number + "button1"
                }">Arbeitsbereich</button>
                <button class = "BewertInteraktion" id = "${
                  "scenario" + scenario_number + "button2"
                }">Einstellungsmenü</button>
              
             </div>
             <div class = "teil2">
               
             </div>
        
         </div>

  `;

  $(".SzenariosContainer")[0].appendChild(scenario_container);
  $("#workspace" + scenario_number).hide();
  $("#workspace" + scenario_number).show(500);
  $(".SzenariosTap").animate({ scrollLeft: 500 * ScenarioCounter }, 150);

  WatchPhotoUpload(ScenarioCounter);
  WatchTheButtons(ScenarioCounter);
  ClickOnScenario(ScenarioCounter);
}

//---------------------------------------- Create_uploaded_file_view  function-------------------------------------

function Create_uploaded_file_view(scenario_number, id_num) {
  const uploaded_file_view = document.createElement("div");
  uploaded_file_view.className = "uploaded_file_view";

  if (id_num > 0)
    uploaded_file_view.id = scenario_number + "-Buploaded_view" + id_num;
  else uploaded_file_view.id = scenario_number + "-Tuploaded_view" + id_num;

  const file_remove = document.createElement("span");
  file_remove.className = "file_remove";
  file_remove.id = "file_remove" + id_num;
  file_remove.textContent = "X";
  file_remove.title = "Löschen";

  uploaded_file_view.appendChild(file_remove);

  if (id_num > 0) {
    const div = document.createElement("div");
    div.className = "line";

    setTimeout(function () {
      uploaded_file_view.appendChild(div);
    }, 100);
  }
  $("#workspace" + scenario_number)[0].appendChild(uploaded_file_view);

  Watch_remove_button(
    file_remove.id,
    uploaded_file_view.id,
    id_num,
    scenario_number
  );
}

/*--------------------------------------------------function ClickOnScenario-------------------------------------------------------*/

function ClickOnScenario(scenario_number) {
  $("#SzenarioHeadItem" + scenario_number).on("click", function () {
    if (last_scenario_active != scenario_number) {
      SzenarioHeadItemChanged = true;
      $("#" + last_scenario_active + "canvas").hover(function () {
        $(this).css("cursor", "default");
      });
      DeactivateAllExceptThisScenario(scenario_number);
    }
  });
}
//---------------------------------------------------WatchPhotoUpload function----------------------------------------------------------

function WatchPhotoUpload(scenario_number) {
  var btnUpload = $("#upload_file" + scenario_number);
  var btnOuter = $("#button_outer" + scenario_number);
  var error_msg = "#error_msg" + scenario_number;
  var panel = "#panel" + scenario_number;
  var progress = "#progress" + scenario_number;
  var paragraph = "#paragraph" + scenario_number;

  btnUpload.on("change", function (e) {
    photo_id_num++; //positive
    Create_uploaded_file_view(scenario_number, photo_id_num); //function
    uploaded_view = "#" + scenario_number + "-Buploaded_view" + photo_id_num;

    let ext = btnUpload.val().split(".").pop().toLowerCase();
    if ($.inArray(ext, ["gif", "png", "jpg", "jpeg"]) == -1) {
      $(error_msg).text("Not an Image...");
      $(error_msg).show(600);
      setTimeout(function () {
        $(error_msg).hide(600);
      }, 1300);
    } else {
      $(error_msg).text("");
      var uploadedFile = URL.createObjectURL(e.target.files[0]);

      FileShow(
        uploaded_view,
        progress,
        panel,
        btnUpload,
        photo_id_num,
        uploadedFile,
        scenario_number
      );
    }
    btnUpload.val(null);
  });
}

//----------------------------------------FileShow  function-------------------------------------

function FileShow(
  uploaded_view,
  progress,
  panel,
  btnUpload,
  photo_id_num,
  uploadedFile,
  scenario_number
) {
  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  const convas_container = document.createElement("div");
  convas_container.className = "convas_container";
  const canvas = document.createElement("canvas");
  canvas.id = scenario_number + "canvas";
  canvas.width = 650;
  canvas.height = 400;
  let context = canvas.getContext("2d");

  context.font = "55px FontAwesome";
  context.fillRect(0, 0, canvas.width, canvas.height);
  convas_container.appendChild(canvas);
  context.fillStyle = "#DE1212";

  var background = new Image();
  background.src = uploadedFile;
  canvas_images_storage[last_scenario_active] = uploadedFile;
  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function () {
    check = false;
    WatchCanvas(context, canvas, check);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  };

  $(uploaded_view)[0].appendChild(canvas);
  /*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
  // $(uploaded_view)
  //   .append('<img src="' + uploadedFile + '" />')
  //   .fadeIn("slow");
  $(uploaded_view).fadeIn("slow");
  $(progress).hide(500);
  $(panel).show(600);

  $("#main_full" + scenario_number).hide(650);
  $("#progress" + scenario_number).hide(650);
}

//----------------------------------------Watch_remove_button  function-------------------------------------
function Watch_remove_button(
  file_remove,
  uploaded_file_view,
  id_num,
  scenario_number
) {
  $("#" + file_remove).on("click", function (e) {
    swal("Sind Sie sicher, dass Sie diesen Bereich löschen wollen ?", {
      buttons: ["cancel", true],
      icon: "warning",
    }).then(function (willDelete) {
      if (willDelete) {
        $("#" + uploaded_file_view).hide(500);
        setTimeout(function () {
          $("#" + uploaded_file_view).remove();
        }, 600);

        if (id_num > 0) {
          $("#main_full" + scenario_number).show(650);
          inter_storage_array[last_scenario_active] = [];
          altKat = "";
        }
        // $("#progress"+ScenarioCounter).show(650);
      }
    });
  });
}

//------------------------------------------WatchTheButtons function-------------------------------------

function ShowAnimate(id, container_id) {
  if ($(id).is(":visible")) $(id).hide(500);
  else if ($(id).is(":hidden")) {
    $(id).show(500);
  }
}
//---------------------------------------------------------------------------------------------
function WatchTheButtons(scenario_number) {
  let button_id = "#scenario" + scenario_number + "button";
  let container_id = "#tab__indicator_and_head_container" + scenario_number;
  $(button_id + 1).on("click", function () {
    ShowAnimate("#workspace" + scenario_number, container_id);
  });
  $(button_id + 2).on("click", function () {
    $("#open-popup-btn").click();
  });
}

/*------------------------------------------error message function----------------------------- */

function errorMessage(error_msg) {
  swal(error_msg, {
    icon: "error",
  });
}
/*--------------------------------------CreatTaxonomieStufe function---------------------------------------------------- */
function CreatTaxonomieStufe(scenario_number) {
  const div = document.createElement("div");
  div.className = "ContainerbereichTaxonomie";
  div.id = "ContainerbereichTaxonomie" + scenario_number;
  div.innerHTML = `
        <div class="bereichTax" id="${"bereich2" + scenario_number}"">

        <div class="TaxFoto" id="${
          scenario_number + "TaxFoto1"
        }" style=" background-image: url('/assets/Erinnern-D.png')"></div>
        <div class="TaxFoto" id="${
          scenario_number + "TaxFoto2"
        }" style=" background-image: url('/assets/Verstehen-D.png')"></div>
        <div class="TaxFoto" id="${
          scenario_number + "TaxFoto3"
        }" style=" background-image: url('/assets/Anwenden-D.png')"></div>
        <div class="TaxFoto" id="${
          scenario_number + "TaxFoto4"
        }" style=" background-image: url('/assets/Analysieren-D.png')"></div>
        <div class="TaxFoto" id="${
          scenario_number + "TaxFoto5"
        }" style=" background-image: url('/assets/Bewerten-D.png')"></div>
        <div class="TaxFoto" id="${
          scenario_number + "TaxFoto6"
        }" style=" background-image:url('/assets/Erschaffen-D.png')"></div>

        </div>
        `;

  $("#line2").before(div);
  last_url_and_id_info[taxonomie_file_view] = new Array();
  last_url_and_id_info[taxonomie_file_view][0] = "";
  last_url_and_id_info[taxonomie_file_view][1] = "";
  WatchTheButtonsOfTaxonomies(scenario_number);
}
/*---------------------WatchTheButtonsOfTaxonomies function-----------------------------------------------*/

function WatchTheButtonsOfTaxonomies(taxonomie_file_view_id) {
  let ids = taxonomie_file_view + "TaxFoto";
  $("[id^=" + ids + " ]").on("click", function () {
    if (
      (last_url_and_id_info[taxonomie_file_view_id][1] != "") &
      (last_url_and_id_info[taxonomie_file_view_id][1] != this.id)
    )
      $("#" + last_url_and_id_info[taxonomie_file_view_id][1]).css(
        "background-image",
        last_url_and_id_info[taxonomie_file_view_id][0]
      );

    let url = $(this).css("background-image");

    if (last_url_and_id_info[taxonomie_file_view_id][1] != this.id)
      last_url_and_id_info[taxonomie_file_view_id][0] = url;

    url = url.replace("-D", "");
    $(this).css("background-image", url);

    last_url_and_id_info[taxonomie_file_view_id][1] = this.id;

    if (taxonomie_file_view_id == 0) {
      haupt_taxonomie = last_url_and_id_info[0][1];
      haupt_taxonomie = haupt_taxonomie[haupt_taxonomie.length - 1];
      haupt_taxonomie = Number(haupt_taxonomie);

      MakePhotosInactive(taxonomie_file_view_id);
      MakePhotosActive(haupt_taxonomie);
      TaxonomiestufenBestimmen(haupt_taxonomie);
    }
  });
}
/*-----------------------------------MakePhotosInactive function-----------------------------------------------*/
function MakePhotosInactive(taxonomie_file_view_id) {
  for (let i = 1; i < 7; i++) {
    let url = $("#" + taxonomie_file_view_id + "TaxFoto" + i).css(
      "background-image"
    );

    let url_temp = url.substring(url.lastIndexOf("."), url.lastIndexOf('"'));

    if (!url.includes("-D")) {
      url = url.replace(url_temp, "-D" + url_temp);
    }

    $("#0TaxFoto" + i).css("background-image", url);
  }
}

/*-----------------------------------MakePhotosActive function-----------------------------------------------*/
function MakePhotosActive(position) {
  for (let i = 1; i <= position; i++) {
    let url = $("#0TaxFoto" + i).css("background-image");
    let url_temp = url.substring(url.lastIndexOf("."), url.lastIndexOf('"'));

    if (url.includes("-D")) {
      url = url.replace("-D", "");
    }

    $("#0TaxFoto" + i).css("background-image", url);
    if (i != 6) {
      $("#0TaxFoto" + i).hide();
      $("#0TaxFoto" + i).show(80 * i);
    }
  }
}

/*---------------------------------------------------------------------start get checkboxes from Einstellung----------------------------------------------------------------------*/

function getCheckboxesFromEinstellung(check_id, material_oder_inter, id_num) {
  if (alleCheckedInter[0].length > 0 && check_id == "inter-") {
    let global = document.createElement("h2");
    global.innerText = "Global";
    global.style.textAlign = "center";
    global.id = "katagorie_par";
    $("#InnerCheckbox0")[0].appendChild(global);

    addKatagorie(0, check_id, id_num, "Global");
  }
  if (alleCheckedInter[1].length > 0 && check_id == "inter-") {
    let H5P = document.createElement("h2");
    H5P.innerText = " H5P ";
    H5P.style.textAlign = "center";
    H5P.id = "katagorie_par";
    $("#InnerCheckbox0")[0].appendChild(H5P);
    addKatagorie(1, check_id, id_num, "H5P");
  }
  if (alleCheckedInter[2].length > 0 && check_id == "inter-") {
    let moodle = document.createElement("h2");
    moodle.innerText = " Moodle ";
    moodle.style.textAlign = "center";
    moodle.id = "katagorie_par";
    $("#InnerCheckbox0")[0].appendChild(moodle);
    addKatagorie(2, check_id, id_num, "Moodle");
  }
  if (alleCheckedInter[3].length > 0 && check_id == "inter-") {
    let ilias = document.createElement("h2");
    ilias.innerText = " Ilias ";
    ilias.style.textAlign = "center";
    ilias.id = "katagorie_par";
    $("#InnerCheckbox0")[0].appendChild(ilias);
    addKatagorie(3, check_id, id_num, "Ilias");
  }
  if (alleCheckedInter[4].length > 0 && check_id == "inter-") {
    let adobe = document.createElement("h2");
    adobe.innerText = " Adobe Captivate ";
    adobe.style.textAlign = "center";
    adobe.id = "katagorie_par";
    $("#InnerCheckbox0")[0].appendChild(adobe);
    addKatagorie(4, check_id, id_num, "Adobe Capativate");
  }
  if (alleCheckedInter[5].length > 0 && check_id == "inter-") {
    let vista = document.createElement("h2");
    vista.innerText = " 3D Vista ";
    vista.style.textAlign = "center";
    vista.id = "katagorie_par";
    $("#InnerCheckbox0")[0].appendChild(vista);
    addKatagorie(5, check_id, id_num, "3D Vista");
  }
  if (alleCheckedInter[6].length > 0 && check_id == "mat-") {
    $("#right_main").css("display", "block");
    let material = document.createElement("h2");
    material.innerText = " Materiale ";
    material.style.textAlign = "center";
    material.id = "katagorie_par";
    $("#right_main")[0].appendChild(material);

    addKatagorie(6, check_id, id_num, "Material");
  }
}

function addKatagorie(katagorieNum, checkId, idNum, interKat) {
  for (let i = 0; i < alleCheckedInter[katagorieNum].length; i++) {
    // let icon = document.createElement("icon");
    let label = document.createElement("label");
    let div_label_container = document.createElement("div");
    label.className = interKat;
    div_label_container.className = "label_container";

    let div_label_icon_container = document.createElement("div");
    div_label_icon_container.className = "div_label_icon_container";
    var check = alleCheckedInter[katagorieNum][i];
    // icon.id = idNum + "nach" + checkId + check.value;
    div_label_container.id = "nach" + idNum + checkId + label_left_id;

    label.innerText = check.value;
    div_label_container.appendChild(label);
    div_label_icon_container.appendChild(div_label_container);
    if (checkId != "mat-")
      $("#InnerCheckbox0")[0].appendChild(div_label_icon_container);
    else $("#right_main")[0].appendChild(div_label_icon_container);

    WhatchInteraktionenLeftfunktion(
      "#" + div_label_container.id,
      check.value,
      checkId,
      interKat
    );

    label_left_id++;
  }
}

/*--------------------------------------WhatchInteraktionenLeftfunktion------------------- */
function WhatchInteraktionenLeftfunktion(interId, value, CheckId, interKat) {
  $(interId).on("click", function () {
    let interExist = false;

    if (inter_storage_array[last_scenario_active] != undefined) {
      for (
        let i = 0;
        i < inter_storage_array[last_scenario_active].length;
        i++
      ) {
        if (inter_storage_array[last_scenario_active][i] != undefined) {
          if (inter_storage_array[last_scenario_active][i][0] == value)
            interExist = true;
        }
      }
    }

    if (ScenarioCounter <= 0)
      errorMessage(
        "Addieren Sie bitte ein Szenario und Laden Sie ein Bild im Arbeitsbereich !"
      );
    else if ($("#main_full" + last_scenario_active).is(":visible"))
      errorMessage("Laden Sie bitte ein Bild im Arbeitsbereich !");
    else if ($("#workspace" + last_scenario_active).is(":hidden"))
      errorMessage("Öffnen Sie bitte den Arbeitsbereich !");
    else if (
      inter_storage_array[last_scenario_active] != undefined &&
      interExist
    )
      errorMessage(
        value + " " + " Interaktion ist in diesem Szenario schon existiert !"
      );
    else {
      const div = document.createElement("div");
      div.className = "IconLabel";
      div.id = "IconLabel" + icon_id;

      div.innerHTML = `
            <input type='color' name='color' class = "InnerColor" value='#DE1212' id = "${
              "InnerColor" + icon_id
            }" />
            <div class = "InnerLabel">${
              value + " " + "( " + interKat + " )"
            }</div>

            <select class = "selectInteraktion" id = id = "${
              "selectInteraktion" + icon_id
            }"
            >
            <option id ="${
              "optTax" + icon_id
            }" value = "" selected = "selected" disabled = "disabled">Taxonomiestufen</option>
            <option id="${"option0" + icon_id}" value = 1>Erinnern</option>
            <option id="${"option1" + icon_id}" value = 2>Verstehen</option>
            <option id="${"option2" + icon_id}" value = 3>Anwenden</option>
            <option id="${"option3" + icon_id}" value = 4>Analysieren</option>
            <option id="${"option4" + icon_id}" value = 5>Berwerten</option>
            <option id="${"option5" + icon_id}" value = 6>Erschaffen</option>
            </select>

             

            <button class = "BewertInteraktion" id = id = "${
              "selectBewertungsmodus" + icon_id
            }"
            >
            Bewertungsmodus
            </button>
            <i class="fas fa-undo-alt fa-1x InnerDelete" title="Pin Zurücksetzen" id = "${
              "UDelete" + icon_id
            }"></i>
            <i class="far fa-times-circle fa-1x InnerDelete" title="Pin löschen" id = "${
              "BDelete" + icon_id
            }"></i>
           `;

      let ids = last_scenario_active + "-Buploaded_view";

      $("[id^=" + ids + " ]")[0].appendChild(div);
      $("#IconLabel" + icon_id).hide();
      $("#IconLabel" + icon_id).show(500);
      WatchInnerColor("InnerColor" + icon_id, icon_id);
      WatchBDelete("BDelete", icon_id);
      WatchUDelete("UDelete", icon_id);

      $("#InnerColor" + icon_id).change();
      pinColor = "#DE1212";
      inter_storage_array[last_scenario_active][icon_id] = [value, []];

      for (let i = haupt_taxonomie; i < 6; i++)
        $("#option" + i + icon_id).hide();

      icon_id++;

      $("#" + last_scenario_active + "canvas").hover(function () {
        $(this).css("cursor", "url('/assets/pin2.png'),auto");
      });
    }
  });
}

/*---------------------------------TaxonomiestufenBestimmen function----------------------------------- */
function TaxonomiestufenBestimmen(haupt_tax) {
  for (let i = 0; i < icon_id; i++) {
    for (let k = 0; k < 6; k++) $("#option" + k + i).hide();

    for (let j = 0; j < haupt_tax; j++) {
      $("#option" + j + i).show();
      $("#option" + j + i).removeAttr("selected");
    }
  }
}
/*---------------------------------TaxonomiestufenBestimmen function----------------------------------- */
/*--------------------------------------WhatchInnerColor function------------------- */
function WatchInnerColor(InnerColor, ic_Id) {
  $("#" + InnerColor).on("change", function () {
    // console.log(inter_storage_array[last_scenario_active][ic_Id]);
    pinColor = $(this).val();
    positionIcon = ic_Id;

    SzenarioHeadItemChanged = false;
    $("#" + last_scenario_active + "canvas").hover(function () {
      $(this).css("cursor", "url('/assets/pin2.png'),auto");
    });

    ChangPinsColor(pinColor, ic_Id);
  });
  $("#" + InnerColor).on("click", function () {
    SzenarioHeadItemChanged = false;
    positionIcon = ic_Id;

    pinColor = $(this).val();
    ChangPinsColor(pinColor, ic_Id);
    $("#" + last_scenario_active + "canvas").hover(function () {
      $(this).css("cursor", "url('/assets/pin2.png'),auto");
    });
  });
}

/*+++++++++++++++++++++++++++++++++++function ChangPinsColor ++++++++++++++++++++++++++++++++++++++++++++ */

function ChangPinsColor(pin_color, ic_id) {
  if (inter_storage_array[last_scenario_active][ic_id] != undefined) {
    for (
      let i = 0;
      i < inter_storage_array[last_scenario_active][ic_id][1].length;
      i++
    )
      inter_storage_array[last_scenario_active][ic_id][1][i][2] = pin_color;
  }

  ReLoeadPhoto(ic_id, "changeColor");
}
/*+++++++++++++++++++++++++++++++++++function WatchMenuBtn ++++++++++++++++++++++++++++++++++++++++++++ */
let url_icon = 0;
function WatchMenuBtn() {
  $("#UrlBtn").on("click", function () {
    if (EverythingIsOkay()) {
      const div = document.createElement("div");
      div.className = "UrlForMaterial";
      div.id = "UrlForMaterial" + url_icon;
      div.innerHTML = `
    <div class = "label">URL:</div>
    <div class = "urlInter">
    <input class = "url" type="text" name="url" id="${
      "inputurl" + url_icon
    }" placeholder="https://example.com">
    
    <i class="fas fa-undo-alt fa-1x InnerDelete" title="Zurücksetzen" id = "${
      "Undo" + url_icon
    }"></i>
    <i class="far fa-times-circle fa-1x InnerDelete" title="löschen" id = "${
      "Delete" + url_icon
    }"></i>
  
    </div>`;
      let ids = last_scenario_active + "-Buploaded_view";
      $("[id^=" + ids + " ]")[0].appendChild(div);

      WatchTextDelete(url_icon, "url");
      WatchTextUndo(url_icon, "url");
      $("#UrlForMaterial" + url_icon).hide();
      $("#UrlForMaterial" + url_icon).show(500);
      url_icon++;
    }
  });
  $("#FragstammBtn").on("click", function () {
    if (EverythingIsOkay()) CreatTextEditor("Fragstamm", "Interaktion");
  });
  $("#TextBtn").on("click", function () {
    if (EverythingIsOkay()) CreatTextEditor("Text", "Interaktion");
  });
  $("#NotizenBtn").on("click", function () {
    if (EverythingIsOkay()) CreatTextEditor("Notizen", "Interaktion");
  });
}
/*+++++++++++++++++++++++++++++++++++function WatchUrlDelete  , function  WatchUrlUndo , function CreatFragstammBtn  ++++++++++++++++++++++++++++++++++++++++++++ */

function WatchTextDelete(id) {
  $("#Delete" + id).on("click", function () {
    $("#UrlForMaterial" + id).hide(500);
    setTimeout(function () {
      $("#UrlForMaterial" + id).remove();
    }, 500);
  });
}
/*---------------------------------------------------------------- */
function WatchTextUndo(id, text) {
  $("#Undo" + id).on("click", function () {
    if (text == "Editor") tinymce.get("fragstamm" + id).setContent("");
    else $("#inputurl" + id).val("");
  });
}
/*---------------------------------------------------------------- */
let textEditor = -1;
function CreatTextEditor(label, positionOfText) {
  const div = document.createElement("div");
  div.className = "UrlForMaterial";
  div.id = "UrlForMaterial" + textEditor;
  div.innerHTML = `
  
  <div class = "label">${label}:</div>
  <div class = "urlInter">
   <textarea class = "url" id = "${"fragstamm" + textEditor}"></textarea>
   <i class="fas fa-undo-alt fa-1x InnerDelete" title="Pin Zurücksetzen" id = "${
     "Undo" + textEditor
   }"></i>
  <i class="far fa-times-circle fa-1x InnerDelete" title="Pin löschen" id = "${
    "Delete" + textEditor
  }"></i>
  </div>
  `;

  if (positionOfText == "Interaktion") {
    let ids = last_scenario_active + "-Buploaded_view";
    $("[id^=" + ids + " ]")[0].appendChild(div);
  }

  if (positionOfText == "Arbeitsbereich") {
    $("#workspace" + last_scenario_active)[0].appendChild(div);
  }

  WatchTextDelete(textEditor, "Editor");
  WatchTextUndo(textEditor, "Editor");
  set_tinymce_selector_for_editor("#fragstamm" + textEditor);

    $("#UrlForMaterial" + textEditor).hide();
    $("#UrlForMaterial" + textEditor).show(500);
 

  textEditor--;
}
/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
function EverythingIsOkay() {
  let ok = false;
  if (ScenarioCounter <= 0)
    errorMessage(
      "Addieren Sie bitte ein Szenario und Laden Sie ein Bild im Arbeitsbereich !"
    );
  else if ($("#main_full" + last_scenario_active).is(":visible"))
    errorMessage("Laden Sie bitte ein Bild im Arbeitsbereich !");
  else if ($("#workspace" + last_scenario_active).is(":hidden"))
    errorMessage("Öffnen Sie bitte den Arbeitsbereich !");
  else ok = true;

  return ok;
}
/*+++++++++++++++++++++++++++++++++++function WatchUrlDelete, function WatchUrUndo ++++++++++++++++++++++++++++++++++++++++++++ */

/*++++++++++++++++++++++++++++++++++++++function WhatchBDelete++++++++++++++++++++++++++++++++++++++ */
function WatchBDelete(BDelete_id, ic_id) {
  $("#" + BDelete_id + ic_id).on("click", function () {
    $("#IconLabel" + ic_id).hide(500);
    setTimeout(function () {
      $("#IconLabel" + ic_id).remove();
    }, 500);

    SzenarioHeadItemChanged = true;
    ReLoeadPhoto(ic_id, "delete");

    $("#" + last_scenario_active + "canvas").hover(function () {
      $(this).css("cursor", "default");
    });
  });
}
/*++++++++++++++++++++++++++++++++++++++function WhatchBDelete++++++++++++++++++++++++++++++++++++++ */
/*++++++++++++++++++++++++++++++++++++++function WhatchUDelete++++++++++++++++++++++++++++++++++++++ */
function WatchUDelete(UDelete_id, ic_id) {
  $("#" + UDelete_id + ic_id).on("click", function () {
    ReLoeadPhoto(ic_id, "undo");
  });
}
/*++++++++++++++++++++++++++++++++++++++function WhatchUDelete++++++++++++++++++++++++++++++++++++++ */
/*++++++++++++++++++++++++++++++++++++++function ReLoeadPhoto++++++++++++++++++++++++++++++++++++++ */
function ReLoeadPhoto(ic_id, choice) {
  let x, y;
  var background = new Image();
  background.src = canvas_images_storage[last_scenario_active];
  const canvas = document.getElementById(last_scenario_active + "canvas");
  const context = canvas.getContext("2d");
  context.font = "55px FontAwesome";
  background.onload = function () {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  };

  if (choice == "delete")
    inter_storage_array[last_scenario_active][ic_id] = ["", []];

  if (choice == "undo")
    inter_storage_array[last_scenario_active][ic_id][1].pop();

  setTimeout(function () {
    for (let i = 0; i < icon_id; i++) {
      if (inter_storage_array[last_scenario_active][i] != undefined) {
        for (
          let j = 0;
          j < inter_storage_array[last_scenario_active][i][1].length;
          j++
        ) {
          context.fillStyle =
            inter_storage_array[last_scenario_active][i][1][j][2];
          x = inter_storage_array[last_scenario_active][i][1][j][0];
          y = inter_storage_array[last_scenario_active][i][1][j][1];
          context.fillText("\uf041", x, y);
        }
      }
    }
  }, 150);
}

/*++++++++++++++++++++++++++++++++++++++function ReLoeadPhoto++++++++++++++++++++++++++++++++++++++ */
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
function WatchCanvas(context, canvas, check) {
  if (!check) {
    context.fillText("\uf3c5", -2300000, -2300000);
    check = true;
  }

  $(canvas).on("click", function (Event) {
    if (
      inter_storage_array[last_scenario_active].length > 0 &&
      !SzenarioHeadItemChanged
    ) {
      let x, y;
      var rect = canvas.getBoundingClientRect();
      x = Event.clientX - rect.left;
      y = Event.clientY - rect.top;
      context.fillStyle = pinColor;
      context.fillText("\uf041", x - 2, y + 13);

      pin_storage_array = [];
      pin_storage_array[0] = x - 2;
      pin_storage_array[1] = y + 13;
      pin_storage_array[2] = pinColor;

      if (positionIcon != undefined) {
        inter_storage_array[last_scenario_active][positionIcon][1].push(
          pin_storage_array
        );
      }
    } else {
      errorMessage("Whälen Sie Bitte eine Farbe von Interaktionen !");
    }
  });
}
/*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

/*-----------------------------------------------PinOnPhoto function -------------------------------------------------------------------------------*/

/*-----------------------------------------------PinOnPhoto function -------------------------------------------------------------------------------*/
/*-------------------------------------------------end get checkboxes from Einstellung----------------------------------------------------------------------*/

function getContentOfEditors() {
  var inst,
    contents = new Array();
  for (inst in tinyMCE.editors) {
    if (tinyMCE.editors[inst].getContent)
      contents[inst] = tinyMCE.editors[inst].getContent();
  }
}
/------------------------------------------------------------------------Start Einstellung----------------------------------------------------------------------/;

// Abrufen der Einstellungsknopf mit ihrer ID
document
  .getElementById("open-popup-btn")
  // Funktion zum
  .addEventListener("click", function () {
    // 1. Reduzieren der Hintergrundtransparenz
    document.getElementById("backgroundPage").style.opacity = "0.5";
    // 2. Aktivieren des Popup-Div
    document.getElementsByClassName("tabs")[0].classList.add("active");
    // um erste element des Headers zu aktivieren
    tabHeaderChildren[1].click();

    interButton.click();
    // Ausblenden von Materialliste aus den sechs Listen aus
    materialHeader.style.display = "none";
  });

// Abrufen der bestätigungsknopf von der einstellungsmenu popup mit ihrer ID



document
  .getElementById("dismiss-popup-btn")
  // Funktion zum
  .addEventListener("click", function () {
    let interChoosed = false;
    // Ein Array zum Speichern aller aus der Liste ausgewählten Elemente (Interaktionen/Materiale)
    alleCheckedInter = new Array();
    for (var i = 0; i < 7; i++) {
      var checked = ul[i].querySelectorAll("input[type=checkbox]:checked");
      alleCheckedInter.push(checked);
      if (alleCheckedInter[i].length > 0) {
        choosed = true;
        if (i < 6) interChoosed = true;
      }
    }

    // 1. Wiederherstellen der Hintergrundtransparenz auf Normalzustand zurück
    document.getElementById("backgroundPage").style.opacity = "1";
    // 2. deaktivieren des Popup-Div
    document.getElementsByClassName("tabs")[0].classList.remove("active");

    $(".left_main_container").empty();
    $(".right_main_container").empty();
    if (choosed) {
      label_left_id = 0;
      const div_boxes_container = document.createElement("div");
      div_boxes_container.className = "CheckedInterList";

      div_boxes_container.id = "CheckedInterList0";

      const div_boxes = document.createElement("div");
      div_boxes.className = "InnerCheckbox";
      div_boxes.id = "InnerCheckbox0";

      div_boxes.style.width = "100%";
      div_boxes.style.height = "100%";
      $(".left_main_container")[0].appendChild(div_boxes_container);
      if (!interChoosed) $("#CheckedInterList0").hide();
      else $("#CheckedInterList0").show();
      $("#CheckedInterList0")[0].appendChild(div_boxes);
      getCheckboxesFromEinstellung("inter-", "Interaktionen", 0);
      if (alleCheckedInter[6].length > 0) {
        $("#right_main").show();
        getCheckboxesFromEinstellung("mat-", "Materiale", 1);
      } else $("#right_main").hide();
    }
  });

let alleCheckedInter = new Array();

// Eine Variable, die das erste Element (globale) des Listenkopfes enthält
let tabHeader = document.getElementsByClassName("tab__header")[0];

// Eine Variable, die die Position der blauen Linie unter dem ersten Element (globale) enthält
let tabIndicator = document.getElementsByClassName("tab__indicator1")[0];

// Eine Variable, die das übergeordnete Div enthält, das den gesamten Inhalt des Materials und der Interaktionen enthält
let tabBody = document.getElementsByClassName("tab__body")[0];
let mainDiv = document.getElementById("containerDiv");

// Eine Variable, die die Position der blauen Linie unter dem ersten Element (Material) enthält
let materialHeaderIndic = document.getElementsByClassName(
  "tab__indicatorMaterial"
);

// Abrufen der Materialsknopf mit ihrer ID und in MaterialButton Variabel speichern
let materialButton = document.getElementById("material");

// Abrufen der Interaktionensknopf mit ihrer ID und in MaterialButton Variabel speichern
let interButton = document.getElementById("interaktion");

// Abrufen alle seitlichen Tasten Container mit ihrer ID und in tabsContainer Variabel speichern
let tabsContainer = document.getElementById("tabs_container_id");

// tabsPane variabel enthält alle divs (icons) die im header des Einstellunsmenu
// wird später verwendet, um das gedrückte Element des Headers zu identifizieren
let tabsPane = tabHeader.getElementsByTagName("div");

// enthält die Interaktionen/Materialen listen des aktuelle gedrückte Element des Headers
let ul = tabBody.getElementsByTagName("ul");

// enthält Elemente die im Header sind
let tabHeaderChildren = document.getElementById("tab__headerId").childNodes;

materialButton.addEventListener("click", function () {
  tabHeaderChildren[13].click();
  let j = 1;
  for (let i = 0; i < 6; i++) {
    ul[i].style.display = "none";
    tabHeaderChildren[j].style.display = "none";
    j += 2;
  }

  tabIndicator.style.display = "none";
  materialHeader.style.display = "";
  tabHeader.getElementsByClassName("active")[0].classList.remove("active");
  tabsPane[6].classList.add("active");

  containerDivLists[9].style.display = "";

  for (let i = 0; i < tabsPane.length - 1; i++) {
    for (let j = 0; j < containerDivLists.length - 3; j++) {
      if (j != i) containerDivLists[j + 3].style.display = "none";
      else {
        containerDivLists[j + 3].style.display = "block";
        // mainDiv.style.transition = "ease-in-out";
        userPane = containerDivLists[j + 3];
      }
    }
    // console.log(tabsPane);
    // tabBody.getElementsByClassName("active")[0].classList.remove("active");

    // tabBody.getElementsByTagName("div")[i].classList.add("active");

    // tabIndicator.style.left = `calc( calc(100%/6) * (${i})`;
  }
});

interButton.addEventListener("click", function () {
  tabHeader.getElementsByClassName("active")[0].classList.remove("active");
  tabsPane[1].classList.add("active");
  userPane = containerDivLists[1];
  tabHeaderChildren[1].click();
  let j = 1;
  for (let i = 0; i < 6; i++) {
    userPane.style.display = "block";
    tabHeaderChildren[j].style.display = "";
    j += 2;
  }
  tabHeaderChildren[13].style.display = "none";
  containerDivLists[9].style.display = "none";
  tabHeader.style.display = "";
  tabIndicator.style.display = "";
});

// Hier ist die Definition von Matrizen, die alle Interaktionen und Materialien enthalten

var globalInter = [
  "Freie Auswahl",
  "Freies Zeichenfeld",
  "Embedded",
  "Feedback",
  "Chat",
  "Videokonferenz",
  "Download",
  "Drag-and-Drop auf Bild",
  "Drag-and-Drop-Markierungen",
  "Drag-and-Drop auf Text",
  "Einfach berechnet",
  "Berechnete",
  "Multiple - Choice",
  "Beschreibung",
  "Freitext",
  "Lückentext",
  "Lückentextauswahl",
  "Multiple-Choice",
  "Kurzantwort",
  "Numerisch",
  "Wahr/Falsch",
  "Zuordnung",
  "Zufällige",
  "Kurzantwortzuordnung",
  "Timeline",
  "VR-Brille",
];

var H5PInter = [
  "Interactive Book",
  "Twitter User Feed",
  "Crossword",
  "Greeting Card",
  "Image Choice",
  "Find the words",
  "Virtual Tour (360)",
  "Branching Scenario",
  "Dictation",
  "Image Pairing",
  "Essay",
  "Image Slider",
  "Speak the Words Set",
  "Flashcards",
  "Image Sequencing",
  "Agamotto (Image Blender)",
  "Speak the Words",
  "Audio",
  "Image Hotspots",
  "True/False Question",
  "Timeline",
  "Summary",
  "Single Choice Set",
  "Find Multiple Hotspots",
  "Quiz (Question Set)",
  "Multiple Choice",
  "Mark the Words",
  "Interactive Video",
  "iframe Embedder",
  "Find the Hotspot",
  "Fill in the Blanks",
  "Memory Game",
  "Drag and Drop",
  "Documentation Tool",
  "Dialog Cards",
  "Course Presentation",
  "Drag the Words",
  "Column",
  "Collage",
  "Chart",
  "Arithmetic Quiz",
  "Accordion",
];

var moodlelInter = [
  "Multiple-Choice-Fragen",
  "Wahr/Falsch-Fragen",
  "Kurzantwort-Fragen",
  "Zuordnungsfragen",
  "Fehlende Wörter",
  "Numerische Fragen",
  "Berechnete Multiple Choice-Frage",
  "Einfach berechnete Frage",
  "Drag & Drop-Aufgaben",
  "Freitext",
  "Lückentexte",
  "Wahr/Falsch-Frage",
  "Beschreibung",
  "Aufgabe",
  "Gegenseitige Beurteilung",
  "Chat",
  "Glossar",
  "Wiki",
  "Forum",
  "Feedback",
  "Gesamt-Feedback",
  "Allgemeines Feedback",
  "Spezifisches",
  "Feedback",
  "Kombiniertes Feedback",
  "Hinweisendes Feedback",
  "Selbsteinschätzung",
];

var iliaslInter = [
  "Begriffe benennen",
  "Mutiple-Choice-Fragen",
  "Single Choice",
  "Lückentexte",
  "Formelfrage",
  "Hotspot/Image-Map",
  "Freitext",
];

var adobelInter = [
  "Accordion",
  "Tabs",
  "Prosess Circle",
  "Pyramid Stack",
  "Timeline",
  "Circle Matrix",
  "Pyramid Matrix",
  "Zertifikat",
  "Glossary",
  "Image Zoom",
  "Word Search",
  "Bookmark",
  "Bulletin",
  "Carousel",
  "Catch AlphaNum",
  "Checkbox Widget",
  "Timer",
  "Drop Down",
  "Hangman",
  "List",
  "Hourglass",
  "Notes",
  "Scrolling Text",
  "YouTube",
];

var vistaInter = [
  "Album öffen",
  "Video",
  "360° Video",
  "Floorplan öffnen",
  "Popup Video",
  "Popup Medium",
  "Info Fenster",
  "Popup PDF",
  "Popup Web Frame",
  "Audio",
  "Komponenten anzeigen / Verstecken",
  "Hotspot anzeigen/verstecken",
  "Hotspot",
  "Teilen auf Soziale Netzwerke",
  "Medien Steuerung",
  "List Control",
  "Sprache ändern",
  "Datei herunterladen",
  "Take Screenshot",
  "Zum Score zählen",
  "Questiom Card",
  "Report anzeigen",
  "Timeout anzeigen",
  "MC Frage",
  "SC Frage",
  "Punktevergabe",
];

var materialArr = [
  "Code",
  "SVG",
  "Bild",
  "Tabelle",
  "Link",
  "Audio",
  "Video",
  "360° Bild",
  "3D Objekt",
  "360° Video",
  "Animationen",
  "Avatar",
  "Floorplan",
  "Applikation",
  "Embedded",
];

// Diese Funktion erhält als ersten Parameter die Matrix,
// die Interaktionen bzw. Materials enthält
// und generiert die Elemente (list items , input(checkbox) , label)
//  um sie später in den zweiten Parameter (ihre zugehörige Liste) zu stellen
function listsProducer(interMatArray, uli, inputIdd) {
  interMatArray.forEach(function (e) {
    var li = document.createElement("li");
    var input = document.createElement("input");
    var label = document.createElement("label");
    input.type = "checkbox";
    input.value = e;
    input.id = inputIdd + e;
    input.class = "regular-checkbox";
    label.innerText = e;
    li.appendChild(input);
    li.appendChild(label);
    uli.appendChild(li);
  });
}

// 1. erste ungeordnete liste, die die (globale) Interaktionen
var ul0 = document.createElement("ul");

// alle im globalen Array enthaltenen Interaktion in ihre zugehörige
// ungeordnete list hinzufügen
listsProducer(globalInter, ul0, "inter-");

// Füge die von der Funktion generierte Liste in ihr
// eigenes div zusammen
mainDiv.appendChild(ul0);

// gleiche logik bis zeile 372
var ul1 = document.createElement("ul");

listsProducer(H5PInter, ul1, "inter-");

mainDiv.appendChild(ul1);

var ul2 = document.createElement("ul");

listsProducer(moodlelInter, ul2, "inter-");

mainDiv.appendChild(ul2);

var ul3 = document.createElement("ul");

listsProducer(iliaslInter, ul3, "inter-");

mainDiv.appendChild(ul3);

var ul4 = document.createElement("ul");

listsProducer(adobelInter, ul4, "inter-");

mainDiv.appendChild(ul4);

var ul5 = document.createElement("ul");

listsProducer(vistaInter, ul5, "inter-");

mainDiv.appendChild(ul5);

var ul6 = document.createElement("ul");
ul6.id = "mat-";

listsProducer(materialArr, ul6, "mat-");

mainDiv.appendChild(ul6);

// c Array will get all the elements that contained in the container
// div to controle the apperance of based on whos active from them
var containerDivLists = document.getElementById("containerDiv").childNodes;

/* Ausblenden von den gesamten Inhalt (Interaktionen/materialen) des mainDiv,
um anzuzeigen, was der Benutzer später aus der Header (katagorien) auswählen wird (zeile 408)*/
for (let i = 0; i < containerDivLists.length; i++) {
  /* the first three childs of the c Array will always be (text , comment ,
 text) , because of this we've chosen (i>3)*/
  if (i > 3) {
    // hide the lists from the main and only div (.mainDiv or #containerDiv)
    containerDivLists[i].style.display = "none";
  }
}

//--- appending the right body to the active header begin --//
let userPane = document.getElementsByTagName("ul")[0];
let addButton = document.getElementById("addButton");
let eyeButton = document.getElementById("eyeButton");
let selecAll = document.getElementById("selectAllBtn");
let deleteButton = document.getElementById("deleteBtn");
let undoButton = document.getElementById("undoBtn");
let inputFeld = document.getElementById("inputFeldContainer");
let submitFeld = document.getElementById("submitBtnContainer");
let iconsContainer = document.getElementById("iconsCotainer");
let selectAll = document.getElementById("selectAllBtn");
// this array will save all the deleted Interactions/materials
// will used when new Interactions/materials about to submit (to avoid duplicates)
let deletedInterArr = [];
let letztePanePos = 0;
//  let selectedAllHeaderPos = [];

/* diese for schleife ist verantwortlich für die Überwachung der
Benuzterbewegung in Bezug auf das Header (.tab_header or #tab_headerId)
inhalt (Interaktionen/Materiale katagorien) */
for (let i = 0; i < tabsPane.length - 1; i++) {
  tabsPane[i].addEventListener("click", function () {
    /* deaktivieren des Aktuellen tap im Header (.tab__header or
      #tab__headerId)*/
    tabHeader.getElementsByClassName("active")[0].classList.remove("active");
    // aktivieren das neue tap im Header (.tab_header or #tab_headerId)
    tabsPane[i].classList.add("active");

    // checking if the eye icon was pressed in the current list

    if (eyePressedHistoryArr[i]) {
      // setting the slashed instead
      eyeButton.classList.remove("fas");
      eyeButton.classList.remove("fa-eye");
      eyeButton.classList.add("fas");
      eyeButton.classList.add("fa-eye-slash");
      eyeButton.classList.add("fa-lg");
      eyeGedrückt = false;
    } else if (!eyeGedrückt) {
      // if the eye icon is not pressed setting the normal eye instead
      eyeButton.classList.remove("fas");
      eyeButton.classList.remove("fa-eye-slash");
      eyeButton.classList.add("fas");
      eyeButton.classList.add("fa-eye");
      eyeButton.classList.add("fa-lg");

      eyeGedrückt = true;
    }
    // same logic for select all function
    if (selectAllPressedHistoryArr[i]) {
      selectAll.classList.remove("fas");
      selectAll.classList.remove("fa-check-double");
      selectAll.classList.add("fas");
      selectAll.classList.add("fa-check");
      selectAll.classList.add("fa-lg");
      allSelected = false;
    } else if (!allSelected) {
      selectAll.classList.remove("fas");
      selectAll.classList.remove("fa-check");
      selectAll.classList.add("fas");
      selectAll.classList.add("fa-check-double");
      selectAll.classList.add("fa-lg");

      allSelected = true;
    }

    /* Um den Inhalt des richtigen divs bzw. der richtigen Kategori
    anzuzeigen in der einzige haupt div (.mainDiv or #containerDiv) und den
    Rest auszublenden,wir haben mit der Nummer drei begonnen, da das Array c
    9 Elemente enthäl (oben ausführlich erlätert Z:381) und unsere
    gewünschten Listen ab der Zählung drei beginnen*/
    for (let j = 0; j < containerDivLists.length - 3; j++) {
      if (j != i) containerDivLists[j + 3].style.display = "none";
      else {
        containerDivLists[j + 3].style.display = "block";
        /* variabel um den aktuellen list zuspeichern, wird in der neu
       Interaktion/material hinzufügen Funktion benutzt um die neu
       Interaktion/material in der richtige list zu pushen*/
        userPane = containerDivLists[j + 3];
      }
    }
    // to save the last viewed list
    letztePanePos = i;

    // der kategorien unterliene unter die richtige kategorie setzen
    tabIndicator.style.left = `calc( calc(100%/6) * (${i})`;
  });
}

//--- appending the right body to the active header end ---//
//--- add Interaktion Button in action begin ---//
let plusGedrückt = true;
let notRepeated = true;
// let isDeleted = false;
/*
 this function will listen to the eye icon .. and once it's clicked
 the class names of the icons will change therewith the icon will changed
 to s bold square plus.
 */
addButton.addEventListener("click", function () {
  if (plusGedrückt) {
    addButton.classList.remove("fas");
    addButton.classList.remove("fa-plus");
    addButton.classList.add("fas");
    addButton.classList.add("fa-plus-square");
    addButton.classList.add("fa-lg");
    inputFeld.style.display = "flex";
    submitFeld.style.display = "flex";
    iconsContainer.style.width = "56%";

    /* here a new elements are created (input feld (for the new Interaktions/
  Material), submit icon)*/
    let input = document.createElement("input");
    input.id = "inputId";
    input.type = "text";
    let add = document.createElement("icon");
    add.id = "sumbitBtnId";
    add.className = "fas fa-check toolsBtn";
    inputFeld.appendChild(input);
    submitFeld.appendChild(add);

    /*submit button will apply the new input to the the right list (the active
    one)*/
    let submitAdd = document.getElementById("sumbitBtnId");
    submitAdd.addEventListener("click", function () {
      /creating new list item ,input feld ,label/;
      let inputid = document.getElementById("inputId");
      var li = document.createElement("li");
      var input = document.createElement("input");
      var label = document.createElement("label");

      /* the while-loop will loop all the lists and the for-loop will
 loop all the elements inside each list and make sure that there
 are no duplicates with the new insterted Interakction/material
 (if repeated pop-up will show up
  Z 519)*/
      let i = 0;
      while (i < ul.length) {
        let labelPane = ul[i].querySelectorAll("label");
        for (let j = 0; j < labelPane.length; j++) {
          if (labelPane[j].innerText === inputid.value) {
            notRepeated = false;
          }
        }
        i++;
      }

      /* if the new insterted Interakction/material is not repeated,
  new the new input feld will take the value of the inserted one
  and (mat- or inter- ) will be attached in the begenninng to make it
  easier to distinct between them after submitting  */
      if (notRepeated && inputid.value != "") {
        input.type = "checkbox";

        input.value = inputid.value;
        if (userPane.id === "mat-") input.id = "mat-" + inputid.value;
        else input.id = "inter-" + inputid.value;
        input.class = "regular-checkbox";
        label.innerText = inputid.value;
        li.appendChild(input);
        li.appendChild(label);
        // appending the right child to right the father (the active div of the hidden
        // ones)
        userPane.append(li);
        // isDeleted = false;
      }
      //to make sure that the new inserted interaction is not empty
      else if (inputid.value == "") {
        swal("Interaktion ist nicht defeniert !", " ", "error");
      } else {
        // alert if it's repeated
        swal(
          `${inputid.value}` + " Interaktion ist wiederholt !,",
          "Wenn Sie diese Interaktion gelöscht haben bitte auf 'zurückstzen' drücken ! ",
          "error"
        );
        notRepeated = true;
      }
    });
    plusGedrückt = false;
  } else {
    /returning everything to befor if the add button pressed again/;
    let inputid = document.getElementById("inputId");
    let btnid = document.getElementById("sumbitBtnId");
    iconsContainer.style.width = "53%";
    iconsContainer.style.justifyContent = "space-evenly";
    inputFeld.style.display = "none";
    submitFeld.style.display = "none";
    addButton.classList.remove("fas");
    addButton.classList.remove("fa-plus-square");
    addButton.classList.add("fas");
    addButton.classList.add("fa-plus");
    addButton.classList.add("fa-lg");
    inputFeld.removeChild(inputid);
    submitFeld.removeChild(btnid);
    plusGedrückt = true;
  }
});

//--- add Interaktion Button in action begin ---//

//-- Ein/Ausblenden funktion beign --//
/* to know where the eye icon is pressed (in which list) and where not,
based of the index of the boolean ex : index 1 => globale .. */
let eyePressedHistoryArr = [false, false, false, false, false, false];

let eyeGedrückt = true;
/* if the hide button (eye icon) will be pressed,
first the icon will be an a slashed eye icon */
eyeButton.addEventListener("click", function () {
  if (eyeGedrückt) {
    eyeButton.classList.remove("fas");
    eyeButton.classList.remove("fa-eye");
    eyeButton.classList.add("fas");
    eyeButton.classList.add("fa-eye-slash");
    eyeButton.classList.add("fa-lg");
    /* checked variable will store all the unchecked boxes in the active div*/
    var checked = userPane.querySelectorAll(
      "input[type=checkbox]:not(:checked)"
    );
    // label1 will store all the labels int the active div
    let label1 = userPane.querySelectorAll("label");

    eyePressedHistoryArr[letztePanePos] = true;

    // all the unchecked boxes and labels will be hidden
    checked.forEach(function (e) {
      var i = 0;
      while (i < label1.length) {
        if (e.value === label1[i].innerText) {
          e.style.display = "none";
          label1[i].style.display = "none";
        }
        i++;
      }
    });

    eyeGedrückt = false;
  } else {
    /returning everything to befor, if the eye button dressed again/;
    eyeButton.classList.remove("fas");
    eyeButton.classList.remove("fa-eye-slash");
    eyeButton.classList.add("fas");
    eyeButton.classList.add("fa-eye");
    eyeButton.classList.add("fa-lg");
    eyePressedHistoryArr[letztePanePos] = false;
    var notChecked = userPane.querySelectorAll("input[type=checkbox]");
    let label1 = userPane.querySelectorAll("label");

    var i = 0,
      j = 0;
    notChecked.forEach(function (e) {
      // showing only the existing checkboxes and labels (without the deleted ones
      if (e.value != deletedInterArr[j]) {
        notChecked[i].style.display = "inline ";
        label1[i].style.display = "inline";
        i++;
      } else {
        notChecked[i].style.display = "none";
        label1[i].style.display = "none";
        j++;
      }
    });
    eyeGedrückt = true;
  }
});
//-- Ein/Ausblenden funktion end --//
//-- Select All function begin --//
let allSelected = true;
/* similar to  eyePressedHistoryArr */
let selectAllPressedHistoryArr = [false, false, false, false, false, false];
/* if the select all button (select all icon) will be pressed,
first the icon will be an a one check icon */
selectAll.addEventListener("click", function () {
  if (allSelected) {
    selectAll.classList.remove("fas");
    selectAll.classList.remove("fa-check-double");
    selectAll.classList.add("fas");
    selectAll.classList.add("fa-check");
    selectAll.classList.add("fa-lg");
    selectAllPressedHistoryArr[letztePanePos] = true;
    // will store all checkboxes
    let select = userPane.querySelectorAll("input[type=checkbox]");
    //  and select them all (changing thier values to true)
    select.forEach(function (e) {
      e.checked = true;
    });
    allSelected = false;
  } else {
    /returning everything to befor, if the check button pressed again/;
    selectAll.classList.remove("fas");
    selectAll.classList.remove("fa-check");
    selectAll.classList.add("fas");
    selectAll.classList.add("fa-check-double");
    selectAll.classList.add("fa-lg");
    selectAllPressedHistoryArr[letztePanePos] = false;

    // will store all checkboxes in the current list (userpane)
    let select = userPane.querySelectorAll("input[type=checkbox]");
    //  and unselect them all (changing thier values to false)
    select.forEach(function (e) {
      e.checked = false;
    });
    allSelected = true;
  }
});
//-- Select All function end --//

//-- loeschen function begin --//

deleteButton.addEventListener("click", function () {
  // will store all the checked boxes in the current list
  let selectToDelete = userPane.querySelectorAll(
    "input[type=checkbox]:checked"
  );
  // will store all the labels in the current list
  let label1 = userPane.querySelectorAll("label");

  // deleting all checked boxex
  selectToDelete.forEach(function (e) {
    var i = 0,
      j = 0;

    while (i < label1.length) {
      if (e.value === label1[i].innerText) {
        // pushing the deleted element in the deletedInterArr to use it in
        // the show/hide function (eye icon) to show all the list items except
        // the deleted ones
        deletedInterArr.push(e.value);
        // hide the checked checkbox  and its label
        e.style.display = "none";
        // uncheck it
        e.checked = false;
        // and hide its label
        label1[i].style.display = "none";
      }
      i++;
    }
  });
});
//-- loeschen function end --//
//-- undo function begin --//

undoButton.addEventListener("click", function () {
  // will store all the checkboxes of the current list
  let undoDelete = userPane.querySelectorAll("input[type=checkbox]");
  // will store all the labels of the current list
  let label1 = userPane.querySelectorAll("label");

  // will show all the checkboxes of the current list (the deleted too)
  undoDelete.forEach(function (e) {
    var i = 0;
    while (i < label1.length) {
      if (e.value === label1[i].innerText) {
        e.style.display = "inline";
        label1[i].style.display = "inline";
      }
      i++;
    }
    // removing all the values from the deleted interactions/material matrix
    deletedInterArr = [];
  });
});

//-- appending the bestätigng and side edit buttons begin --//

let buttonDiv = document.createElement("div");
let okayButton = document.createElement("button");

function deleteElementFromArry(arr, element) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === element) {
      arr.splice(i, 1);
    }
  }
}

//-- appending the bestätigng and side edit buttons end --//

//--- checked boxes clean Arrays begin ---//
// let globalInterChecked = [];
// let H5PInterChecked = [];
// let moodlelInterChecked = [];
// let iliaslInterChecked = [];
// let adobelInterChecked = [];
// let vistaInterchecked = [];
// let alleCheckedInter = new Array();

//  function checkedInterChecker(){
//   for (var i = 0; i < 6; i++) {
//     var checked = ul[i].querySelectorAll("input[type=checkbox]:checked");
//     alleCheckedInter.push(checked);

// console.log(checked);

//   switch (i) {
//     case 0:
//       // for (var x = 0, l = checked.length; x < l; x++) {
//       //   globalInterChecked.push(checked[x].value);
//       // }
//       newArr.push(checked);
//       break;
//     case 1:
//       for (var x = 0, l = checked.length; x < l; x++) {
//         H5PInterChecked.push(checked[x].value);
//       }
//       break;
//     case 2:
//       for (var x = 0, l = checked.length; x < l; x++) {
//         moodlelInterChecked.push(checked[x].value);
//       }
//       break;
//     case 3:
//       for (var x = 0, l = checked.length; x < l; x++) {
//         iliaslInterChecked.push(checked[x].value);
//       }
//       break;
//     case 4:
//       for (var x = 0, l = checked.length; x < l; x++) {
//         adobelInterChecked.push(checked[x].value);
//       }
//       break;
//     case 5:
//       for (var x = 0, l = checked.length; x < l; x++) {
//         vistaInterchecked.push(checked[x].value);
//       }
//       break;
//   }
// }

// console.log(alleCheckedInter);
// console.log(globalInterChecked);
// console.log(H5PInterChecked);
// console.log(moodlelInterChecked);
// console.log(iliaslInterChecked);
// console.log(adobelInterChecked);
// console.log(vistaInterchecked);
//  }

// let apply = document.getElementById("apply");
// apply.addEventListener("click", checkedInterChecker);

//--- checked boxes clean Arrays end ---//

//-- ein/Ausblenden funktion --//

// Json file Hochladen funktionalität begin

/**** PopUp *******/

// Get DOM Elements
const modal = document.querySelector("#my-modal");
const modalBtn = document.querySelector("#modal-btn");
const closeBtn = document.querySelector(".close");
const mainTabs = document.getElementsByClassName("tabs")[0];

// Events
modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
// window.addEventListener('click', outsideClick);

// Open
function openModal() {
  modal.style.display = "block";
}

// Close
function closeModal() {
  modal.style.display = "none";
}

// Close If Outside Click
function outsideClick(e) {
  if (e.target == modal) {
    modal.style.display = "none";
  }
}

/**** Drag & Drop or Browse: File Upload *******/

// Get DOM Elements
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("#upload-btn"),
  input = dropArea.querySelector("#upload");
let uploadFile; //this is a global variable and we'll use it inside multiple functions

button.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
};

input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  uploadFile = this.files[0];
  dropArea.classList.add("active");
  showFile(); //calling function
});
//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});
//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  uploadFile = event.dataTransfer.files[0];
  showFile(); //calling function
});
function showFile() {
  let fileType = uploadFile.type; //getting selected file type
  let validExtensions = ["application/json"];
  if (validExtensions.includes(fileType)) {
    //if user selected file is an json file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = () => {
      let fileURL = fileReader.result; //passing user file source in fileURL variable
      let jsonTag = `<json src="${fileURL}" alt="json">`; //creating an json tag and passing user selected file source inside src attribute
      dropArea.innerHTML = jsonTag; //adding that created json tag inside dropArea container
    };
    fileReader.readAsDataURL(uploadFile);
  } else {
    alert("This is not an Json File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

// Json file Hochladen funktionalität end
/*--------------------------Top scroll im Szenariobereich----------------------------------*/
function scrollFunction() {
  let scenarioTap = document.getElementById("scenariosTapId")

  if (scenarioTap.scrollTop > 9000 || document.documentElement.scrollTop > 9000) {
    totopbuttonSzenario.style.display = "block";
  } else {
    totopbuttonSzenario.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the place you want of the document
function topFunction() {
  console.log("here")
  let scenarioTap = document.getElementById("scenariosTapId")
      // let topPos = scenarioTap.offsetTop;
  scenarioTap.scrollIntoView()
}
/*--------------------------end Top scroll----------------------------------*/