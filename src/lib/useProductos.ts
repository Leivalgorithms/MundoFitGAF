import { useEffect, useState } from 'react';
import type { Entry, EntrySkeletonType } from 'contentful';
import { client } from './contentful';

interface ProductoFields {
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  slug: string;
  especificaciones: string;
  imagenes: {
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

type Producto = Entry<ProductoSkeleton>;

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
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