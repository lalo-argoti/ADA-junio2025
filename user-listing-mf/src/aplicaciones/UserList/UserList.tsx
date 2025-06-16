import React, { useEffect, useState } from 'react';

interface Company {
  codigo_company: string;
  name_company: string;
  description_company?: string;
  version?: string;
}

interface Props {
  onCompanySelect?: (company: Company) => void;
}

export const UserList: React.FC<Props> = ({ onCompanySelect }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const fetchCompanies = async () => {
    try {
      // Ajusta el endpoint para la API de company
      const res = await fetch(`http://localhost:8080/company?page=${page}&limit=${limit}&search=${search}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCompanies(data);
      console.log("Datos cargados correctamente");
    } catch (error) {
      console.error('Error al cargar compañías:', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [page, search]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Listado de Compañías</h2>
      <input
        type="text"
        value={search}
        placeholder="Buscar por código o nombre..."
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem' }}
      />
      <ul>
        {companies.map((company) => (
          <li key={company.codigo_company} onClick={() => onCompanySelect?.(company)}>
            {company.codigo_company} - {company.name_company} {company.version ? `(v${company.version})` : ''}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          ← Anterior
        </button>
        <span style={{ margin: '0 1rem' }}>Página {page}</span>
        <button onClick={() => setPage(page + 1)}>
          Siguiente →
        </button>
      </div>
    </div>
  );
};
