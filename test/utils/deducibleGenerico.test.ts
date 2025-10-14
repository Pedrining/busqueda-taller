import { obtenerDeducibleGenerico, Deducible } from "../../dao/DeducibleDAO";

describe("obtenerDeducibleGenerico", () => {
  it("extrae deducibles de un input mixto", (done) => {
    const input = `Por evento 15 % del monto a indemnizar, mínimo US$150.00 Talleres Multimarca
Ausencia de control: 25.00% del monto indemnizar, mínimo US$500.00 (Talleres Afiliados)`;
    obtenerDeducibleGenerico(input, (err, result: Deducible[]) => {
      expect(err).toBeNull();
      expect(result.length).toBeGreaterThan(0);
      console.log(result);
      done();
    });
  });
});
