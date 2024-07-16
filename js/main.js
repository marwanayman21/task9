const imgePath = 'https://image.tmdb.org/t/p/w500/';
const moviesCategory = document.getElementById('moviesCategory');
const searchInput = document.querySelector('#searchInput');
const categoryTitle = document.querySelector('#categoryTitle');
const key = '37a194ab674674d3542bdfa59c52f54f';
let searchIcon1 =  document.getElementById("search-icon1");
let searchIcon2 =  document.getElementById("search-icon2");
searchInput.addEventListener('keyup', async function () {
  if (searchInput.value.length >= 3) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${searchInput.value}&page=1`);
      if (!res.ok) throw new Error('Network response was not ok.');
      const data = await res.json();
      
      if (data.results.length !== 0) {
        categoryTitle.innerHTML = `<span class="fs-5 text-white">The results about:</span> "${searchInput.value}"`;
        display(data.results);
      } else {
        categoryTitle.innerHTML = `<span class="fs-5 text-white">There are no results about:</span> "${searchInput.value}"`;
        moviesCategory.innerHTML = `
          <div class="col-md-12 text-white text-center fs-2 py-5">
            Sorry, There are no results about your search :(
          </div>
        `;
      }
      showAlert('#alertSearch', '');
      searchIcon2.classList.replace('d-block','d-none');
      searchIcon1.classList.replace('d-none','d-block');
    } catch (error) {
      console.error('Something went wrong:', error);
    }
  }else if(searchInput.value.length < 3){
    showAlert('#alertSearch', 'You should enter at least 3 characters');
    searchIcon1.classList.replace('d-block','d-none');
    searchIcon2.classList.replace('d-none','d-block');
    // console.log("serch messege");
  }
  
  else {
    categoryTitle.innerHTML = 'New Playing';
    getData('/movie/now_playing');
  }
});

document.querySelectorAll('#menu li span').forEach(span => {
  span.addEventListener('click', function () {
    if (this.getAttribute('id') !== undefined) {
      getData(this.getAttribute('id'));
      categoryTitle.innerHTML = this.innerHTML;
    }
  });
});

const getData = async (category) => {
  try {
    const res = await fetch(`https://api.themoviedb.org/3${category}?api_key=${key}`);
    if (!res.ok) throw new Error('Network response was not ok.');
    const data = await res.json();
    display(data.results);
  } catch (error) {
    console.error('Something went wrong:', error);

  }
};

getData('/movie/now_playing');

function display(json) {
  let container = '';
  json.forEach(movie => {
    container += `
      <div class="col-md-4 wow bounceInUp">
        <div class="movieBox position-relative">
          <img src="${imgePath + movie.poster_path}" class='w-100' alt="">
          <div class="movieDetails position-absolute d-flex flex-column justify-content-around">
            <img src="${imgePath + movie.backdrop_path}" class='w-100 h-100 position-absolute' /> 
            <div>
              <h3 class="main-text text-center">${movie.original_title}</h3>
              <span class="me-3">${movie.vote_average}</span>
              <span>${movie.release_date}</span>
              <p>${movie.overview}</p>
            </div>
            <div class="play d-flex justify-content-center">
              <button class="rounded-circle d-flex align-items-center justify-content-center">
                <i class="fa fa-play fa-3x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  moviesCategory.innerHTML = container;
}

document.getElementById('control-btn').addEventListener('click', function () {
  document.querySelectorAll('#menu li span').forEach(span => {
    const opacity = window.getComputedStyle(span).opacity;
    if (opacity === '0') {
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.top = '50%';
        span.style.transform = 'translateY(-50%)';
      }, 500);
    } else {
      span.style.opacity = '0';
      span.style.top = '300%';
    }
  });
});

const toggleBtnWidth = document.getElementById('toggle-btn').offsetWidth;
document.getElementById('toggle-btn').style.right = `-${toggleBtnWidth}px`;
const menuWidth = document.getElementById('menu').offsetWidth;
document.getElementById('menu').style.left = `-${menuWidth}px`;

document.getElementById('control-btn').addEventListener('click', function () {
  const menuLeft = document.getElementById('menu').style.left;
  if (menuLeft === '0px') {
    document.getElementById('menu').style.left = `-${menuWidth}px`;
    this.classList.add('fa-bars');
    this.classList.remove('fa-xmark');
  } else {
    document.getElementById('menu').style.left = '0';
    this.classList.remove('fa-bars');
    this.classList.add('fa-xmark');
  }
});



window.addEventListener('scroll', function () {
  const btnUp = document.getElementById('btn-up');
  if (window.scrollY > 1000) {
    btnUp.style.display = 'block';
  } else {
    btnUp.style.display = 'none';
  }
});

document.getElementById('btn-up').addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('#menu a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetOffset = document.querySelector(targetId).offsetTop;
    window.scrollTo({ top: targetOffset, behavior: 'smooth' });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const sidebar = document.querySelector('.color-box');
  const toggleBtn = document.querySelector('#color-box-switch');
  const colorElems = document.querySelectorAll('.color-option');
  const sidebarWidth = sidebar.offsetWidth;
  const toggleBtnWidth = toggleBtn.offsetWidth;

  sidebar.style.right = `-${sidebarWidth}px`;
  toggleBtn.style.left = `-${toggleBtnWidth}px`;

  function toggleSidebar(duration = 1500) {
    toggleBtn.addEventListener('click', function () {
      toggleBtn.children[0].classList.toggle('fa-spin');
      const sidebarRight = sidebar.style.right;
      if (sidebarRight === '0px') {
        animate(sidebar, 'right', `-${sidebarWidth}px`, duration);
      } else {
        animate(sidebar, 'right', '0px', duration);
      }
    });
  }

  function animate(element, property, value, duration) {
    element.style.transition = `${property} ${duration}ms`;
    element.style[property] = value;
  }
 


  function pickColor(mainColor = '--main-color', border = true, borderWidth = '1px', borderStyle = 'solid', borderColor = '#ddd') {
    let storageColor = localStorage.getItem("color");  
    if(storageColor != null){
        document.documentElement.style.setProperty(mainColor,storageColor);
  }
    if (border) {
      document.querySelector('.default').style.border = `${borderWidth} ${borderStyle} ${borderColor}`;
    }
 
    colorElems.forEach(elem => {
      elem.addEventListener('click', function () {
     
        document.documentElement.style.setProperty(mainColor,window.getComputedStyle(elem).backgroundColor  );
        localStorage.setItem('color', window.getComputedStyle(elem).backgroundColor);

       

        console.log(storageColor);
        if (border) {
          elem.style.border = `${borderWidth} ${borderStyle} ${borderColor}`;
          colorElems.forEach(sibling => {
            if (sibling !== elem) {
              sibling.style.border = 'none';
            }
          });
        }
      });
    });
  }

  toggleSidebar();
  pickColor();
});

new WOW().init();


function showAlert(elementId, message) {
  var element = document.querySelector(elementId);
  element.textContent = message;
  element.style.color = message ? 'red' : '';
}


function addValidationClass(element, isValid) {
  if (isValid) {
      element.classList.add('is-valid');
      element.classList.remove('is-invalid');
  } else {
      element.classList.add('is-invalid');
      element.classList.remove('is-valid');
  }
}


function validateEmail() {
  var email = document.getElementById('userEmail').value;
  var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!regExp.test(email)) {
      addValidationClass(document.getElementById('userEmail'), false);
      showAlert('#alertEmail', 'Please enter a correct email');
      return false;
  } else {
      addValidationClass(document.getElementById('userEmail'), true);
      showAlert('#alertEmail', '');
      return true;
  }
}


function validatePhone() {
  var phone = document.getElementById('userPhone').value;
  var regExp = /^01[0125][0-9]{8}$/;
  if (!regExp.test(phone)) {
      addValidationClass(document.getElementById('userPhone'), false);
      showAlert('#alertPhone', 'Please enter a correct phone number');
      return false;
  } else {
      addValidationClass(document.getElementById('userPhone'), true);
      showAlert('#alertPhone', '');
      return true;
  }
}


function validateAge() {
  var age = document.getElementById('userAge').value;
  var regExp = /^([1-8][0-9]|90)$/;
  if (!regExp.test(age)) {
      addValidationClass(document.getElementById('userAge'), false);
      showAlert('#alertAge', 'Please enter a correct age');
      return false;
  } else {
      addValidationClass(document.getElementById('userAge'), true);
      showAlert('#alertAge', '');
      return true;
  }
}


function validatePassword() {
  var password = document.getElementById('userPass').value;
  var regExp = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (!regExp.test(password)) {
      addValidationClass(document.getElementById('userPass'), false);
      showAlert('#alertPass', 'Password must be 8-16 characters long, include a number and a symbol');
      return false;
  } else {
      addValidationClass(document.getElementById('userPass'), true);
      showAlert('#alertPass', '');
      return true;
  }
}


function validatePasswordMatch() {
  var password = document.getElementById('userPass').value;
  var vPassword = document.getElementById('userVPass').value;
  if (password !== vPassword) {
      addValidationClass(document.getElementById('userVPass'), false);
      showAlert('#alertVPass', 'Passwords do not match');
      return false;
  } else {
      addValidationClass(document.getElementById('userVPass'), true);
      showAlert('#alertVPass', '');
      return true;
  }
}


function enableSubmitButton() {
  if (validateEmail() &&
                validatePhone() &&
                validateAge() &&
                validatePassword() &&
                validatePasswordMatch()){
  document.getElementById('submitBtn').removeAttribute('disabled');
                }
}


document.getElementById('userEmail').addEventListener('input', function() {
  validateEmail();
  enableSubmitButton();
});

document.getElementById('userPhone').addEventListener('input', function() {
  validatePhone();
  enableSubmitButton();
});

document.getElementById('userAge').addEventListener('input', function() {
  validateAge();
  enableSubmitButton();
});

document.getElementById('userPass').addEventListener('input', function() {
  validatePassword();
  enableSubmitButton();
});

document.getElementById('userVPass').addEventListener('input', function() {
  validatePasswordMatch();
  enableSubmitButton();
});


document.getElementById('showPass').addEventListener('click', function() {
  var passInput = document.getElementById('userPass');
  var passVInput = document.getElementById('userVPass');
  if (passInput.type === 'password') {
      passInput.type = 'text';
      passVInput.type = 'text';
      this.classList.add('fa-eye-slash');
      this.classList.remove('fa-eye');
  } else {
      passInput.type = 'password';
      passVInput.type = 'password';
      this.classList.remove('fa-eye-slash');
      this.classList.add('fa-eye');
  }
});
