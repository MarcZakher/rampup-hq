interface TrainingHeaderProps {
  title: string;
  description: string;
}

export function TrainingHeader({ title, description }: TrainingHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}