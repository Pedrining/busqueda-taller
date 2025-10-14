import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D6007', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = 'Por evento 15.00% del monto a indemnizar, mínimo US$ 150.00, en talleres afiliados Siniestros atendidos en red de talleres afiliados multimarca  10.00% del monto a indemnizar, mínimo US$ 150.00 Robo Parcial 15% del monto a indemnizar, mínimo US$ 150.00 Accesorios musicales 10.00% del monto a indemnizar, mínimo US$ 150.00 Hyundai Tucson, Santa Fe: coaseguro por Robo Total (nuevos y hasta 2 años de antigüedad) 20%. Si el vehículo cuenta con GPS, se excluirá el coaseguro. Por evento, Marca Mercedes Benz, BMW, Audi, Porsche Cayenne: 15% del monto a indemnizar, mínimo US$ 200.00 en talleres afiliados Por evento, Marca Mercedes Benz, BMW, Audi, Porsche Cayenne: 10% del monto a indemnizar, mínimo US$ 150.00 en talleres afiliados multimarca Marca Mercedes Benz, BMW, Audi, Porsche Cayenne Mayores a US$ 75,000 hasta US$ 100,000: 15% del monto a indemnizar, mínimo US$ 1,500 para daños por hueco o daños por despiste contra sardineles por llantas Runflat Menores a US$ 75,000: 15% del monto a indemnizar, mínimo US$ 800.00 para daños por hueco o daños por despiste contra sardineles por llantas Runflat Reposición de lunas nacionales, sin deducible';
    obtenerDeducible('D6007', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '15.00',
          copago: '150.00',
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