import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D22', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = '(No Inclueye I.G.V.) Por evento 10 % del monto a indemnizar, mínimo US$200 .00 Excepto para: Robo Parcial 10 % del monto a indemnizar, mínimo US$150 .00 Siniestros atendidos en talleres preferenciales 10 % del monto a indemnizar, mínimo US$150 .00 Robo de accesorios Musicales 10 % del monto a indemnizar, mínimo 150.00 Responsabilidad civil 10 % del monto a indemnizar, mínimo 150.00 Robo total solo se aseguran con GPS obligatorio hasta el segundo año de antigüedad,sin coaseguro.Tercer año, coaseguro 80 / 20';
    obtenerDeducible('D22', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '10',
          copago: '200',
          moneda: 'USD',
          tipo: 'NO TIPO',
          marca: 'NO MARCA',
          taller: 'NO TALLER'
        }
      ]);
      done();
    });
  });
});