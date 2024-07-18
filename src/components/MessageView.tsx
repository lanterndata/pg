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

export interface Message {
  id: string;
  fromName: string;
  fromAddress: string;
  subject: string | null;
  ts: Date;
  body: string | null;
  inReplyTo: string | null;
}

interface MessageViewProps {
  message: Message;
  messages: Message[];
}

function startsWithQuote(line: string) {
  const l = line.trim();
  return l.startsWith('&gt;') || l.startsWith('>');
}

function isLineLight(line: string) {
  return (
    (line && line.includes('________________________________')) ||
    line.includes('Sent from my iPhone') ||
    line.includes('Sent from my Galaxy') ||
    line.startsWith('-- ') ||
    startsWithQuote(line)
  );
}

const MessageView = ({ message, messages }: MessageViewProps) => {
  const replies = messages.filter((m) => m.inReplyTo === message.id);
  return (
    <div className='ml-8'>
      <div className='bg-slate-50 p-4 rounded border border-slate-300 shadow drop-shadow w-full'>
        <div className='flex justify-between mb-4 text-stone-400 text-sm'>
          <p>{message.fromName}</p>
          <p>{formatDate(message.ts)}</p>
        </div>
        {message.body
          ?.trim()
          .split('\n')
          .map((line, index) => (
            <p
              key={message.id + '-' + index}
              className={isLineLight(line) ? 'text-stone-400' : ''}
            >
              {line.trim() === '' ? '\u00A0' : line}
            </p>
          ))}
      </div>

      {replies.length > 0 && (
        <div className='flex items-stretch pt-8'>
          <div className='w-0.5 bg-slate-300' />
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
