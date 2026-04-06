import { useEffect, useState } from 'react';
import type { EntrySkeletonType } from 'contentful';
import { client } from './contentful';

interface ProductoFields {
  nombre?: string;
  descripcion?: any;
  categoria?: string;
  marca?: string;
  slug?: string;
  especificaciones?: string;
  caracteristicas?: string[];
  imagenes?: {
    fields: {
      file: {
        url: string;
      };
    };
  }[];
}

interface ProductoSkeleton extends EntrySkeletonType {
  contentTypeId: 'productos';
  fields: ProductoFields;
}

export function useProductos() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client.getEntries<ProductoSkeleton>({ content_type: 'productos' })
      .then(res => {
        setProductos(res.items);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { productos, loading, error };
}