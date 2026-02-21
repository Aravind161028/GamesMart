import { useAuth } from '../../context/AuthContext';
import { Mail, Trash, CheckCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';

const Inbox = () => {
  const { tickets, updateTicketStatus, deleteTicket } = useAuth();

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Mail size={20} /> Support Inbox
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {tickets.filter(t => t.status === 'new').length} New
          </span>
        </h2>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No messages yet.</div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className={`p-6 ${ticket.status === 'new' ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{ticket.name}</h4>
                  <p className="text-xs text-gray-500">{ticket.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => deleteTicket(ticket.id)} className="text-gray-400 hover:text-red-500">
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              
              {ticket.gameName && (
                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wide">
                  Request: {ticket.gameName}
                </div>
              )}
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-white dark:bg-dark-bg p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                {ticket.message}
              </p>

              <div className="flex gap-2">
                {ticket.status === 'new' && (
                  <Button size="sm" onClick={() => updateTicketStatus(ticket.id, 'read')} className="gap-1">
                    <CheckCircle size={14} /> Mark Read
                  </Button>
                )}
                <div className="ml-auto flex items-center gap-2">
                   <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${
                     ticket.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                   }`}>
                     {ticket.status}
                   </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Inbox;
