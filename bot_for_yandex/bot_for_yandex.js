// ==UserScript==
// @name         Bot for Yandex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yandex.ru/*
// @match        https://xn----7sbab5aqcbiddtdj1e1g.xn--p1ai/*
// @match        https://crushdrummers.ru/*
// @grant        none
// ==/UserScript==

let sites = {
    "xn----7sbab5aqcbiddtdj1e1g.xn--p1ai": ["Как звучит флейта","Валторна","Тромбон","Кларнет","Фагот","Гобой","Саксофон"],
    "crushdrummers.ru": ["Барабанное шоу","Заказать шоу барабанщиков","Барабанное шоу в Москве"]
}
let site = Object.keys(sites)[Math.floor(Math.random() * Object.keys(sites).length)];
let keywords = sites[site];
let randomIndex = Math.floor(Math.random() * keywords.length);
let keyword = keywords[randomIndex];
let yandexInput = document.getElementById("text");

// Подключение Cookie
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
let btn = document.getElementsByClassName("button_theme_websearch")[0]; // Кнопка поиска в Yandex
let links = document.links;

// Если кнопка поиска найдена, мы на главной странице поисковика Yandex
if (btn != undefined) {
    document.cookie = "site = " + site; // Запоминаем сайт, который выпал в выборке
    let i = 0;
    let timerId = setInterval(() => {
        yandexInput.click();
        yandexInput.value += keyword[i++];
        if (i == keyword.length) {
            clearInterval(timerId);
            btn.click();
        }
    }, 250);
// Мы на странице с результатами поиска
} else if (location.hostname == "yandex.ru") {
    site = getCookie("site");
    let nextYandexPage = true;

    for (let i = 0; i < links.length; i++) {
        let link = links[i];
        if (link.href.indexOf(site) != -1) {
            nextYandexPage = false;
            link.removeAttribute("target");
            link.click();
            break;
        }
    }
    setTimeout(() => {
        let currentYandexPage = document.getElementsByClassName("pager__item_current_yes")[0].innerText;
        if (nextYandexPage && currentYandexPage < 10) {
            let next = document.getElementsByClassName("pager__item_kind_next")[0];
            next.click();
        } else if (currentYandexPage == 10) {
            location.href = "https://yandex.ru/";
        }
    }, 2000);
// Мы на искомом сайте из выборки
} else {
    setInterval(() => {
        if (Math.random() >= 0.8) {
            location.href = "https://yandex.ru/";
        }
        let link = links[Math.floor(Math.random() * links.length)];
        if (link.href.indexOf(location.hostname) != -1) {
            link.click();
        }
    }, 3000);
}
