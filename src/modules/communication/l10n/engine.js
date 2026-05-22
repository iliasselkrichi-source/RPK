import { TRANSLATIONS } from './translations.js';

export class LanguageEngine {
    static getLanguage(preferredLang) {
        const supported = ['nl', 'fr', 'en', 'es', 'de'];
        const lang = (preferredLang || 'nl').toLowerCase().substring(0, 2);
        return supported.includes(lang) ? lang : 'nl';
    }

    static translate(key, lang = 'nl', params = {}) {
        const targetLang = this.getLanguage(lang);
        let text = TRANSLATIONS[targetLang]?.[key] || TRANSLATIONS['nl']?.[key] || key;

        Object.keys(params).forEach(p => {
            text = text.replace(new RegExp(`{{${p}}}`, 'g'), params[p]);
        });

        return text;
    }
}
