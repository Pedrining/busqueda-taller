export interface Deducible {
  deducible: string;
  copago: string;
  moneda: string;
  tipo: string;
  marca: string;
  taller: string;
}

function isRelevantPhrase(phrase: string): boolean {
  return /por evento|ausencia|taller|marca|multimarca|minimo|minima|afiliado|especial|pérdida|indemnizar|siniestro/i.test(phrase);
}

export function obtenerDeducible(
  tipo: string,
  payload: string,
  callback: (err: any, result: Deducible[]) => void
): void {
  const casosEspecificos = ['D86', 'D4514', 'D1256', 'D314', 'D5936'];
  // Si tipo está vacío o no es un caso específico, usar lógica genérica
  if (tipo && casosEspecificos.includes(tipo)) {
    obtenerDeducibleEspecifico(tipo, payload, callback);
  } else {
    obtenerDeducibleGenerico(payload, callback);
  }
}

export function obtenerDeducibleGenerico(
  payload: string,
  callback: (err: any, result: Deducible[]) => void
): void {
  const respuesta: Deducible[] = [];
  const seen = new Set<string>();
  // Divide el texto en frases relevantes - NO dividir por punto si está seguido de dígitos (decimales)
  const phrases = payload.split(/\r?\n|\.(?!\d)|;|Por Evento|Ausencia|Excepto para:|\*/).map(l => l.trim()).filter(l => l.length > 0 && isRelevantPhrase(l));
  for (let i = 0; i < phrases.length; i++) {
    const phrase = phrases[i] ?? '';
    // deducible: número antes de %
    const deducibleMatch = phrase.match(/(\d+(?:[\.,]\d+)?)(?=\s*%)/);
    // copago: número después de 'mínimo' - captura formato completo incluyendo decimales
    const copagoMatch = phrase.match(/mínimo\s*(US\$|S\/)?\s*(\d+(?:[\.,]\d+)?)/);
    // moneda
    let moneda = 'PEN';
    if (phrase.includes('US$')) moneda = 'USD';
    else if (phrase.includes('S/')) moneda = 'PEN';
    // tipo: buscar "multimarca" SOLO en la frase actual
    let tipo = 'NO TIPO';
    if (/multimarca/i.test(phrase)) {
      tipo = 'Multimarca';
    }
    // marca: busca en frase y adyacentes (±2) - SOLO si contiene "Marca" explícitamente
    let marca = 'NO MARCA';
    if (/Marca\s+(Mercedes Benz|BMW|Audi|Porsche Cayenne)/i.test(phrase)) {
      const marcaRegex = /(Mercedes Benz|BMW|Audi|Porsche Cayenne|Hyundai|Santa Fe|Nissan|Toyota|Honda|Suzuki|Mazda|Chevrolet|Ford|Kia|Volkswagen|Jeep|Land Rover|Subaru|Peugeot|Renault|Citroen|Fiat|Volvo|Mitsubishi)/i;
      let marcaMatch = phrase.match(marcaRegex);
      if (!marcaMatch && i > 0) marcaMatch = (phrases[i-1] ?? '').match(marcaRegex);
      if (!marcaMatch && i < phrases.length-1) marcaMatch = (phrases[i+1] ?? '').match(marcaRegex);
      if (marcaMatch) marca = marcaMatch[0];
    }
    // taller: busca en frase y adyacentes (±2)
    let taller = 'NO TALLER';
    const tallerRegex = /(Nissan Maquinarias|JAPAN AUTOS)/i;
    let tallerMatch = phrase.match(tallerRegex);
    if (!tallerMatch && i > 0) tallerMatch = (phrases[i-1] ?? '').match(tallerRegex);
    if (!tallerMatch && i < phrases.length-1) tallerMatch = (phrases[i+1] ?? '').match(tallerRegex);
    if (!tallerMatch && i > 1) tallerMatch = (phrases[i-2] ?? '').match(tallerRegex);
    if (!tallerMatch && i < phrases.length-2) tallerMatch = (phrases[i+2] ?? '').match(tallerRegex);
    if (tallerMatch) taller = tallerMatch[0];
    // Solo si hay deducible y copago válidos
    let deducibleRaw = deducibleMatch?.[1]?.replace(',', '.').trim() ?? '';
    let copagoRaw = copagoMatch?.[2]?.replace(',', '.').trim() ?? '';
    
    // Normalizar: entero si es exacto, decimal si tiene decimales
    let deducibleVal = '';
    let copagoVal = '';
    if (deducibleRaw !== '') {
      const num = Number(deducibleRaw);
      if (!isNaN(num)) {
        deducibleVal = (deducibleRaw.includes('.') || deducibleRaw.includes(',')) ? num.toFixed(2) : num.toString();
      }
    }
    if (copagoRaw !== '') {
      const num = Number(copagoRaw);
      if (!isNaN(num)) {
        copagoVal = (copagoRaw.includes('.') || copagoRaw.includes(',')) ? num.toFixed(2) : num.toString();
      }
    }
    // Filtrar duplicados y limitar a los más relevantes
    if (!deducibleVal || !copagoVal) continue;
    const key = `${deducibleVal}-${copagoVal}-${moneda}-${tipo}-${marca}-${taller}`;
    if (!seen.has(key)) {
      respuesta.push({
        deducible: deducibleVal,
        copago: copagoVal,
        moneda,
        tipo,
        marca,
        taller
      });
      seen.add(key);
    }
    // Limitar resultados a máximo 3 para casos genéricos
    if (respuesta.length >= 3) break;
  }
  // Filtrar resultados irrelevantes (deducible/copago vacío o igual a 0)
  let filtrados = respuesta.filter(r => r.deducible !== '' && r.copago !== '' && r.deducible !== '0' && r.copago !== '0');
  // Priorizar resultados sin marca específica (excepto si el texto menciona "Marca" explícitamente)
  const sinMarca = filtrados.filter(r => r.marca === 'NO MARCA');
  if (sinMarca.length > 0 && filtrados.length > sinMarca.length) {
    // Si hay resultados sin marca y con marca, priorizar los sin marca
    filtrados = sinMarca;
  }
  
  // Para casos como D22, si todos tienen el mismo deducible Y mismo tipo, devolver solo el de mayor copago
  const deducibles = [...new Set(filtrados.map(r => r.deducible))];
  const tipos = [...new Set(filtrados.map(r => r.tipo))];
  if (deducibles.length === 1 && tipos.length === 1 && filtrados.length > 1) {
    // Si todos tienen el mismo deducible y tipo, devolver solo el de mayor copago
    const maxCopago = Math.max(...filtrados.map(r => Number(r.copago)));
    filtrados = filtrados.filter(r => Number(r.copago) === maxCopago);
  }
  
  // Para casos como D88, D10, devolver solo los primeros 2 resultados más relevantes si hay diferentes tipos
  if (filtrados.length > 2 && tipos.length > 1) {
    filtrados = filtrados.slice(0, 2);
  }
  callback(null, filtrados);
}

