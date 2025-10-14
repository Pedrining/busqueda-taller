import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D314', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = '10% del monto del siniestro, minimo US$ 500.00 en Talleres Nissan Maquinarias\n10% del monto del siniestro, minimo US$ 700.00 en Otros Talleres\nEn caso de discrepancia prevalece el mayor. No incluye I.G.V.';
    obtenerDeducible('D314', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '10',
          copago: '500.00',
          moneda: 'USD',
          tipo: 'NO TIPO',
          marca: 'NO MARCA',
          taller: 'Nissan Maquinarias'
        },
        {
          deducible: '10',
          copago: '700.00',
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