import { getThreadMessages } from '@/utils/data';
import MessageView from './MessageView';
import Link from 'next/link';
interface ThreadViewProps {
  threadId?: string;
}

const ThreadView = async ({ threadId }: ThreadViewProps) => {
  if (!threadId) {
    return null;
  }

  const messages = await getThreadMessages(threadId);
  const message = messages.find((m) => m.id === threadId)!;
  const href = `https://www.postgresql.org/message-id/${threadId}`;

  return (
    <div className='pr-12 pl-4 pt-8 pb-8 bg-slate-100 min-h-screen'>
      <h1 className='ml-8 text-2xl mb-8 font-medium'>{message.subject}</h1>

      <MessageView message={message} messages={messages} />
      <div className='ml-8 mt-12 text-sm font-medium'>
        Source:{' '}
        <Link href={href} className='text-slate-500'>
          {href}
        </Link>
      </div>
    </div>
  );
};

export default ThreadView;
