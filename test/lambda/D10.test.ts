import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D10', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = '* Por Evento 15% del monto del siniestro, mínimo US$ 150.00 en Talleres Afiliados Multimarca * Por Evento 15% del monto del siniestro, mínimo US$ 250.00 en Talleres Afiliados';
    obtenerDeducible('D10', inputText, (err, result) => {
      expect(result).toContainEqual({
        deducible: '15',
        copago: '150.00',
        moneda: 'USD',
        tipo: 'Multimarca',
        marca: 'NO MARCA',
        taller: 'NO TALLER'
      });
      expect(result).toContainEqual({
        deducible: '15',
        copago: '250.00',
        moneda: 'USD',
        tipo: 'NO TIPO',
        marca: 'NO MARCA',
        taller: 'NO TALLER'
      });
      done();
    });
  });
});