import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplite';

autocomplete($('#address'), $('#lat'), $('#lng'));
