import React from 'react';
import { RiErrorWarningFill } from "react-icons/ri";
import { IoIosWarning } from "react-icons/io";
import '../../Scss/StatusDisplay.scss'; 

const StatusDisplay = ({ message, onRetry, type = 'error' }) => {
  const isError = type === 'error';

  return (
    <div className={`status-display-container ${isError ? '--error' : '--warning'}`}>
      {isError ? (
        <RiErrorWarningFill size={48} className="status-display-icon" />
      ) : (
        <IoIosWarning size={48} className="status-display-icon" />
      )}
      
      <h3 className="status-display-title">
        {isError ? 'System Error' : 'Warning'}
      </h3>
      
      <p className="status-display-message">
        {message}
      </p>
      
      {onRetry && (
        <button onClick={onRetry} className="status-display-btn">
          Try Again
        </button>
      )}
    </div>
  );
};

export default StatusDisplay;