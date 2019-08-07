import i18next from "i18next";
import * as jqueryI18next from "jquery-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import I18NextXhrBackend from "i18next-xhr-backend";

/**
 * @type {i18next.InitOptions}
 */
let i18nextOptions = {
  debug: true,
  whitelist: ["en", "fr"],
  backend: {
    loadPath: `${process.env.WEBROOT}/assets/locales/{{lng}}/{{ns}}.json`
  },
  lng: "en",
  load: "languageOnly",
  preload: ["en", "fr"],
  fallbackLng: "en",
  ns: ["vehicle-dashboard", "common", "validation"],
  defaultNS: "vehicle-dashboard"
};

function localize(selector) {
  selector = selector || "[data-i18n]";
  $(selector).localize();
}

export function initLocalization() {
  //prettier-ignore
  i18next
    .use(I18NextXhrBackend)
    .use(LanguageDetector)
    .init(i18nextOptions, function(err, t){
      // initialize the plugin
      jqueryI18next.init(i18next, $);

      // listen for language change
      $('.change-language').click(function(){
        let lang = $(this).data('lang');
        let $otherLangs = $(this).siblings();
        localStorage.setItem('language', lang);
        i18next.changeLanguage(lang, () => {
          //console.log(`Changing language to ${lang}.`);
          localize();
        });
        $(this).addClass('active');
        $otherLangs.removeClass('active');
      });

      // start localizing
      localize();
    });
}
