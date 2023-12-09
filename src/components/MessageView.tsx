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
      <div className='flex justify-between'>
        <p>{message.from}</p>
        <p>{formatDate(message.ts)}</p>
      </div>
      {replies.map((reply) => (
        <MessageView key={reply.id} message={reply} messages={messages} />
      ))}
    </div>
  );
};

export default MessageView;
