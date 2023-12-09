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
    <div className='pr-8 py-8'>
      <h1 className='ml-8 text-xl mb-4'>{message.subject}</h1>

      <MessageView message={message} messages={messages} />
    </div>
  );
};

export default ThreadView;
