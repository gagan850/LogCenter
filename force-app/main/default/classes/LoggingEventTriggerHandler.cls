public without sharing class LoggingEventTriggerHandler implements ITriggerHandler {
    public static Boolean TriggerDisabled = false;

    public Boolean isDisabled() {
        return TriggerDisabled;
    }
    
    public void beforeInsert(List<sObject> newList) {}

    public void afterInsert(List<LogEvent__e> logEvents, Map<Id, sObject> newMap) {
        List<CommonLog__c> commonLogs = new List<CommonLog__c>();
    
        for (LogEvent__e logEvent : logEvents) {
            CommonLog__c commonLog = new CommonLog__c(
                ComponentType__c    = logEvent.ComponentType__c,
                ComponentName__c    = logEvent.ComponentName__c,
                LoggingLevel__c     = logEvent.LoggingLevel__c,
                OwnerId   			= logEvent.UserId__c,   
                Message__c          = logEvent.Message__c,
                Feature__c     		= logEvent.Feature__c ,
                SessionId__c        = logEvent.SessionId__c 
      		);
            
          commonLogs.add(commonLog);
        }
        insert commonLogs;
    }
    
    public void beforeUpdate(List<sObject> newList, Map<Id, sObject> newMap,  List<sObject> oldList, Map<Id, sObject> oldMap) {}

    public void afterUpdate(List<sObject> newList, Map<Id, sObject> newMap, List<sObject> oldList, Map<Id, sObject> oldMap) {}

    public void beforeDelete(List<sObject> oldList , Map<Id, sObject> oldMap) {}

    public void afterDelete(List<sObject> oldList , Map<Id, sObject> oldMap) {}

    public void afterUnDelete(List<sObject> newList, Map<Id, sObject> newMap) {}
}