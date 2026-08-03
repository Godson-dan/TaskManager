import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import PipelineStepper from '../components/PipelineStepper';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const created = await api.createTask({ title });
    setTasks((prev) => [created, ...prev]);
    setTitle('');
  };

  const handleStatusChange = async (id: string, status: string) => {
    const updated = await api.updateTask(id, { status });
    setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
  };

  const handleDelete = async (id: string) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="main">
      <div className="page-header">
        <h1>Tasks</h1>
        <span className="count">{tasks.length} in queue</span>
      </div>

      <form className="new-task-form" onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Add a task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading…</div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">No tasks yet. Add your first one above.</div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-card" key={task._id}>
              <div className="task-top">
                <div>
                  <p className="task-title">{task.title}</p>
                  {task.description && <p className="task-desc">{task.description}</p>}
                </div>
                <div className="task-actions">
                  <button className="icon-btn" onClick={() => handleDelete(task._id)}>
                    Delete
                  </button>
                </div>
              </div>
              <PipelineStepper
                status={task.status}
                onChange={(status) => handleStatusChange(task._id, status)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
