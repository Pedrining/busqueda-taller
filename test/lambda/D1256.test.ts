import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D1256', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = 'AUSENCIA DE CONTROL EN TALLERES JAPAN AUTOS, 22% del DEL MONTO DEL SINIESTRO, Mínimo de US$500.00. AUSENCIA DE CONTROL';
    obtenerDeducible('D1256', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '22',
          copago: '500.00',
          moneda: 'USD',
          tipo: 'NO TIPO',
          marca: 'NO MARCA',
          taller: 'JAPAN AUTOS'
        }
      ]);
      done();
    });
  });
});