import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosWarning } from "react-icons/io";

const StatusDisplay = ({ message, onRetry, type = 'error' }) => {
  const isError = type === 'error';
  
  const styles = {
    container: {
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
      margin: '20px',
      fontFamily: 'sans-serif',
      border: isError ? '1px solid #ff4d4f' : '1px solid #faad14',
      backgroundColor: isError ? '#fff2f0' : '#fffbe6',
      color: isError ? '#cf1322' : '#d46b08'
    },
    button: {
      padding: '8px 16px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: isError ? '#cf1322' : '#d46b08'
    }
  };

  return (
    <div style={styles.container}>
      {isError ? (
        <RiErrorWarningFill size={48} style={{ marginBottom: '10px' }} />
      ) : (
        <IoIosWarning size={48} style={{ marginBottom: '10px' }} />
      )}
      
      <h3 style={{ margin: '0 0 10px 0' }}>{isError ? 'System Error' : 'Warning'}</h3>
      <p style={{ margin: '0 0 15px 0' }}>{message}</p>
      
      {onRetry && (
        <button onClick={onRetry} style={styles.button}>Try Again</button>
      )}
    </div>
  );
};

export default StatusDisplay;