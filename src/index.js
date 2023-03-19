const cards = document.getElementsByClassName("card");

Array.from(cards).forEach((card) => {
  var cardName = card.getElementsByClassName("cardTitle")[0];
  if (cardName) {
    card.addEventListener("mouseenter", (event) => {
      cardName.style.opacity = 1;
    });
    card.addEventListener("mouseleave", (event) => {
      cardName.style.opacity = 0;
    });
  }
  card.addEventListener("click", openModal);
});

const modal = document.querySelector("#modal");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalContent = document.querySelector("#modalContent");
const modalDescription = document.querySelector("#modalDescription");
const modalClose = document.querySelector("#modalClose");

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

function closeModal() {
  modal.style.display = "none";
  modalBackdrop.style.opacity = 0;
  setTimeout(() => {
    modalBackdrop.style.display = "none";
    screen = null;
  }, 300);
}

var screen;
var diff;
function openModal(e) {
  modal.style.display = "block";
  modalBackdrop.style.opacity = 0;
  modalBackdrop.style.display = "block";
  modalBackdrop.style.transition = "opacity 0.3s";
  setTimeout(() => {
    modalBackdrop.style.opacity = 1;
  }, 10);

  modalContent.innerHTML = "";
  modalDescription.innerHTML = "";
  var urls = e.currentTarget.getAttribute("data").split(",");

  var desc = e.currentTarget.querySelector(".cardTitle").innerHTML;
  var skills = e.currentTarget
    .querySelector(".cardTitle")
    .getAttribute("data")
    .split(",");

  //console.log(skills);
  modalDescription.innerHTML = desc;

  skills.forEach((skill) => {
    var skillDOM = document.createElement("span");
    skillDOM.className = "skill";
    skillDOM.innerHTML = skill;

    modalDescription.appendChild(skillDOM);
  });
  console.log(desc);
  if (urls.length == 0) {
    var url =
      "https://raw.githubusercontent.com/yan-map/yan-map.github.io/master/screens/" +
      urls[0];

    screen = document.createElement("img");
    screen.src = url;
    screen.className = "screen";

    modalContent.appendChild(screen);

    diff = (modalContent.clientWidth - screen.clientWidth) / 2;
    //screen.style.marginLeft = -diff + "px";
    //alert(modalContent.clientWidth + " " + screen.clientWidth);
    document.addEventListener("mousemove", parallax);
    //https://raw.githubusercontent.com/yan-map/yan-map.github.io/master/screens/webMap-1.png
  } else {
    //console.log(urls);
    var carousel = document.createElement("div");
    carousel.className = "carousel";
    /*carousel.setAttribute(
      "data-flickity",
      '{ "cellAlign": "left", "contain": true }'
    );*/

    urls.forEach((image) => {
      var imageNameParts = image.split(".");
      if (imageNameParts[imageNameParts.length - 1] == "mp4") {
        var slide = document.createElement("div");
        slide.className = "carousel-cell";
        console.log(image);
        var videoDOM = document.createElement("video");
        videoDOM.controls = false;
        videoDOM.muted = true;
        videoDOM.autoplay = true;
        videoDOM.loop = true;
        videoDOM.style.display = "block";
        //videoDOM.style.width = "100%";
        videoDOM.style.height = "100%";
        //videoDOM.preload = "metadata";
        // videoDOM.poster = "";
        videoDOM.src =
          "https://raw.githubusercontent.com/yan-map/yan-map.github.io/master/screens/" +
          image;

        slide.appendChild(videoDOM);
        carousel.appendChild(slide);
      } else {
        var slide = document.createElement("div");
        slide.className = "carousel-cell";
        var screen2 = document.createElement("img");
        screen2.src =
          "https://raw.githubusercontent.com/yan-map/yan-map.github.io/master/screens/" +
          image;
        screen2.className = "screen2";

        slide.appendChild(screen2);
        /*
        slide.setAttribute(
          "data-flickity-lazyload",
          "https://raw.githubusercontent.com/yan-map/yan-map.github.io/master/screens/" +
            image
        );*/
        carousel.appendChild(slide);
      }
    });

    var carouselDOM = document.createElement("div");
    carouselDOM.id = "carouselDOM";

    carouselDOM.appendChild(carousel);
    modalContent.appendChild(carouselDOM);
    var flkty = new Flickity(".carousel", {
      //fullscreen: true,
      lazyLoad: true,
      imagesLoaded: true
      // options
    });
    //carousel-cell
    //<div class="main-carousel" data-flickity='{ "cellAlign": "left", "contain": true }'>
  }
}

function parallax(e) {
  let w = window.innerWidth;
  let mouseX = e.clientX;
  //console.log(mouseX / w);
  if (screen) {
    /*var currMargin = parseFloat(
      screen.style.marginLeft.substring(0, screen.style.marginLeft.length - 2)
    );*/
    var newDiff = (mouseX / w) * 100 - 50; //(mouseX / w) * (diff * 2);
    screen.style.marginLeft = newDiff / 6 + "%";
    //screen.style.marginLeft = -newDiff + "px";
    //console.log(currMargin);
  }
}
