/**
* @name: AbstractLogger
* @description: abstract class for logging
* @author: Gagandeep Bansal
* @date: 10/02/2024
* @group Logging Framework   
*/
public abstract class AbstractLogger { 

    private static final String DEFAULT_LOGGING_LEVEL_KEY   = 'Default';

    
    //to store custom settings
    private boolean isLoggingEnabled = false; 
    private LoggingLevel defaultLoggingLevel;
    
    /*
    *    LoggingLevel    ordinal 
    *       NONE            0
    *       INTERNAL        1
    *       FINEST          2
    *       FINER           3
    *       FINE            4
    *       DEBUG           5
    *       INFO            6
    *       WARN            7
    *       ERROR           8
    */

    private void populateLoggingConfigurations () {
        List<LoggingConfigurations__c > logConfSettings = [SELECT LoggingLevel__c, LoggingEnabled__c  FROM LoggingConfigurations__c];
        if (logConfSettings.size() > 0) {
                this.isLoggingEnabled                     = logConfSettings[0].LoggingEnabled__c;
                this.defaultLoggingLevel                  = LoggingLevel.NONE;
               
                for (LoggingLevel systemLoggingLevel : LoggingLevel.values()) {
                    if (systemLoggingLevel.name() == logConfSettings[0].LoggingLevel__c) {
                        this.defaultLoggingLevel = systemLoggingLevel;
                        break;
                    }
                }                         
             
        } 
    }
    
    protected void log (LoggingLevel logLevel, String feature, String componentType, String componentName, String message) {
        populateLoggingConfigurations(); 
        
        if (!this.isLoggingEnabled) {
            return;
        }
        
        if (LoggingLevel.NONE == this.defaultLoggingLevel) {
            return;
        }
        
        if (this.defaultLoggingLevel.ordinal() <= logLevel.ordinal()) {
            LogEvent__e logEvent = createLogEvent(feature, componentType, componentName, logLevel.name(), message);
            publishLogEvent(logEvent);
        }   
    }

    
    private LogEvent__e createLogEvent (String feature, String componentType, String componentName, String loggingLevel, String message) {
        
        LogEvent__e event = new LogEvent__e(
            ComponentType__c     		= componentType,
            ComponentName__c     		= componentName,
            Feature__c 					= feature,
            LoggingLevel__c    			= loggingLevel,
            Message__c          		= message == null ? null : String.valueOf(message),
            UserId__c  					= UserInfo.getUserId()
        );
        return event;
    }

    private void publishLogEvent (LogEvent__e logEvent) {
        try {
            EventBus.publish(logEvent);
        } catch (DMLException ex) {
            System.debug ('Error while logging : ' + ex.getMessage()); 
        }
    }
}