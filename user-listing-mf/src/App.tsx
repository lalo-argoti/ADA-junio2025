import { useState } from 'react';
import './App.css';
import { UserList } from './aplicaciones/UserList/UserList';
import { CompanyCrud } from './aplicaciones/UserList/CompanyCrud';

interface Company {
  codigo_company: string;
  name_company: string;
  description_company?: string;
  version?: string;
}

// Set de caracteres permitidos para palabra aleatoria
const allowedChars = new Set([
  'w','e','r','f','b','h','j','i','u','y','t','r','e','d','f','g','y','u','i','o',
  'l','k','m','n','b','v','f','r','e','w','s','x','f','g','y','u','i','k','m','n',
  'b','v','f','r','e','w','w','r','t','y','u','i','o','k','m','n','b','v','w','s',
  'x','c','f','g','h','u','i','o','p','l','k','n','b','v','f','d','e','w','a','z',
  'x','c','g','h','u','i','o','p','u','y','t','r','e','w','q','s','d','f','g','k',
  'j','v','c','x'
]);

function App() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [randomWord, setRandomWord] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Generar palabra aleatoria validando caracteres
  const generateRandomWord = () => {
    // Palabras de ejemplo, podrían venir de otra fuente
    const words = ['sol', 'luna', 'estrella', 'mar', 'montaña', 'nube'];
    // Filtrar palabras que sólo contienen allowedChars
    const filtered = words.filter(word =>
      [...word].every(ch => allowedChars.has(ch.toLowerCase()))
    );
    if (filtered.length === 0) {
      setErrorMsg('No hay palabras válidas para generar');
      setRandomWord(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setRandomWord(filtered[randomIndex]);
    setErrorMsg(null);
  };

   const removeDuplicateCompanies = async () => {
  try {
    const res = await fetch('http://localhost:8080/company/duplicates', {
      method: 'DELETE',
    });
    const text = await res.text();

    alert(text);
  } catch (error) {
    alert('Error al eliminar duplicados: ' + error.message);
  }

  };

  return (
    <div>
      <h1>Mi Aplicación</h1>

      {/* Botones */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setShowCalculator(prev => !prev)}>
          {showCalculator ? 'Cerrar Calculadora' : 'Abrir Calculadora'}
        </button>
        <button onClick={generateRandomWord} style={{ marginLeft: '1rem' }}>
          Generar palabra aleatoria
        </button>
        <button onClick={removeDuplicateCompanies} style={{ marginLeft: '1rem', backgroundColor: '#f44336', color: 'white' }}>
          Eliminar empresas repetidas
        </button>
      </div>

      {/* Mensajes */}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {randomWord && <p>Palabra aleatoria generada: <strong>{randomWord}</strong></p>}

      {/* Calculadora */}
      {showCalculator && (
        <div style={{ border: '1px solid #ccc', padding: '1rem', maxWidth: '220px', marginBottom: '1rem' }}>
          <Calculator setErrorMsg={setErrorMsg} />
        </div>
      )}

      {/* Lista o CRUD */}
      {!selectedCompany ? (
        <UserList onCompanySelect={company => setSelectedCompany(company)} />
      ) : (
        <div>
          <button onClick={() => setSelectedCompany(null)}>← Volver a lista</button>
          <CompanyCrud codigo_company={selectedCompany.codigo_company} />
        </div>
      )}
    </div>
  );
}

// Calculadora con raíz cuadrada y validaciones
const Calculator = ({ setErrorMsg }: { setErrorMsg: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const [input, setInput] = useState('');

  const handleClick = (val: string) => {
    setInput(prev => prev + val);
    setErrorMsg(null);
  };

  const handleClear = () => {
    setInput('');
    setErrorMsg(null);
  };

  const handleCalculate = () => {
    try {
      setErrorMsg(null);

      // Validar divisor cero:
      if (/(\/0(?!\d))/.test(input)) {
        setErrorMsg('Error: No se puede dividir por cero.');
        return;
      }

      // Validar raíz cuadrada (si hay raíz de negativo)
      if (input.includes('√')) {
        const regex = /√(-?\d+(\.\d+)?)/g;
        let match;
        while ((match = regex.exec(input)) !== null) {
          const num = parseFloat(match[1]);
          if (num < 0) {
            setErrorMsg('Error: No se puede calcular raíz cuadrada de número negativo.');
            return;
          }
        }
      }

      // Reemplazar raíz cuadrada por Math.sqrt para eval
      const replacedInput = input.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

      // eslint-disable-next-line no-eval
      const result = eval(replacedInput);

      setInput(result.toString());
    } catch {
      setErrorMsg('Error en la expresión');
    }
  };

  return (
    <div>
      <input type="text" value={input} readOnly style={{ width: '100%', marginBottom: '0.5rem' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {'1234567890+-*/.'.split('').map(char => (
          <button key={char} onClick={() => handleClick(char)} style={{ flex: '1 0 20%' }}>
            {char}
          </button>
        ))}
        <button onClick={() => handleClick('√')} style={{ flex: '1 0 20%', backgroundColor: '#2196F3', color: 'white' }}>
          √
        </button>
        <button onClick={handleClear} style={{ flex: '1 0 45%', backgroundColor: '#f44336', color: 'white' }}>
          C
        </button>
        <button onClick={handleCalculate} style={{ flex: '1 0 45%', backgroundColor: '#4CAF50', color: 'white' }}>
          =
        </button>
      </div>
    </div>
  );
};

export default App;
