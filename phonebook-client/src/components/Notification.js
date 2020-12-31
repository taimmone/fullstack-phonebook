const Notification = ({ message, error = false }) => (
  <div className={`notification${error ? ' error' : ''}`}>{message}</div>
);
export default Notification;
