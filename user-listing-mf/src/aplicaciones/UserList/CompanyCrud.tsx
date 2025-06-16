import React, { useEffect, useState } from 'react';

interface Company {
  codigo_company: string;
  name_company: string;
  description_company?: string;
  version?: string;
}

export const CompanyCrud: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [form, setForm] = useState({ codigo_company: '', name_company: '', description_company: '' });
  const [message, setMessage] = useState<string | null>(null);

  // Cargar todas las compañías
  const fetchCompanies = async () => {
    try {
      const res = await fetch('http://localhost:8080/company');
      if (!res.ok) throw new Error('Error al cargar compañías');
      const data = await res.json();
      setCompanies(data);
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Seleccionar compañía y cargar para editar
  const selectCompany = async (codigo: string) => {
    try {
      const res = await fetch(`http://localhost:8080/company/${codigo}`);
      if (!res.ok) {
        setMessage('Compañía no encontrada');
        return;
      }
      const data = await res.json();
      setSelectedCompany(data);
      setForm({
        codigo_company: data.codigo_company,
        name_company: data.name_company,
        description_company: data.description_company || '',
      });
      setMessage(null);
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  // Manejar inputs formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear nueva compañía
  const createCompany = async () => {
    try {
      const res = await fetch('http://localhost:8080/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage('Compañía creada exitosamente');
      fetchCompanies();
      setForm({ codigo_company: '', name_company: '', description_company: '' });
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  // Actualizar compañía
  const updateCompany = async () => {
    if (!selectedCompany) return;
    try {
      const res = await fetch(`http://localhost:8080/company/${selectedCompany.codigo_company}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_company: form.name_company,
          description_company: form.description_company,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMessage('Compañía actualizada exitosamente');
      fetchCompanies();
      setSelectedCompany(null);
      setForm({ codigo_company: '', name_company: '', description_company: '' });
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

    const removeDuplicateCompanies = async () => {
    try {
        const res = await fetch('http://localhost:8080/company/duplicates', {
        method: 'DELETE',
        });
        if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
        }
        const msg = await res.text();
        setMessage(msg);
        fetchCompanies(); // Recargar la lista después de eliminar duplicados
    } catch (error) {
        setMessage(`Error eliminando duplicados: ${(error as Error).message}`);
    }
    };

  
  // Eliminar compañía
  const deleteCompany = async (codigo: string) => {
    if (!window.confirm('¿Seguro que desea eliminar esta compañía?')) return;
    try {
      const res = await fetch(`http://localhost:8080/company/${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      setMessage('Compañía eliminada exitosamente');
      fetchCompanies();
      if (selectedCompany?.codigo_company === codigo) {
        setSelectedCompany(null);
        setForm({ codigo_company: '', name_company: '', description_company: '' });
      }
    } catch (error) {
      setMessage(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>CRUD Compañías</h2>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div style={{ marginBottom: 20 }}>
        <input
          name="codigo_company"
          placeholder="Código"
          value={form.codigo_company}
          onChange={handleChange}
          disabled={!!selectedCompany} // No cambiar código al editar
          style={{ marginRight: 10 }}
        />
        <input
          name="name_company"
          placeholder="Nombre"
          value={form.name_company}
          onChange={handleChange}
          style={{ marginRight: 10 }}
        />
        <textarea
          name="description_company"
          placeholder="Descripción"
          value={form.description_company}
          onChange={handleChange}
          rows={2}
          style={{ verticalAlign: 'top', marginRight: 10 }}
        />
        {selectedCompany ? (
          <>
            <button onClick={updateCompany}>Actualizar</button>
            <button
              onClick={() => {
                setSelectedCompany(null);
                setForm({ codigo_company: '', name_company: '', description_company: '' });
                setMessage(null);
              }}
              style={{ marginLeft: 10 }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button onClick={createCompany}>Crear</button>
        )}
      </div>

      <table border={1} cellPadding={5} style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Versión</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.codigo_company}>
              <td>{c.codigo_company}</td>
              <td>{c.name_company}</td>
              <td>{c.description_company}</td>
              <td>{c.version || '-'}</td>
              <td>
                <button onClick={() => selectCompany(c.codigo_company)}>Editar</button>{' '}
                <button onClick={() => deleteCompany(c.codigo_company)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {companies.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center' }}>
                No hay compañías
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