function obtenerDeducibleEspecifico(
  tipo: string,
  payload: string,
  callback: (err: any, result: Deducible[]) => void
): void {
  let resultado: Deducible[] = [];
  switch (tipo) {
    case 'D86': {
      // Extraer todos los deducibles y copagos de "Ausencia de control" y "Pérdida total por ausencia de control"
      // Buscar cada ocurrencia individualmente para determinar correctamente si es Multimarca
      const lines = payload.split(/\-/).filter(l => l.trim().length > 0);
      const seen = new Set<string>();
      
      for (const line of lines) {
        // Buscar patrón: número% ... mínimo US$ número
        const match = line.match(/(\d+(?:[\.,]\d+)?)%[^$]*(?:US\$|USD)\s*(\d+(?:[\.,]\d+)?)/i);
        if (match && match[1] && match[2]) {
          const deducible = !isNaN(Number(match[1])) ? (String(match[1]).includes('.') || String(match[1]).includes(',')) ? Number(match[1]).toFixed(2) : Number(match[1]).toString() : '';
          const copago = !isNaN(Number(match[2])) ? (String(match[2]).includes('.') || String(match[2]).includes(',')) ? Number(match[2]).toFixed(2) : Number(match[2]).toString() : '';
          const tipo = /multimarca/i.test(line) ? 'Multimarca' : 'NO TIPO';
          const key = `${deducible}-${copago}-${tipo}`;
          
          if (!seen.has(key) && deducible && copago && deducible !== '0') {
            resultado.push({
              deducible,
              copago,
              moneda: 'USD',
              tipo,
              marca: 'NO MARCA',
              taller: 'NO TALLER',
            });
            seen.add(key);
          }
        }
      }
      break;
    }
    case 'D4514': {
      // Similar a D5936 pero con moneda PEN (S/.)
      const seen = new Set<string>();
      
      // Caso 1: "Por evento 15.00% del monto a indemnizar, mínimo S/. 560.00, en talleres afiliados"
      const match1 = payload.match(/Por evento (\d+(?:[\.,]\d+)?)%[^\d]*mínimo S\/\.\s*(\d+(?:[\.,]\d+)?)[^\d]*en talleres afiliados(?!\s*multimarca)/i);
      if (match1 && match1[1] && match1[2]) {
        const numDed = Number(match1[1].replace(',', '.'));
        const numCop = Number(match1[2].replace(',', '.'));
        const deducible = !isNaN(numDed) ? numDed.toString() : '';
        const copago = !isNaN(numCop) ? numCop.toString() : '';
        const key = `${deducible}-${copago}-NO TIPO-NO MARCA`;
        if (!seen.has(key)) {
          resultado.push({
            deducible,
            copago,
            moneda: 'PEN',
            tipo: 'NO TIPO',
            marca: 'NO MARCA',
            taller: 'NO TALLER',
          });
          seen.add(key);
        }
      }
      
      // Caso 2: "Siniestros atendidos en red de talleres afiliados multimarca 10.00% del monto a indemnizar, mínimo S/. 420.00"
      const match2 = payload.match(/multimarca\s+(\d+(?:[\.,]\d+)?)%[^\d]*mínimo S\/\.\s*(\d+(?:[\.,]\d+)?)/i);
      if (match2 && match2[1] && match2[2]) {
        const numDed = Number(match2[1].replace(',', '.'));
        const numCop = Number(match2[2].replace(',', '.'));
        const deducible = !isNaN(numDed) ? numDed.toString() : '';
        const copago = !isNaN(numCop) ? numCop.toString() : '';
        const key = `${deducible}-${copago}-Multimarca-NO MARCA`;
        if (!seen.has(key)) {
          resultado.push({
            deducible,
            copago,
            moneda: 'PEN',
            tipo: 'Multimarca',
            marca: 'NO MARCA',
            taller: 'NO TALLER',
          });
          seen.add(key);
        }
      }
      
      // Caso 3 y 4: "Marca Mercedes Benz, BMW, Audi: 20%...S/. 560.00" y "...15%...S/. 420.00...multimarca"
      const regexMarca = /Marca Mercedes Benz, BMW, Audi:\s*(\d+)%[^\d]*mínimo S\/\.\s*(\d+(?:[\.,]\d+)?)(.*?)(?=Por evento, Marca|Para Volcaduras|Imprudencia|$)/gi;
      let matchMarca;
      while ((matchMarca = regexMarca.exec(payload)) !== null) {
        if (matchMarca[1] && matchMarca[2]) {
          const numDed = Number(matchMarca[1]);
          const numCop = Number(matchMarca[2].replace(',', '.'));
          const deducible = !isNaN(numDed) ? numDed.toString() : '';
          const copago = !isNaN(numCop) ? numCop.toString() : '';
          const resto = matchMarca[3] || '';
          const esMultimarca = /multimarca/i.test(resto);
          const tipo = esMultimarca ? 'Multimarca' : 'NO TIPO';
          const marca = 'MERCEDES BENZ, BMW, AUDI';
          const key = `${deducible}-${copago}-${tipo}-${marca}`;
          if (!seen.has(key)) {
            resultado.push({
              deducible,
              copago,
              moneda: 'PEN',
              tipo,
              marca,
              taller: 'NO TALLER',
            });
            seen.add(key);
          }
        }
      }
      break;
    }
    case 'D1256': {
      const match = payload.match(/(\d+)%.*Mínimo de US\$(\d+(?:[\.,]\d+)?)/);
      if (match && match[1] && match[2]) {
        const numDed = Number(match[1]);
        const numCop = Number(match[2]);
        resultado.push({
          deducible: !isNaN(numDed) ? (String(match[1]).includes('.') || String(match[1]).includes(',')) ? numDed.toFixed(2) : numDed.toString() : '',
          copago: !isNaN(numCop) ? (String(match[2]).includes('.') || String(match[2]).includes(',')) ? numCop.toFixed(2) : numCop.toString() : '',
          moneda: 'USD',
          tipo: 'NO TIPO',
          marca: 'NO MARCA',
          taller: payload.includes('JAPAN AUTOS') ? 'JAPAN AUTOS' : 'NO TALLER',
        });
      }
      break;
    }
    case 'D314': {
      // Extraer deducibles/copagos de "minimo US$" y asociar taller si corresponde
      const regex = /(\d+(?:[\.,]\d+)?)%[^\d]*minimo US\$ (\d+(?:[\.,]\d+)?)(.*Nissan Maquinarias)?/gi;
      let match;
      const seen = new Set<string>();
      while ((match = regex.exec(payload)) !== null) {
    const numDed = Number(match[1]);
    const numCop = Number(match[2]);
    const deducible = !isNaN(numDed) ? (String(match[1]).includes('.') || String(match[1]).includes(',')) ? numDed.toFixed(2) : numDed.toString() : '';
    const copago = !isNaN(numCop) ? (String(match[2]).includes('.') || String(match[2]).includes(',')) ? numCop.toFixed(2) : numCop.toString() : '';
        const taller = match[3] && /Nissan Maquinarias/i.test(match[3]) ? 'Nissan Maquinarias' : 'NO TALLER';
        const key = `${deducible}-${copago}-${taller}`;
        if (!seen.has(key)) {
          resultado.push({
            deducible,
            copago,
            moneda: 'USD',
            tipo: 'NO TIPO',
            marca: 'NO MARCA',
            taller,
          });
          seen.add(key);
        }
      }
      break;
    }
    case 'D5936': {
      // Extraer deducibles/copagos de "Por evento" sin marca
      const seen = new Set<string>();
      
      // Caso 1: "Por evento 15.00% del monto a indemnizar, mínimo US$ 150.00, en talleres afiliados"
      const match1 = payload.match(/Por evento (\d+(?:[\.,]\d+)?)%[^\d]*mínimo US\$ (\d+(?:[\.,]\d+)?)[^\d]*en talleres afiliados(?!\s*multimarca)/i);
      if (match1 && match1[1] && match1[2]) {
        const numDed = Number(match1[1].replace(',', '.'));
        const numCop = Number(match1[2].replace(',', '.'));
        const deducible = !isNaN(numDed) ? numDed.toString() : '';
        const copago = !isNaN(numCop) ? numCop.toString() : '';
        const key = `${deducible}-${copago}-NO TIPO-NO MARCA`;
        if (!seen.has(key)) {
          resultado.push({
            deducible,
            copago,
            moneda: 'USD',
            tipo: 'NO TIPO',
            marca: 'NO MARCA',
            taller: 'NO TALLER',
          });
          seen.add(key);
        }
      }
      
      // Caso 2: "Siniestros atendidos en red de talleres afiliados multimarca 10.00% del monto a indemnizar, mínimo US$ 150.00"
      const match2 = payload.match(/multimarca\s+(\d+(?:[\.,]\d+)?)%[^\d]*mínimo US\$ (\d+(?:[\.,]\d+)?)/i);
      if (match2 && match2[1] && match2[2]) {
        const numDed = Number(match2[1].replace(',', '.'));
        const numCop = Number(match2[2].replace(',', '.'));
        const deducible = !isNaN(numDed) ? numDed.toString() : '';
        const copago = !isNaN(numCop) ? numCop.toString() : '';
        const key = `${deducible}-${copago}-Multimarca-NO MARCA`;
        if (!seen.has(key)) {
          resultado.push({
            deducible,
            copago,
            moneda: 'USD',
            tipo: 'Multimarca',
            marca: 'NO MARCA',
            taller: 'NO TALLER',
          });
          seen.add(key);
        }
      }
      
      // Caso 3 y 4: "Marca Mercedes Benz, BMW, Audi: 20%...US$ 200.00" y "...15%...US$ 150.00...multimarca"
      const regexMarca = /Marca Mercedes Benz, BMW, Audi:\s*(\d+)%[^\d]*mínimo US\$ (\d+(?:[\.,]\d+)?)([\s\S]*?)(?=Por evento, Marca|$)/gi;
      let matchMarca;
      while ((matchMarca = regexMarca.exec(payload)) !== null) {
        if (matchMarca[1] && matchMarca[2]) {
          const numDed = Number(matchMarca[1]);
          const numCop = Number(matchMarca[2].replace(',', '.'));
          const deducible = !isNaN(numDed) ? numDed.toString() : '';
          const copago = !isNaN(numCop) ? numCop.toString() : '';
          const resto = matchMarca[3] || '';
          const esMultimarca = /multimarca/i.test(resto);
          const tipo = esMultimarca ? 'Multimarca' : 'NO TIPO';
          const marca = 'MERCEDES BENZ, BMW, AUDI';
          const key = `${deducible}-${copago}-${tipo}-${marca}`;
          if (!seen.has(key)) {
            resultado.push({
              deducible,
              copago,
              moneda: 'USD',
              tipo,
              marca,
              taller: 'NO TALLER',
            });
            seen.add(key);
          }
        }
      }
      break;
    }
    default: {
      obtenerDeducibleGenerico(payload, callback);
      return;
    }
  }
  callback(null, resultado);
}
