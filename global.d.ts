import auth from "./messages/fr/auth.json";
import footer from "./messages/fr/footer.json";
import forms from "./messages/fr/forms.json";
import nav from "./messages/fr/nav.json";
import profile from "./messages/fr/profile.json";
import table from "./messages/fr/table.json";
import title from "./messages/fr/title.json";

const intMessages = {
  ...auth,
  ...footer,
  ...forms,
  ...nav,
  ...profile,
  ...table,
  ...title,
};
type Messages = typeof intMessages;
type MessagesKey = <any>(
  key: any,
  values?: TranslationValues,
  formats?: Partial<Formats>
) => string;

type MessagesKey = {
  <TargetKey extends MessageKeys<any>>(
    key: TargetKey,
    values?: TranslationValues,
    formats?: Partial<Formats>
  ): string;
  rich<TargetKey extends MessageKeys<any>>(
    key: TargetKey,
    values?: RichTranslationValues,
    formats?: Partial<Formats>
  ): string | ReactElement | ReactNodeArray;
  markup<TargetKey extends MessageKeys<any>>(
    key: TargetKey,
    values?: MarkupTranslationValues,
    formats?: Partial<Formats>
  ): string;
  raw<TargetKey extends MessageKeys<any>>(key: TargetKey): any;
};

declare global {
  interface IntlMessages extends Messages {}
  interface MessagesIntl extends MessagesKey {}
}
