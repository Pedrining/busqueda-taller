import { obtenerDeducible as obtenerDeducibleDAO } from "./dao/DeducibleDAO";

export const obtenerDeducible = async (
  event: any,
  context: any,
  callback: (error: any, result: any) => void
) => {
  const obtenerRespuesta = (err: any, response: any) => {
    let retorna = {};
    if (err) {
      retorna = {
        statusCode: 500,
        body: JSON.stringify({ error: "Error al procesar la solicitud", details: err })
      };
    } else {
      console.log("Resultado:", response);
      retorna = {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: response })
      };
    }
    callback(null, retorna);
    context.succeed();
  };

  try {
    let body = JSON.parse(event.body);
    
    // Soportar formato simplificado: { "text": "...", "codigo": "..." }
    // O formato legacy: { "payload": { "text": "...", "codigo": "..." } }
    let texto: string;
    let codDeducible: string | undefined;
    
    if (body.payload) {
      // Formato legacy con payload
      texto = body.payload.text;
      codDeducible = body.payload.codigo;
    } else {
      // Formato simplificado directo
      texto = body.text;
      codDeducible = body.codigo;
    }
    
    // Validar que al menos text esté presente
    if (!texto) {
      throw new Error("El campo 'text' es requerido");
    }
    
    console.log("codigo:", codDeducible || "(no especificado - usando lógica genérica)");
    console.log("texto:", texto.substring(0, 100) + "...");
    
    // Si no se envía código, usar lógica genérica
    const tipo = codDeducible || "";
    obtenerDeducibleDAO(tipo, texto, obtenerRespuesta);
    
  } catch (err) {
    console.log("Error:", err);
    let retorna = {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al procesar la solicitud", details: err })
    };
    callback(null, retorna);
    context.succeed();
  }
};
