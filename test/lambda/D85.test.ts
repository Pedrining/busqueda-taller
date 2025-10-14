import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D85', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = '*Los siniestros, serán atendidos únicamente en la relación de talleres especiales descritos en la cláusula  VEHA07 20% del monto indemnizable, mínimo US$ 200 20% del monto indemnizable para pérdida total';
    obtenerDeducible('D85', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '20',
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