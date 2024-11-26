/**
* @name: Logger
* @description: Logger, to log the messages
* @author: Gagan Bansal
* @date: 10/02/2025 
* @group Logging Framework   
*/
global class Logger extends AbstractLogger { 

    private String componentType { get; set; }

    public Logger () {
    	this.componentType = 'Apex';
    }
    
    public Logger (String componentType) {
        this.componentType = componentType;
    } 

    /**
    * @description to generate trace logs
    * @param methodName method name for which log is to generate
    * @param message trace message to log
    */
    public void fine (String feature, String methodName, String message) {
        log (LoggingLevel.FINE, feature, this.componentType, methodName, message);
    }

    /**
    * @description to generate trace logs
    * @param methodName method name for which log is to generate
    * @param message trace message to log
    * @param arguments  helps to generate the log message using placeholders
    */
    public void fine (String feature, String methodName, String message, Object[] arguments) {
        log (LoggingLevel.FINE, feature, this.componentType, methodName, String.format(message, arguments));
    }

    /**
    * @description to generate debug logs
    * @param methodName method name for which log is to generate
    * @param message debug message to log
    */
    public void debug (String feature, String methodName, String message) {
        log (LoggingLevel.DEBUG, feature, this.componentType, methodName, message);
    }

    /**
    * @description to generate debug logs
    * @param methodName method name for which log is to generate
    * @param message debug message to log
    * @param arguments  helps to generate the log message using placeholders
    */
    public void debug (String feature, String methodName, String message, Object[] arguments) {
        log (LoggingLevel.DEBUG, feature, this.componentType, methodName, String.format(message, arguments)); 
    }
    
    /**
    * @description to generate info logs
    * @param methodName method name for which log is to generate
    * @param message info message to log
    */
    public void info (String feature, String methodName, String message) {
        log (LoggingLevel.INFO, feature, this.componentType, methodName, message);
    }

    /**
    * @description to generate info logs
    * @param methodName method name for which log is to generate
    * @param message info message to log
    * @param arguments  helps to generate the log message using placeholders
    */
    public void info (String feature, String methodName, String message, Object[] arguments) {
        log (LoggingLevel.INFO, feature, this.componentType, methodName, String.format(message, arguments));
    }

    /**
    * @description to generate warn logs
    * @param methodName method name for which log is to generate
    * @param message warn message to log
    */
    public void warn (String feature, String methodName, String message) {
        log (LoggingLevel.WARN, feature, this.componentType, methodName, message);
    }

    /**
    * @description to generate warn logs
    * @param methodName method name for which log is to generate
    * @param message warn message to log
    * @param arguments  helps to generate the log message using placeholders
    */
    public void warn (String feature, String methodName, String message, Object[] arguments) {
        log (LoggingLevel.WARN, feature, this.componentType, methodName, String.format(message, arguments));
    }

    /**
    * @description to generate error logs
    * @param methodName method name for which log is to generate
    * @param message error message to log
    */
    public void error (String feature, String methodName, String message) {
        log (LoggingLevel.ERROR, feature, this.componentType, methodName, message);
    }

    /**
    * @description to generate error logs
    * @param methodName method name for which log is to generate
    * @param message error message to log
    * @param arguments  helps to generate the log message using placeholders
    */
    public void error (String feature, String methodName, String message, Object[] arguments) {
        log (LoggingLevel.ERROR, feature, this.componentType, methodName, String.format(message, arguments));
    }
    
    /**
    * @description to generate error logs
    * @param methodName method name for which log is to generate
    * @param message error message to log
    * @param ex to log the exception stacktrace
    */
    public void error (String feature, String methodName, String message, Exception ex) {
        String errorDetails = ex != null? '\nCause: ' + ex.getCause() + ', Line number: ' + ex.getLineNumber()+', Stack trace: ' + ex.getStackTraceString():'';
        log (LoggingLevel.ERROR, feature, this.componentType, methodName, message+errorDetails);
    }

    /**
    * @description to generate error logs
    * @param methodName method name for which log is to generate
    * @param message error message to log
    * @param arguments  helps to generate the log message using placeholders
    * @param ex to log the exception stacktrace
    */
    public void error (String feature, String methodName, String message, Object[] arguments, Exception ex) {        
        String errorDetails = ex != null? '\nCause: ' + ex.getCause() + ', Line number: ' + ex.getLineNumber()+', Stack trace: ' + ex.getStackTraceString():'';
        log (LoggingLevel.ERROR, feature, this.componentType, methodName, String.format(message, arguments)+errorDetails);

    }
    
    private LoggingLevel getLoggingLevel (String level) {
        switch on level {
            when 'FINE' {
                return LoggingLevel.FINE;
            } 
             when 'DEBUG' {
                return LoggingLevel.DEBUG;
            }
            when 'INFO' {
                return LoggingLevel.INFO;
            }
             when 'WARN' {
                return LoggingLevel.WARN;
            }
             when else {
                return LoggingLevel.ERROR;
            }
        }
    }
    
    
    //For LWC components
    @AuraEnabled
    public static void logMessage(String logLevel, String feature, String componentName, String message) {
        Logger logger = new Logger('LWC');
        LoggingLevel level = logger.getLoggingLevel(logLevel);
    	logger.log (level, feature, logger.componentType, componentName, message);
    }
    
}