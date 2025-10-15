# 🚀 Búsqueda de Talleres - Rimac Seguros

## 📋 Proyecto para medición del nivel de expertise 2025

Serverless Framework con TypeScript para extracción inteligente de deducibles desde texto.

---

## 🧪 Pruebas Realizadas

<img width="737" height="489" alt="test-total" src="https://github.com/user-attachments/assets/fa72e9d8-138a-4c77-9065-a008a60631b4" />

Como se puede visualizar fueron testeadas **10 deducibles** con un resultado exitoso. Se adjuntan las pruebas realizadas al endpoint desplegado en AWS:

---

## ⚙️ Ejecutando las pruebas

### 📌 Lógica Genérica

Se encontró un patrón para realizar una lógica genérica para **6 tipos de deducibles** (D10, D22, D85, D86, D88, D6007)

#### **Prueba D10:**
<img width="642" height="416" alt="D10" src="https://github.com/user-attachments/assets/98faec9b-aa08-489f-939c-56548aa8fe3e" />

#### **Prueba D22:**
<img width="632" height="407" alt="D22" src="https://github.com/user-attachments/assets/d360739c-3905-4347-b23b-7892e71febf3" />

#### **Prueba D85:**
<img width="634" height="412" alt="D85" src="https://github.com/user-attachments/assets/c654848e-92e9-4b14-ac80-d8a6914dca2d" />

#### **Prueba D86:**
<img width="643" height="415" alt="D86" src="https://github.com/user-attachments/assets/c9dd061b-114c-4069-a0d5-eddd6f0f8b92" />

#### **Prueba D88:**
<img width="631" height="410" alt="D88" src="https://github.com/user-attachments/assets/caf37e6a-9642-4da5-9b28-1ed45ba81b3c" />

#### **Prueba D6007:**
<img width="637" height="414" alt="D6007" src="https://github.com/user-attachments/assets/24aa7860-0b99-4453-99de-0d46180c37e6" />

---

### 📌 Lógica Específica

Para los **4 tipos de deducibles restantes** (D314, D1256, D4514, D5936), no se encontró un patrón general, por tal motivo necesita recibir el código para realizar la lógica específica.

#### **Prueba D314:**
<img width="646" height="421" alt="D314" src="https://github.com/user-attachments/assets/2daa84aa-1841-49b1-9243-ebff52d14b46" />

#### **Prueba D1256:**
<img width="644" height="415" alt="D1256" src="https://github.com/user-attachments/assets/64a55671-d512-4cd7-b108-c1eceacfeb2e" />

#### **Prueba D4514:**
<img width="638" height="415" alt="D4514" src="https://github.com/user-attachments/assets/f0361422-a00d-43e9-8136-9de9872b48e0" />

#### **Prueba D5936:**
<img width="638" height="410" alt="D5936" src="https://github.com/user-attachments/assets/35e4d457-c136-4e6d-81f7-ca05dd916d37" />

---

## 🛠️ Tecnologías utilizadas

- **AWS Lambda** - Funciones serverless
- **API Gateway** - Gestión de endpoints HTTP
- **TypeScript** - Tipado estático y mejor mantenibilidad
- **Serverless Framework** - Despliegue y gestión de infraestructura
- **Jest** - Framework de testing

---

## 📦 Estructura del proyecto

```
├── dao/              # Lógica de acceso a datos y extracción
├── test/             # Tests unitarios (10 casos)
├── util/             # Utilidades y constantes
├── handler.ts        # Handler principal de Lambda
├── serverless.yml    # Configuración de Serverless Framework
└── tsconfig.json     # Configuración de TypeScript
```

---

## 🚀 Ejecutar localmente

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar tests
npm test

# Iniciar servidor local
npm run dev
```

---

## 📝 Formato de entrada API

```json
{
  "text": "Por evento 15% del monto a indemnizar, mínimo US$ 150.00",
  "codigo": "D6007"
}
```

**Nota:** El campo `codigo` es opcional. Si no se especifica, se usará la lógica genérica.

---

## ✅ Resultados de tests

**10/10 tests passing** ✨

- ✅ D10 - Lógica genérica
- ✅ D22 - Lógica genérica
- ✅ D85 - Lógica genérica
- ✅ D86 - Lógica genérica
- ✅ D88 - Lógica genérica
- ✅ D6007 - Lógica genérica
- ✅ D314 - Lógica específica (requiere código)
- ✅ D1256 - Lógica específica (requiere código)
- ✅ D4514 - Lógica específica (requiere código)
- ✅ D5936 - Lógica específica (requiere código)

---

## 👨‍💻 Autor

**Pedro Infante Garcia**  
**Proyecto:** Búsqueda de Talleres - Rimac Seguros  
**Año:** 2025


