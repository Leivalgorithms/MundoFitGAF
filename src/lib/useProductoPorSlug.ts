import { useEffect, useState } from 'react';
import type { EntrySkeletonType } from 'contentful';
import { client } from './contentful';

interface ProductoFields {
  nombre?: string;
  descripcion?: unknown;
  categoria?: string;
  marca?: string;
  slug?: string;
  especificaciones?: string;
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

export function useProductoPorSlug(slug: string | undefined) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [producto, setProducto] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Slug no proporcionado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    client
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .getEntries<ProductoSkeleton>({
        content_type: 'productos',
        'fields.slug': slug,
        limit: 1,
      } as any)
      .then((res) => {
        if (res.items.length === 0) {
          setError('Producto no encontrado');
        } else {
          setProducto(res.items[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { producto, loading, error };
}
