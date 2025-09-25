
import React, { useState } from 'react';
import { Star, Trash2, MoreHorizontal, Reply, ArrowLeft, Download, Send } from 'lucide-react';
import TranslationTabs from '../components/TranslationTabs';

const ContactScreen = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [viewSubmission, setViewSubmission] = useState(null);

  const initialSubmissions = [
    { id: 1, name: 'John Doe', email: 'john@example.com', subject: 'Product Inquiry', message: 'I would like to know more about your cotton products. Do you have any organic cotton options available?', date: '2023-05-15', isStarred: false, status: 'unread' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', subject: 'Partnership Opportunity', message: 'We are interested in becoming a distributor of your products.', date: '2023-05-14', isStarred: true, status: 'read' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', subject: 'Technical Support', message: 'I need assistance with one of your textile machines.', date: '2023-05-12', isStarred: false, status: 'read' },
  ];
  
  const [formSubmissions, setFormSubmissions] = useState(initialSubmissions);

  const handleViewSubmission = (submission) => {
    setViewSubmission(submission);
    if(submission.status === 'unread') {
      setFormSubmissions(subs => subs.map(s => s.id === submission.id ? {...s, status: 'read'} : s));
    }
  };
  
  const handleReply = (id) => {
    console.log(`Replying to submission ${id}: ${replyMessage}`);
    setShowReplyForm(null);
    setReplyMessage('');
  };
  
  const inputClasses = "block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  
  const contactPageContent = {
    main_title: { en: 'Contact Us Today', vn: 'Liên hệ với chúng tôi ngay hôm nay' },
    introduction_text: { en: 'We are here to answer any questions you may have.', vn: 'Chúng tôi ở đây để trả lời bất kỳ câu hỏi nào bạn có.' },
    address: { en: '123 Textile Street, HCMC, Vietnam', vn: '123 Đường Dệt May, TP.HCM, Việt Nam' },
    phone_number: '+84 28 1234 5678',
    email_address: 'info@cotco.com',
  };


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Contact Management</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage contact page content and form submissions</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex" aria-label="Tabs">
            <button onClick={() => setActiveTab('page')} className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'page' ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'}`}>Contact Page</button>
            <button onClick={() => setActiveTab('submissions')} className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'submissions' ? 'border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500'}`}>Form Submissions</button>
          </nav>
        </div>
        
        <div className="p-6">
            {activeTab === 'page' ? (
                <div>
                     <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Contact Page Content</h3>
                     {/* In a real app this would be a form, here it's a display */}
                     <div className="space-y-4">
                        <div><label className={labelClasses}>Main Title (EN)</label><input type="text" className={inputClasses} value={contactPageContent.main_title.en} readOnly/></div>
                        <div><label className={labelClasses}>Address (EN)</label><input type="text" className={inputClasses} value={contactPageContent.address.en} readOnly/></div>
                        <div><label className={labelClasses}>Phone</label><input type="text" className={inputClasses} value={contactPageContent.phone_number} readOnly/></div>
                        <div><label className={labelClasses}>Email</label><input type="text" className={inputClasses} value={contactPageContent.email_address} readOnly/></div>
                         <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                             <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Edit Page Content</button>
                         </div>
                     </div>
                </div>
            ) : viewSubmission ? (
                <div>
                  <button onClick={() => setViewSubmission(null)} className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4">
                    <ArrowLeft size={16} className="mr-1" /> Back to Inbox
                  </button>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-lg font-semibold">{viewSubmission.subject}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">From: {viewSubmission.name} &lt;{viewSubmission.email}&gt;</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{viewSubmission.date}</p>
                    </div>
                    <div className="p-4 whitespace-pre-wrap">{viewSubmission.message}</div>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <textarea className={`${inputClasses} mb-2`} placeholder="Type your reply..." rows={4} value={replyMessage} onChange={e => setReplyMessage(e.target.value)}></textarea>
                      <div className="flex justify-end">
                        <button onClick={() => handleReply(viewSubmission.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"><Send size={16} className="mr-2"/> Send Reply</button>
                      </div>
                    </div>
                  </div>
                </div>
            ) : (
                <div>
                     <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Inbox</h3>
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {formSubmissions.map(sub => (
                             <tr key={sub.id} onClick={() => handleViewSubmission(sub)} className={`cursor-pointer ${sub.status === 'unread' ? 'bg-indigo-50 dark:bg-gray-900/50' : ''} hover:bg-gray-100 dark:hover:bg-gray-700/50`}>
                               <td className="px-4 py-3 w-12 text-center">
                                 <button className={`${sub.isStarred ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500'}`}><Star size={18} fill={sub.isStarred ? 'currentColor' : 'none'} /></button>
                               </td>
                               <td className={`px-4 py-3 w-48 font-medium ${sub.status === 'unread' ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>{sub.name}</td>
                               <td className={`px-4 py-3 ${sub.status === 'unread' ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{sub.subject}</td>
                               <td className="px-4 py-3 w-32 text-right text-sm text-gray-500 dark:text-gray-400">{sub.date}</td>
                             </tr>
                          ))}
                        </tbody>
                     </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;