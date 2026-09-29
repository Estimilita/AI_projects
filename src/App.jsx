import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Trash2,
  X,
  ListTodo,
  Eraser,
} from 'lucide-react'

const STORAGE_KEY = 'todo-app-tasks'

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false, createdAt: new Date().toISOString() },
    ])
    setInput('')
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const startEdit = (task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  const saveEdit = (id) => {
    const text = editText.trim()
    if (!text) return
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)))
    setEditingId(null)
    setEditText('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed))
  }

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.length - activeCount

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-10 px-4">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center justify-center rounded-2xl bg-indigo-600 p-3 shadow-lg shadow-indigo-200">
            <ListTodo className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            To-Do List
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
          </p>
        </div>

        <form onSubmit={addTask} className="mb-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-5 w-5" />
            Add
          </button>
        </form>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
                  filter === f
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-red-500"
            >
              <Eraser className="h-4 w-4" />
              Clear completed
            </button>
          )}
        </div>

        <div className="space-y-2">
          {filteredTasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white/50 py-12 text-center">
              <p className="text-gray-400">
                {filter === 'all'
                  ? 'No tasks yet. Add one above!'
                  : filter === 'active'
                    ? 'No active tasks.'
                    : 'No completed tasks.'}
              </p>
            </div>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="shrink-0 text-gray-300 transition hover:text-indigo-500"
                aria-label={task.completed ? 'Mark as active' : 'Mark as complete'}
              >
                {task.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-indigo-500" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>

              {editingId === task.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task.id)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                    className="flex-1 rounded-lg border border-indigo-200 bg-indigo-50/50 px-3 py-1.5 text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="rounded-lg bg-indigo-600 p-1.5 text-white transition hover:bg-indigo-700"
                    aria-label="Save"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="rounded-lg bg-gray-100 p-1.5 text-gray-500 transition hover:bg-gray-200"
                    aria-label="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 text-left transition ${
                      task.completed
                        ? 'text-gray-400 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>
                  <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(task)}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-indigo-600"
                      aria-label="Edit task"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {tasks.length > 0 && (
          <p className="mt-6 text-center text-xs text-gray-400">
            {tasks.length} total &middot; {activeCount} active &middot;{' '}
            {completedCount} completed
          </p>
        )}
      </div>
    </div>
  )
}

export default App
