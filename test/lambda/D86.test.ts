import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D86', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = '- Ausencia de control: 25.00% del monto indemnizar, mínimo US$ 500.00 (Talleres Afiliados). - Ausencia de control: 25.00% del monto indemnizar, mínimo US$ 300.00 (Talleres Afiliados Multimarca). -Pérdida total por ausencia de control: 25.00% del monto a i';
    obtenerDeducible('D86', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '25.00',
          copago: '500.00',
          moneda: 'USD',
          tipo: 'NO TIPO',
          marca: 'NO MARCA',
          taller: 'NO TALLER'
        },
        {
          deducible: '25.00',
          copago: '300.00',
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