import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  LayoutGrid,
  List as ListIcon,
  Tag,
  User,
  ArrowUpDown
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Task, TaskStatus, PriorityLevel, TaskCategory } from '../types';
import { getTodayString, isDatePast, formatDisplayDate } from '../utils/dateUtils';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    clients
  } = useWorkspace();

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [client, setClient] = useState(clients[0]?.name || 'Internal');
  const [assignee, setAssignee] = useState('Alex Morgan');
  const [category, setCategory] = useState<TaskCategory>('Administrative');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setStatus('To Do');
    setPriority('Medium');
    setDueDate(getTodayString());
    setClient(clients[0]?.name || 'Internal');
    setAssignee('Alex Morgan');
    setCategory('Administrative');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setClient(task.client);
    setAssignee(task.assignee);
    setCategory(task.category);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Task title is required.');
      return;
    }

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
        client,
        assignee: assignee.trim() || 'Alex Morgan',
        category
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
        client,
        assignee: assignee.trim() || 'Alex Morgan',
        category
      });
    }
    setModalOpen(false);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesClient = clientFilter === 'all' || t.client === clientFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesClient;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (sortBy === 'priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    return a.title.localeCompare(b.title);
  });

  const kanbanColumns: TaskStatus[] = ['To Do', 'In Progress', 'Waiting', 'Completed'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Task Management</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Organize administrative deliverables, track client requests, and manage blockers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              aria-label="Kanban view"
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E2D5] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title, description, client, assignee..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting">Waiting</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span>Client:</span>
              <select
                value={clientFilter}
                onChange={e => setClientFilter(e.target.value)}
                className="bg-transparent border-0 font-medium text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="all">All Clients</option>
                {clients.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent border-0 font-medium text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          <span>Showing {sortedTasks.length} of {tasks.length} tasks</span>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-xl border border-[#E8E2D5] shadow-xs overflow-hidden">
          {sortedTasks.length === 0 ? (
            <div className="p-12 text-center text-stone-400 text-sm">
              <p>No tasks match the selected criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {sortedTasks.map(task => {
                const isOverdue = task.status !== 'Completed' && isDatePast(task.dueDate);
                return (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-[#FAF8F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleTaskComplete(task.id)}
                        className="mt-0.5 text-stone-400 hover:text-amber-800 transition-colors cursor-pointer"
                        aria-label={`Toggle completion for ${task.title}`}
                      >
                        {task.status === 'Completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-800" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300 group-hover:border-amber-700" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm font-semibold ${
                              task.status === 'Completed' ? 'line-through text-stone-400' : 'text-stone-900'
                            }`}
                          >
                            {task.title}
                          </h3>

                          {isOverdue && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-bold rounded">
                              <AlertTriangle className="w-3 h-3 text-amber-800" />
                              Overdue
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              task.status === 'Completed'
                                ? 'bg-stone-100 text-stone-500'
                                : task.status === 'In Progress'
                                ? 'bg-amber-100 text-amber-900'
                                : task.status === 'Waiting'
                                ? 'bg-amber-50 text-amber-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-500">
                          <span className="flex items-center gap-1 font-medium text-stone-700">
                            <Tag className="w-3 h-3 text-stone-400" />
                            {task.client}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-stone-400" />
                            {task.assignee}
                          </span>
                          <span>•</span>
                          <span className={`flex items-center gap-1 ${isOverdue ? 'text-amber-800 font-bold' : ''}`}>
                            <Clock className="w-3 h-3" />
                            Due {formatDisplayDate(task.dueDate)}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] text-stone-400">
                            {task.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                          task.priority === 'High'
                            ? 'bg-amber-100 text-amber-950'
                            : task.priority === 'Medium'
                            ? 'bg-stone-100 text-stone-700'
                            : 'bg-stone-50 text-stone-500'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditModal(task)}
                        className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
                        aria-label="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskToDelete(task.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanbanColumns.map(colStatus => {
            const columnTasks = sortedTasks.filter(t => t.status === colStatus);
            return (
              <div
                key={colStatus}
                className="bg-[#FAF7F2] rounded-xl border border-[#E8E2D5] p-3.5 flex flex-col min-h-[420px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">{colStatus}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-stone-600 font-semibold border border-stone-200">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {columnTasks.map(task => {
                    const isOverdue = task.status !== 'Completed' && isDatePast(task.dueDate);
                    return (
                      <div
                        key={task.id}
                        className="p-3 bg-white rounded-lg border border-stone-200 shadow-2xs hover:border-amber-300 transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              task.priority === 'High'
                                ? 'bg-amber-100 text-amber-950'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {task.priority}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openEditModal(task)}
                              className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setTaskToDelete(task.id)}
                              className="text-stone-400 hover:text-rose-600 p-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-stone-900 leading-snug">{task.title}</h4>

                        <div className="text-[11px] text-stone-500 space-y-1">
                          <p className="font-medium text-stone-700">{task.client}</p>
                          <div className="flex items-center justify-between">
                            <span className={isOverdue ? 'text-amber-800 font-bold' : ''}>
                              {formatDisplayDate(task.dueDate)}
                            </span>
                            {isOverdue && (
                              <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold">
                                Overdue
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <select
                            value={task.status}
                            onChange={e => updateTask({ ...task, status: e.target.value as TaskStatus })}
                            className="text-[10px] font-medium bg-[#FAF8F5] border border-stone-200 rounded px-1.5 py-0.5 text-stone-700 focus:outline-none cursor-pointer"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Waiting">Waiting</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Task Title <span className="text-amber-700">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Draft executive board summary briefing"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Client</label>
              <select
                value={client}
                onChange={e => setClient(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
                <option value="Internal">Internal Operations</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Administrative">Administrative</option>
                <option value="Scheduling">Scheduling</option>
                <option value="Travel">Travel</option>
                <option value="Finance">Finance</option>
                <option value="Email">Email</option>
                <option value="Research">Research</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Waiting">Waiting</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Assignee</label>
            <input
              type="text"
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              placeholder="Alex Morgan"
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Context</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add key milestones, links, dependencies..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs cursor-pointer"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) deleteTask(taskToDelete);
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action is permanent."
        confirmLabel="Delete Task"
      />
    </div>
  );
};
