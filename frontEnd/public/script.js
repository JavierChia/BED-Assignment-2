const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

const openLogin = document.querySelector('.btnLogin')

const closeLogin = document.querySelector('.icon-close')

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
})

loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
})

openLogin.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
})

closeLogin.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
})

