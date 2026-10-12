import React, { useState } from 'react';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  Briefcase,
  Edit2,
  Trash2,
  User,
  Filter
} from 'lucide-react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Contact } from '../types';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const ContactsPage: React.FC = () => {
  const {
    contacts,
    addContact,
    updateContact,
    deleteContact
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'Client' | 'Vendor' | 'Executive' | 'Partner' | 'Personal'>('Client');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const openCreateModal = () => {
    setEditingContact(null);
    setName('');
    setJobTitle('');
    setCompany('');
    setEmail('');
    setPhone('');
    setCategory('Client');
    setNotes('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setJobTitle(contact.jobTitle);
    setCompany(contact.company);
    setEmail(contact.email);
    setPhone(contact.phone);
    setCategory(contact.category);
    setNotes(contact.notes);
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Contact name is required.');
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address (e.g., name@domain.com).');
      return;
    }

    if (editingContact) {
      updateContact({
        ...editingContact,
        name: name.trim(),
        jobTitle: jobTitle.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        category,
        notes: notes.trim()
      });
    } else {
      addContact({
        name: name.trim(),
        jobTitle: jobTitle.trim(),
        company: company.trim() || 'Independent',
        email: email.trim(),
        phone: phone.trim(),
        category,
        notes: notes.trim()
      });
    }
    setModalOpen(false);
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">Executive Directory</h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Centralized stakeholder directory for executives, clients, legal partners, and preferred vendors.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E8E2D5] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, email, position..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="Client">Clients</option>
              <option value="Executive">Executives</option>
              <option value="Partner">Partners</option>
              <option value="Vendor">Vendors</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-500">
          <span>Showing {filteredContacts.length} directory contacts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="bg-white rounded-xl border border-[#E8E2D5] hover:border-amber-300 transition-colors p-4 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    contact.category === 'Executive'
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : contact.category === 'Client'
                      ? 'bg-amber-50 text-amber-800'
                      : contact.category === 'Partner'
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {contact.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(contact)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
                    title="Edit contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactToDelete(contact.id)}
                    className="p-1 text-stone-400 hover:text-rose-700 rounded cursor-pointer"
                    title="Delete contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-stone-900 text-base">{contact.name}</h3>
                <p className="text-xs text-stone-600 font-medium">{contact.jobTitle}</p>
                <p className="text-xs text-stone-400">{contact.company}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-stone-700 hover:text-amber-800 truncate"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="text-stone-700">{contact.phone}</span>
                  </div>
                )}
              </div>

              {contact.notes && (
                <p className="text-xs text-stone-500 pt-1.5 border-t border-stone-100 line-clamp-2">
                  {contact.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
        maxWidth="lg"
      >
        <form onSubmit={handleSaveContact} className="space-y-4">
          {formError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Name <span className="text-amber-700">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="Managing Partner"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Apex Horizon Capital"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700 bg-white"
              >
                <option value="Client">Client</option>
                <option value="Executive">Executive</option>
                <option value="Partner">Partner</option>
                <option value="Vendor">Vendor</option>
                <option value="Personal">Personal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="m.vance@company.com"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+44 20 7946 0192"
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Executive Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Working style, preferred assistant communication, dietary restrictions..."
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
              {editingContact ? 'Save Changes' : 'Save Contact'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(contactToDelete)}
        onClose={() => setContactToDelete(null)}
        onConfirm={() => {
          if (contactToDelete) deleteContact(contactToDelete);
        }}
        title="Delete Contact"
        message="Are you sure you want to remove this contact from your workspace directory?"
        confirmLabel="Delete Contact"
      />
    </div>
  );
};
