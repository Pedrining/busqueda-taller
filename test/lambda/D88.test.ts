import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D88', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = '. 20% del monto a indemnizar, mínimo US$ 250.00, para todo y cada evento, en talleres afiliados\n20% del monto a indemnizar, mínimo US$ 200.00, para todo y cada evento, en talleres afiliados multimarca Pérdida Total, Incendio, Robo Total:  20% del monto del siniestro Conductor varón menor  de 25 años, 25% del monto del siniestro mínimo US$ 300, para todo y cada evento Rotura de lunas, solo para reposición de lunas nacionales sin deducible Vías no autorizadas 25% del monto a indemnizar, mínimo US$ 300.00, para todo y cada evento';
    obtenerDeducible('D88', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '20',
          copago: '250.00',
          moneda: 'USD',
          tipo: 'NO TIPO',
          marca: 'NO MARCA',
          taller: 'NO TALLER'
        },
        {
          deducible: '20',
          copago: '200.00',
          moneda: 'USD',
          tipo: 'Multimarca',
          marca: 'NO MARCA',
          taller: 'NO TALLER'
        }
      ]);
      done();
    });
  });
});