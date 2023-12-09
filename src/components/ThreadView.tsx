import { getThreadMessages } from '@/utils/data';
import MessageView from './MessageView';
interface ThreadViewProps {
  threadId?: string;
}

const ThreadView = async ({ threadId }: ThreadViewProps) => {
  if (!threadId) {
    return null;
  }

  const messages = await getThreadMessages(threadId);
  const message = messages.find((m) => m.id === threadId)!;

  return (
    <div className='pr-12 pl-4 pt-8 pb-16 bg-teal-50'>
      <h1 className='ml-6 text-2xl mb-8 font-medium'>{message.subject}</h1>

      <MessageView message={message} messages={messages} />
    </div>
  );
};

export default ThreadView;
