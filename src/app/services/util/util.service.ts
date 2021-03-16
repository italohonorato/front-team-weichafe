import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public formatRut(rut: string): string {
    const actual = rut.replace(/^0+/, '');
    if (actual !== '' && actual.length > 1) {
      const sinPuntos = actual.replace(/\./g, '');
      const actualLimpio = sinPuntos.replace(/-/g, '');
      const inicio = actualLimpio.substring(0, actualLimpio.length - 1);
      let rutPuntos = '';
      let i = 0;
      let j = 1;
      for (i = inicio.length - 1; i >= 0; i--) {
        const letra = inicio.charAt(i);
        rutPuntos = letra + rutPuntos;
        if (j % 3 === 0 && j <= inicio.length - 1) {
          rutPuntos = '.' + rutPuntos;
        }
        j++;
      }
      const dv = actualLimpio.substring(actualLimpio.length - 1);
      rutPuntos = rutPuntos + '-' + dv;
      return rutPuntos;
    }
  }

  public removeDotsAndDvRut(rut: string) {
    const run = rut.split('-')[0];
    return run.split('.').join('');
  }
  public quitarPuntosGuion(rut: string) {
    return rut.split('.').join('').split('-').join('');
  }
  public quitarPuntosRut(rut: string) {
    return rut.split('.').join('');
  }
  public getDvRut(rut: string) {
    return rut.split('-')[1];
  }
  public getDV(T) {    // digito verificador
    let M = 0;
    let S = 1;
    for (; T; T = Math.floor(T / 10)) {
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
    }
    return S ? S - 1 : 'k';

  }

  public validarRutEntero(rut: string) {
    let retorno = false;
    rut = rut.trim();

    const run = this.removeDotsAndDvRut(rut);

    if (run.length < 7) {
      return retorno;
    }
    const dvIngresado = this.getDvRut(rut).toUpperCase();
    const dvCalculado = this.getDV(run).toString().toUpperCase();
    if (dvIngresado === dvCalculado) {

      retorno = true;
    }
    return retorno;
  }

  public validarRutEnteroRegex(rut: string) {
    console.log('rut recibido -> ' + rut);
    let retorno = true;
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) {
      retorno = false;
    }
    return retorno;
  }

  public format(value, pattern) {
    let i = 0;
    const v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
  }

  public formatDate(date: Date, dateFormat: string): string {
    return formatDate(date, dateFormat, 'en-US');
  }
}
