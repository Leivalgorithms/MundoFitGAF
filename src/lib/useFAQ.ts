import { useEffect, useState } from 'react';
import type { EntrySkeletonType } from 'contentful';
import { client } from './contentful';

interface FAQCategoryFields {
  titulo?: string;
  orden?: number;
}

interface FAQCategorySkeleton extends EntrySkeletonType {
  contentTypeId: 'faqCategory';
  fields: FAQCategoryFields;
}

interface FAQItemFields {
  pregunta?: string;
  respuesta?: string;
  orden?: number;
  categoria?: {
    sys: { id: string };
    fields: FAQCategoryFields;
  };
}

interface FAQItemSkeleton extends EntrySkeletonType {
  contentTypeId: 'faqItem';
  fields: FAQItemFields;
}

export interface FAQItemMapped {
  id: string;
  pregunta: string;
  respuesta: string;
  orden: number;
}

export interface FAQCategoryMapped {
  id: string;
  titulo: string;
  orden: number;
  items: FAQItemMapped[];
}

export function useFAQ() {
  const [categories, setCategories] = useState<FAQCategoryMapped[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      client.getEntries<FAQCategorySkeleton>({ content_type: 'faqCategory' }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      client.getEntries<FAQItemSkeleton>({ content_type: 'faqItem', include: 1 } as any),
    ])
      .then(([catRes, itemRes]) => {
        const cats: FAQCategoryMapped[] = catRes.items
          .map((cat) => ({
            id: cat.sys.id,
            titulo: cat.fields.titulo ?? '',
            orden: cat.fields.orden ?? 0,
            items: itemRes.items
              .filter((item) => {
                const ref = item.fields.categoria as any;
                return ref?.sys?.id === cat.sys.id;
              })
              .map((item) => ({
                id: item.sys.id,
                pregunta: item.fields.pregunta ?? '',
                respuesta: item.fields.respuesta ?? '',
                orden: item.fields.orden ?? 0,
              }))
              .sort((a, b) => a.orden - b.orden),
          }))
          .sort((a, b) => a.orden - b.orden);

        setCategories(cats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { categories, loading, error };
}