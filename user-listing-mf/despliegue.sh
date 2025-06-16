#!/bin/bash

mkdir -p src/aplicaciones/UserList

cat > src/aplicaciones/UserList/UserList.tsx << 'EOF'
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Props {
  onUserSelect?: (user: User) => void;
}

export const UserList: React.FC<Props> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const fetchUsers = async () => {
    try {
      const res = await fetch(\`http://localhost:3001/api/users?page=\${page}&limit=\${limit}&search=\${search}\`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc' }}>
      <h2>Listado de Usuarios</h2>
      <input
        type="text"
        value={search}
        placeholder="Buscar por nombre..."
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem' }}
      />
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => onUserSelect?.(user)}>
            {user.first_name} {user.last_name} - {user.email}
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
EOF

echo "✅ Microfrontend 'UserList' creado en src/aplicaciones/UserList/UserList.tsx"
