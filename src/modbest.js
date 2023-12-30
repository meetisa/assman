import { d_m } from './Text/d_m.js';
import { app_m } from './Text/app_m.js';
import { d_f } from './Text/d_f.js';
import { app_f } from './Text/app_f.js';

export function bm() {
		const div_m = d_m[Math.floor(Math.random() * d_m.length)];
    const ins_m = app_m[Math.floor(Math.random() * app_m.length)]
    return `${div_m} ${ins_m}`;
}

export function bf() {
    const div_f = d_f[Math.floor(Math.random() * d_f.length)];
    const ins_f = app_f[Math.floor(Math.random() * app_f.length)];
    return `${div_f} ${ins_f}`;
}

/*
export function max_len() {
    if(best.length == 72240)
        return true;
}
*/
