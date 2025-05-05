'use client';

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Description</h2>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
}
