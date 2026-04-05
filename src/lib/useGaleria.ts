import { useEffect, useState } from 'react';
import { client } from './contentful';

export function useGaleria() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client.getEntries({ content_type: 'galeria' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        setProyectos(res.items);
        setLoading(false);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { proyectos, loading, error };
}