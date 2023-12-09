import sanitizeHtml from 'sanitize-html';

function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
  return formattedDate;
}

interface Message {
  id: string;
  from: string;
  ts: Date;
  body: string;
  inReplyTo: string | null;
}

interface MessageViewProps {
  message: Message;
  messages: Message[];
}

const MessageView = ({ message, messages }: MessageViewProps) => {
  const replies = messages.filter((m) => m.inReplyTo === message.id);
  return (
    <div className='ml-8'>
      <div className='bg-white p-4 rounded border border-slate-300 shadow drop-shadow w-full'>
        <div className='flex justify-between mb-4 text-stone-400 text-sm'>
          <p>{message.from}</p>
          <p>{formatDate(message.ts)}</p>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(message.body, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
          }}
        />
      </div>

      {replies.length > 0 && (
        <div className='flex items-stretch pt-8'>
          <div className='w-0.5 bg-slate-200' />
          <div className='w-full flex flex-col gap-y-8'>
            {replies.map((reply) => (
              <MessageView key={reply.id} message={reply} messages={messages} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageView;
