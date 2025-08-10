export function AdminHeaderPages({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        {title}
      </h1>
      <h2 className="text-muted-foreground mb-2 mt-1">{description}</h2>
    </div>
  );
}
