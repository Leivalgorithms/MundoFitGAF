import { useEffect, useState } from 'react';
import type { EntrySkeletonType } from 'contentful';
import { client } from './contentful';

interface TestimonioFields {
  name?: string;
  role?: string;
  quote?: string;
  rating?: number;
  avatar?: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  featured?: boolean;
}

interface TestimonioSkeleton extends EntrySkeletonType {
  contentTypeId: 'testimonial';
  fields: TestimonioFields;
}

export function useTestimonios(soloDestacados = false) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testimonios, setTestimonios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query: Record<string, unknown> = { content_type: 'testimonial' };
    if (soloDestacados) query['fields.featured'] = true;

    client.getEntries<TestimonioSkeleton>(query)
      .then(res => {
        setTestimonios(res.items);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [soloDestacados]);

  return { testimonios, loading, error };
}