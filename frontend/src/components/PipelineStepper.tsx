const STAGES = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
] as const;

export default function PipelineStepper({
  status,
  onChange,
}: {
  status: string;
  onChange: (status: string) => void;
}) {
  return (
    <div className="pipeline">
      {STAGES.map((stage) => (
        <button
          key={stage.key}
          type="button"
          className={`pipeline-stage ${status === stage.key ? `active-${stage.key}` : ''}`}
          onClick={() => onChange(stage.key)}
        >
          {stage.label}
        </button>
      ))}
    </div>
  );
}
