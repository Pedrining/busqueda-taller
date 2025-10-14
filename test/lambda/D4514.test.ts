import { obtenerDeducible } from '../../dao/DeducibleDAO';

describe('Creación de test para la prueba de talleres - Caso D4514', () => {
  test('Debería extraer correctamente los deducibles usando la función principal', (done) => {
    const inputText = 'Por evento 15.00% del monto a indemnizar, mínimo S/. 560.00, en talleres afiliados Excepto para: Siniestros atendidos en red de talleres afiliados multimarca 10.00% del monto a indemnizar, mínimo S/. 420.00 Robo Parcial 15% del monto a indemnizar, mínimo S/. 420.00 Accesorios musicales 10.00% del monto a indemnizar, mínimo S/. 420.00 Conductor varón menor  de 25 años, 20% del monto del siniestro mínimo S/. 840.00, para todo evento (incluído pérdida total) Toyota Rav4, Land Cruiser, Land Crusier Prado, FJ Cruiser, Fortuner, Nissan Patrol, Pathfinder, Suzuki Grand Nomade, Honda CRV nuevas y hasta 2 años con Sistema de Rastreo Vehicular Obligatorio para cobertura de robo total. Camionetas Rurales/SUV mayores a S/. 140,000 Sistema de Rastreo Vehicular obligatorio para la cobertura de robo total. Por evento, Marca Mercedes Benz, BMW, Audi: 20% del monto a indemnizar, mínimo S/. 560.00 en talleres afiliados. Por evento, Marca Mercedes Benz, BMW, Audi: 15% del monto a indemnizar, mínimo S/. 420.00 en talleres afiliados multimarca. Para Volcaduras incluyendo Xtrail, Pathfinder, Patrol, rurales y suv: 20%, monto del siniestro, mínimo S/. 420.00+ IGV Imprudencia culposa 20% del siniestro mínimo S/. 840.00';
    obtenerDeducible('D4514', inputText, (err, result) => {
      expect(result).toEqual([
        {
          deducible: '15',
          copago: '560',
          moneda: 'PEN',
          tipo: 'NO TIPO',
          marca: 'NO MARCA',
          taller: 'NO TALLER'
        },
        {
          deducible: '10',
          copago: '420',
          moneda: 'PEN',
          tipo: 'Multimarca',
          marca: 'NO MARCA',
          taller: 'NO TALLER'
        },
        {
          deducible: '20',
          copago: '560',
          moneda: 'PEN',
          tipo: 'NO TIPO',
          marca: 'MERCEDES BENZ, BMW, AUDI',
          taller: 'NO TALLER'
        },
        {
          deducible: '15',
          copago: '420',
          moneda: 'PEN',
          tipo: 'Multimarca',
          marca: 'MERCEDES BENZ, BMW, AUDI',
          taller: 'NO TALLER'
        }
      ]);
      done();
    });
  });
});